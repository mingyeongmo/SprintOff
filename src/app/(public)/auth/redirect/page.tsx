import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const AuthRedirectPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      companyId: true,
      role: true,
    },
  });

  if (!user?.companyId) {
    redirect("/onboarding");
  }

  if (user.role === Role.ADMIN) {
    redirect("/admin/dashboard");
  }

  redirect("/dashboard");
};

export default AuthRedirectPage;
