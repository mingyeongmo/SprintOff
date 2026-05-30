import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";

type InviteAcceptPageProps = {
  params: Promise<{
    token: string;
  }>;
};

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const destinationByRole = (role: Role) =>
  role === Role.ADMIN ? "/admin/dashboard" : "/dashboard";

const InvitationResult = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <main className="onboarding-page">
      <section className="form-panel">
        <p className="eyebrow">SprintOff Invitation</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </section>
    </main>
  );
};

const InviteAcceptPage = async ({ params }: InviteAcceptPageProps) => {
  const { token } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/invite/${token}`);
  }

  const sessionEmail = normalizeEmail(session.user.email);

  const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      companyId: true,
      expiresAt: true,
    },
  });

  if (!invitation) {
    return (
      <InvitationResult
        title="초대장을 찾을 수 없습니다."
        description="초대 링크가 잘못되었거나 삭제된 초대장입니다."
      />
    );
  }

  if (
    invitation.status !== InvitationStatus.PENDING ||
    invitation.expiresAt <= new Date()
  ) {
    if (
      invitation.status === InvitationStatus.PENDING &&
      invitation.expiresAt <= new Date()
    ) {
      await prisma.invitation.update({
        where: {
          id: invitation.id,
        },
        data: {
          status: InvitationStatus.EXPIRED,
        },
      });
    }

    return (
      <InvitationResult
        title="초대장이 만료되었습니다."
        description="관리자에게 초대 재발송을 요청해주세요."
      />
    );
  }

  if (normalizeEmail(invitation.email) !== sessionEmail) {
    return (
      <InvitationResult
        title="로그인한 계정이 초대 이메일과 다릅니다."
        description={`${invitation.email} 계정으로 다시 로그인한 뒤 초대를 수락해주세요.`}
      />
    );
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: sessionEmail,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      role: true,
      companyId: true,
    },
  });

  if (existingUser?.companyId && existingUser.companyId !== invitation.companyId) {
    return (
      <InvitationResult
        title="이미 다른 워크스페이스에 속해 있습니다."
        description="현재 계정은 다른 회사에 연결되어 있어 이 초대를 수락할 수 없습니다."
      />
    );
  }

  const targetRole =
    existingUser?.companyId === invitation.companyId
      ? existingUser.role
      : invitation.role;

  await prisma.$transaction(async (tx) => {
    if (existingUser) {
      await tx.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          name: session.user?.name ?? undefined,
          image: session.user?.image ?? undefined,
          role: targetRole,
          companyId: invitation.companyId,
        },
      });
    } else {
      await tx.user.create({
        data: {
          email: sessionEmail,
          name: session.user?.name ?? null,
          image: session.user?.image ?? null,
          role: invitation.role,
          companyId: invitation.companyId,
        },
      });
    }

    await tx.invitation.update({
      where: {
        id: invitation.id,
      },
      data: {
        status: InvitationStatus.ACCEPTED,
        acceptedAt: new Date(),
      },
    });
  });

  redirect(destinationByRole(targetRole));
};

export default InviteAcceptPage;
