import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth/auth";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const { companyName } = body;

    const company = await prisma.company.create({
      data: {
        name: companyName,
      },
    });

    const user = await prisma.user.create({
      data: {
        email: session.user.email,

        name: session.user.name ?? null,
        image: session.user.image ?? null,

        role: Role.ADMIN,

        companyId: company.id,
      },
    });

    return NextResponse.json({
      success: true,
      company,
      user,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
