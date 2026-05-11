import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const company = await prisma.company.create({
    data: {
      name: "A회사",
    },
  });

  const user = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "민경모",

      role: "ADMIN",

      companyId: company.id,
    },
  });

  return NextResponse.json({
    company,
    user,
  });
}
