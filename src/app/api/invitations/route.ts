import { auth } from "@/auth/auth";
import { sendInvitationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { InvitationStatus, Role } from "@prisma/client";
import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

const INVITATION_EXPIRES_IN_DAYS = 7;

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const createInvitationToken = () => randomBytes(32).toString("hex");

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isRole = (role: unknown): role is Role =>
  role === Role.ADMIN || role === Role.EMPLOYEE;

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const invitedEmail = normalizeEmail(String(body.email ?? ""));
    const invitedRole = isRole(body.role) ? body.role : Role.EMPLOYEE;

    if (!isValidEmail(invitedEmail)) {
      return NextResponse.json(
        { error: "올바른 이메일을 입력해주세요." },
        { status: 400 },
      );
    }

    const inviter = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizeEmail(session.user.email),
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!inviter?.companyId || !inviter.company) {
      return NextResponse.json(
        { error: "워크스페이스를 먼저 생성해주세요." },
        { status: 403 },
      );
    }

    if (inviter.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "관리자만 팀원을 초대할 수 있습니다." },
        { status: 403 },
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: invitedEmail,
          mode: "insensitive",
        },
      },
      select: {
        companyId: true,
      },
    });

    if (existingUser?.companyId === inviter.companyId) {
      return NextResponse.json(
        { error: "이미 같은 워크스페이스에 속한 이메일입니다." },
        { status: 409 },
      );
    }

    if (existingUser?.companyId && existingUser.companyId !== inviter.companyId) {
      return NextResponse.json(
        { error: "이미 다른 워크스페이스에 속한 이메일입니다." },
        { status: 409 },
      );
    }

    const now = new Date();
    const expiresAt = addDays(now, INVITATION_EXPIRES_IN_DAYS);

    const pendingInvitation = await prisma.invitation.findFirst({
      where: {
        companyId: inviter.companyId,
        email: invitedEmail,
        status: InvitationStatus.PENDING,
      },
    });

    if (pendingInvitation && pendingInvitation.expiresAt <= now) {
      await prisma.invitation.update({
        where: {
          id: pendingInvitation.id,
        },
        data: {
          status: InvitationStatus.EXPIRED,
        },
      });
    }

    const reusableInvitation =
      pendingInvitation && pendingInvitation.expiresAt > now
        ? await prisma.invitation.update({
            where: {
              id: pendingInvitation.id,
            },
            data: {
              role: invitedRole,
              expiresAt,
            },
          })
        : await prisma.invitation.create({
            data: {
              email: invitedEmail,
              role: invitedRole,
              token: createInvitationToken(),
              companyId: inviter.companyId,
              invitedById: inviter.id,
              expiresAt,
            },
          });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(req.url).origin;
    const inviteUrl = new URL(
      `/invite/${reusableInvitation.token}`,
      appUrl,
    ).toString();

    await sendInvitationEmail({
      to: invitedEmail,
      companyName: inviter.company.name,
      invitedByName: inviter.name ?? inviter.email,
      inviteUrl,
      expiresAt: reusableInvitation.expiresAt,
      role: reusableInvitation.role,
    });

    return NextResponse.json({
      success: true,
      invitationId: reusableInvitation.id,
      inviteUrl,
      resent: Boolean(pendingInvitation && pendingInvitation.expiresAt > now),
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message.includes("RESEND_API_KEY is not configured")
    ) {
      return NextResponse.json(
        { error: "이메일 발송 설정이 필요합니다. RESEND_API_KEY를 등록해주세요." },
        { status: 500 },
      );
    }

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
