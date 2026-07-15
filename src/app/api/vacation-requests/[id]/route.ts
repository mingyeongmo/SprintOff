import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { Role, VacationStatus } from "@prisma/client";
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const isReviewStatus = (
  status: unknown
): status is typeof VacationStatus.APPROVED | typeof VacationStatus.REJECTED =>
  status === VacationStatus.APPROVED || status === VacationStatus.REJECTED;

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    if (!isReviewStatus(body.status)) {
      return NextResponse.json(
        { error: "승인 또는 반려 상태만 처리할 수 있습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findFirst({
      where: {
        email: {
          equals: session.user.email.trim().toLowerCase(),
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        role: true,
        companyId: true,
      },
    });

    if (!admin?.companyId) {
      return NextResponse.json(
        { error: "워크스페이스에 소속된 사용자만 처리할 수 있습니다." },
        { status: 403 }
      );
    }

    if (admin.role !== Role.ADMIN) {
      return NextResponse.json(
        { error: "관리자만 휴가 신청을 처리할 수 있습니다." },
        { status: 403 }
      );
    }

    const vacationRequest = await prisma.vacationRequest.findFirst({
      where: {
        id,
        companyId: admin.companyId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!vacationRequest) {
      return NextResponse.json(
        { error: "휴가 신청을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (vacationRequest.status !== VacationStatus.PENDING) {
      return NextResponse.json(
        { error: "이미 처리된 휴가 신청입니다." },
        { status: 409 }
      );
    }

    const rejectReason =
      typeof body.rejectReason === "string" ? body.rejectReason.trim() : "";

    if (body.status === VacationStatus.REJECTED && !rejectReason) {
      return NextResponse.json(
        { error: "반려 사유를 입력해주세요." },
        { status: 400 }
      );
    }

    const updatedRequest = await prisma.vacationRequest.update({
      where: {
        id: vacationRequest.id,
      },
      data: {
        status: body.status,
        reviewedById: admin.id,
        reviewedAt: new Date(),
        rejectReason:
          body.status === VacationStatus.REJECTED ? rejectReason || null : null,
      },
      select: {
        id: true,
        status: true,
        reviewedAt: true,
        rejectReason: true,
      },
    });

    return NextResponse.json({
      success: true,
      vacationRequest: updatedRequest,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
