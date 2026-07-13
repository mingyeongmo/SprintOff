import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import VacationManageClient from "./VacationManageClient";
import "@/styles/admin/vacation-manage.scss";

const AdminVacationManagePage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const admin = await prisma.user.findFirst({
    where: {
      email: {
        equals: session.user.email.trim().toLowerCase(),
        mode: "insensitive",
      },
    },
    select: {
      companyId: true,
    },
  });

  if (!admin?.companyId) {
    redirect("/onboarding");
  }

  const vacationRequests = await prisma.vacationRequest.findMany({
    where: {
      companyId: admin.companyId,
    },
    select: {
      id: true,
      type: true,
      status: true,
      startDate: true,
      endDate: true,
      reason: true,
      createdAt: true,

      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <VacationManageClient
      requests={vacationRequests.map((request) => ({
        ...request,
        startDate: request.startDate.toISOString(),
        endDate: request.endDate.toISOString(),
        createdAt: request.createdAt.toISOString(),
      }))}
    />
  );
};

export default AdminVacationManagePage;
