import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { redirect } from "next/navigation";

const AuthRedirectPage = async () => {
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

  if (!user?.companyId) {
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

    redirect("/onboarding");
  }

  if (user.role === Role.ADMIN) {
    redirect("/admin/dashboard");
  }

  redirect("/dashboard");
};

export default AuthRedirectPage;
