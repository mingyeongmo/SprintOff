import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { InviteAcceptButton } from "./InviteAcceptButton";

type InvitePageProps = {
  params: Promise<{
    token: string;
  }>;
};

const roleLabel = {
  [Role.ADMIN]: "관리자",
  [Role.EMPLOYEE]: "팀원",
};

const InvitePage = async ({ params }: InvitePageProps) => {
  const { token } = await params;

  const invitation = await prisma.invitation.findUnique({
    where: {
      token,
    },
    select: {
      email: true,
      role: true,
      status: true,
      expiresAt: true,
      company: {
        select: {
          name: true,
        },
      },
      invitedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  const isAvailable =
    invitation?.status === InvitationStatus.PENDING &&
    invitation.expiresAt > new Date();

  return (
    <main className="onboarding-page">
      <section className="form-panel">
        <p className="eyebrow">SprintOff Invitation</p>

        {!invitation ? (
          <>
            <h1>초대장을 찾을 수 없습니다.</h1>
            <p>초대 링크가 잘못되었거나 삭제된 초대장입니다.</p>
          </>
        ) : !isAvailable ? (
          <>
            <h1>초대장이 만료되었습니다.</h1>
            <p>관리자에게 초대 재발송을 요청해주세요.</p>
          </>
        ) : (
          <>
            <h1>{invitation.company.name}에 초대되었습니다.</h1>
            <p>
              {invitation.invitedBy.name ?? invitation.invitedBy.email}님이{" "}
              {invitation.email} 계정을 {roleLabel[invitation.role]} 권한으로
              초대했습니다.
            </p>
            <p>초대를 수락하려면 초대받은 Google 계정으로 로그인해주세요.</p>
            <InviteAcceptButton token={token} />
          </>
        )}
      </section>
    </main>
  );
};

export default InvitePage;
