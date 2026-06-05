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
    const companyName = String(body.companyName ?? "").trim();
    const sessionEmail = session.user.email.trim().toLowerCase();

    if (!companyName) {
      return NextResponse.json(
        { error: "회사 또는 팀 이름을 입력해주세요." },
        { status: 400 },
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
        companyId: true,
      },
    });

    if (existingUser?.companyId) {
      return NextResponse.json(
        { error: "이미 워크스페이스에 소속된 사용자입니다." },
        { status: 409 },
      );
    }

    const { company, user } = await prisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: companyName,
        },
      });

      const user = existingUser
        ? await tx.user.update({
            where: {
              id: existingUser.id,
            },
            data: {
              email: sessionEmail,
              name: session.user?.name ?? null,
              image: session.user?.image ?? null,
              role: Role.ADMIN,
              companyId: company.id,
            },
          })
        : await tx.user.create({
            data: {
              email: sessionEmail,
              name: session.user?.name ?? null,
              image: session.user?.image ?? null,
              role: Role.ADMIN,
              companyId: company.id,
            },
          });

      return {
        company,
        user,
      };
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
