import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { OnboardingForm } from "./OnboardingForm";

const destinationByRole = (role: Role) =>
  role === Role.ADMIN ? "/admin/dashboard" : "/dashboard";

const OnboardingPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const sessionEmail = session.user.email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: sessionEmail,
        mode: "insensitive",
      },
    },
    select: {
      companyId: true,
      role: true,
    },
  });

  if (user?.companyId) {
    redirect(destinationByRole(user.role));
  }

  const invitation = await prisma.invitation.findFirst({
    where: {
      email: sessionEmail,
      status: InvitationStatus.PENDING,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      token: true,
    },
  });

  if (invitation) {
    redirect(`/invite/${invitation.token}`);
  }

  return (
    <main className="onboarding-page">
      <section className="form-panel">
        <p className="eyebrow">Workspace Setup</p>
        <h1>회사 정보를 등록하세요.</h1>
        <p>
          SprintOff에서 함께 휴가 일정을 관리할 조직 또는 팀 이름을 입력하면
          관리자 대시보드가 생성됩니다.
        </p>

        <OnboardingForm />
      </section>
    </main>
  );
};

export default OnboardingPage;
