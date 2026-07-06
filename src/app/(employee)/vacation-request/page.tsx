import { auth } from "@/auth/auth";
import { prisma } from "@/lib/prisma";
import { Role, VacationType } from "@prisma/client";
import VacationRequestForm from "./VacationRequestForm";
import "@/styles/vacation/vacation-request.scss";

type VacationRequestPayload = {
  type: VacationType;
  startDate: string;
  endDate: string;
  reason: string;
};

const isDateInput = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

const submitVacationRequestAction = async (payload: VacationRequestPayload) => {
  "use server";

  const session = await auth();

  if (!session?.user?.email) {
    return { success: false as const, error: "로그인이 필요합니다." };
  }

  const user = await prisma.user.findFirst({
    where: {
      email: {
        equals: session.user.email.trim().toLowerCase(),
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      companyId: true,
      role: true,
    },
  });

  if (!user?.companyId) {
    return {
      success: false as const,
      error: "워크스페이스에 가입한 사용자만 휴가를 신청할 수 있습니다.",
    };
  }

  if (user.role !== Role.EMPLOYEE) {
    return {
      success: false as const,
      error: "직원 계정만 휴가를 신청할 수 있습니다.",
    };
  }

  if (!Object.values(VacationType).includes(payload.type)) {
    return { success: false as const, error: "올바른 휴가 유형이 아닙니다." };
  }

  if (!isDateInput(payload.startDate) || !isDateInput(payload.endDate)) {
    return { success: false as const, error: "휴가 날짜를 선택해주세요." };
  }

  if (payload.startDate > payload.endDate) {
    return {
      success: false as const,
      error: "종료일은 시작일보다 빠를 수 없습니다.",
    };
  }

  const reason = payload.reason.trim();

  if (reason.length < 10) {
    return {
      success: false as const,
      error: "휴가 사유를 10자 이상 입력해주세요.",
    };
  }

  const vacationRequest = await prisma.vacationRequest.create({
    data: {
      userId: user.id,
      companyId: user.companyId,
      type: payload.type,
      startDate: new Date(`${payload.startDate}T00:00:00.000Z`),
      endDate: new Date(`${payload.endDate}T00:00:00.000Z`),
      reason,
    },
    select: {
      id: true,
      status: true,
    },
  });

  console.log("Vacation request created:", {
    ...payload,
    id: vacationRequest.id,
    status: vacationRequest.status,
  });

  return {
    success: true as const,
    requestId: vacationRequest.id,
    status: vacationRequest.status,
  };
};

const VacationRequestPage = () => {
  return (
    <section className="vacation-request">
      <VacationRequestForm
        submitVacationRequestAction={submitVacationRequestAction}
      />

      <aside className="vacation-request__aside">
        <section className="form-panel vacation-request__side-card">
          <div className="vacation-request__side-title">
            <h2>내 연차 현황</h2>
            <a href="/vacation-history">상세보기</a>
          </div>

          <div>
            <strong className="vacation-request__days">12일</strong>
            <span className="vacation-request__total-days">/ 총 15일</span>
          </div>

          <div className="vacation-request__progress">
            <span className="vacation-request__progress-used" />
            <span className="vacation-request__progress-pending" />
          </div>

          <div className="vacation-request__status-row">
            <span>사용완료 3일</span>
            <span>신청중 2일</span>
            <span>잔여 10일</span>
          </div>
        </section>

        <section className="form-panel vacation-request__side-card">
          <h2>팀 일정 확인</h2>
          <div className="vacation-request__warning">
            선택한 기간에 같은 팀원 2명의 휴가 일정이 있습니다.
          </div>

          <ul className="vacation-request__mini-list">
            <li>
              <strong>박민수</strong>
              <span>연차 05.24 - 05.26</span>
            </li>
            <li>
              <strong>이영희</strong>
              <span>출장 05.26 - 05.28</span>
            </li>
          </ul>
        </section>

        <section className="form-panel vacation-request__side-card">
          <h2>최근 신청 내역</h2>
          <ul className="vacation-request__mini-list">
            <li>
              <div>
                <strong>반차 오후</strong>
                <span>2026.04.15</span>
              </div>
              <em>승인완료</em>
            </li>
            <li>
              <div>
                <strong>연차 1일</strong>
                <span>2026.03.02</span>
              </div>
              <em>승인완료</em>
            </li>
          </ul>
        </section>
      </aside>
    </section>
  );
};

export default VacationRequestPage;
