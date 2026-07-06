import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  console.log(vacationRequests);

  return <pre>{JSON.stringify(vacationRequests, null, 2)}</pre>;
};

export default AdminVacationManagePage;
