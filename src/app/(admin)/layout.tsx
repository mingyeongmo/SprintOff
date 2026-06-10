import { auth } from "@/auth/auth";
import DashboardShell from "@/components/layout/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: session.user.email.trim().toLowerCase(),
        mode: "insensitive",
      },
    },
    select: {
      companyId: true,
      role: true,
    },
  });

  if (!user?.companyId) {
    redirect("/onboarding");
  }

  if (user.role !== Role.ADMIN) {
    redirect("/dashboard");
  }

  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
};

export default AdminLayout;
