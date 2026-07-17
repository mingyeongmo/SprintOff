"use client";

import type { VacationStatus, VacationType } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import VacationRequestDetailPanel from "./VacationRequestDetailPanel";

export type VacationManageRequest = {
  id: string;
  type: VacationType;
  status: VacationStatus;
  startDate: string;
  endDate: string;
  reason: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string;
  };
};

type VacationManageClientProps = {
  requests: VacationManageRequest[];
};

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED";
type ReviewStatus = "APPROVED" | "REJECTED";
type ReviewResponse = {
  success?: boolean;
  error?: string;
};

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "전체", value: "ALL" },
  { label: "대기", value: "PENDING" },
  { label: "승인", value: "APPROVED" },
  { label: "반려", value: "REJECTED" },
];

const STATUS_LABELS: Record<VacationStatus, string> = {
  PENDING: "승인 대기",
  APPROVED: "승인 완료",
  REJECTED: "반려",
  CANCELED: "취소됨",
};

const VACATION_TYPE_LABELS: Record<VacationType, string> = {
  ANNUAL: "연차",
  HALF_DAY: "반차",
  SICK: "병가",
  ETC: "기타",
};

const formatDate = (date: string) => date.slice(0, 10).replaceAll("-", ".");

const VacationManageClient = ({ requests }: VacationManageClientProps) => {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("PENDING");
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filteredRequests =
    statusFilter === "ALL"
      ? requests
      : requests.filter((request) => request.status === statusFilter);

  const selectedRequest =
    requests.find((request) => request.id === selectedRequestId) ?? null;

  const pendingCount = requests.filter(
    (request) => request.status === "PENDING",
  ).length;

  const approvedCount = requests.filter(
    (request) => request.status === "APPROVED",
  ).length;

  const rejectedCount = requests.filter(
    (request) => request.status === "REJECTED",
  ).length;

  const changeFilter = (filter: StatusFilter) => {
    setStatusFilter(filter);
    setSelectedRequestId(null);
    setErrorMessage("");
  };

  const reviewRequest = async (status: ReviewStatus, rejectReason?: string) => {
    if (!selectedRequest || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const response = await fetch(`/api/vacation-requests/${selectedRequest.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        rejectReason,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as ReviewResponse;

    if (!response.ok) {
      setErrorMessage(data.error ?? "휴가 신청 처리에 실패했습니다.");
      setIsSubmitting(false);
      return;
    }

    setSelectedRequestId(null);
    setIsSubmitting(false);
    router.refresh();
  };

  return (
    <section className="vacation-manage">
      <div className="vacation-manage__stats">
        <article className="vacation-manage__stat is-pending">
          <span>승인 대기</span>
          <strong>{pendingCount}</strong>
        </article>
        <article className="vacation-manage__stat is-approved">
          <span>승인 완료</span>
          <strong>{approvedCount}</strong>
        </article>
        <article className="vacation-manage__stat is-rejected">
          <span>반려</span>
          <strong>{rejectedCount}</strong>
        </article>
      </div>

      <div
        className={
          selectedRequest
            ? "vacation-manage__workspace has-detail"
            : "vacation-manage__workspace"
        }
      >
        <section className="vacation-manage__list-panel">
          <div className="vacation-manage__toolbar">
            <div>
              <h2>휴가 신청 목록</h2>
              <p>신청 행을 선택하면 상세 내용을 확인할 수 있습니다.</p>
            </div>

            <div
              className="vacation-manage__filters"
              aria-label="신청 상태 필터"
            >
              {FILTERS.map((filter) => (
                <button
                  className={statusFilter === filter.value ? "is-active" : ""}
                  key={filter.value}
                  type="button"
                  onClick={() => changeFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="vacation-manage__table-wrap">
            <table>
              <thead>
                <tr>
                  <th>신청자</th>
                  <th>유형</th>
                  <th>기간</th>
                  <th>신청일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td className="vacation-manage__empty" colSpan={5}>
                      해당 상태의 휴가 신청이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const applicantName =
                      request.user.name ?? request.user.email;

                    return (
                      <tr
                        aria-selected={selectedRequestId === request.id}
                        className={
                          selectedRequestId === request.id ? "is-selected" : ""
                        }
                        key={request.id}
                        tabIndex={0}
                        onClick={() => {
                          setSelectedRequestId(request.id);
                          setErrorMessage("");
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            setSelectedRequestId(request.id);
                            setErrorMessage("");
                          }
                        }}
                      >
                        <td>
                          <div className="vacation-manage__applicant">
                            <span aria-hidden="true">
                              {applicantName.slice(0, 1)}
                            </span>
                            <div>
                              <strong>{applicantName}</strong>
                              <small>{request.user.email}</small>
                            </div>
                          </div>
                        </td>
                        <td>{VACATION_TYPE_LABELS[request.type]}</td>
                        <td>
                          {formatDate(request.startDate)} -{" "}
                          {formatDate(request.endDate)}
                        </td>
                        <td>{formatDate(request.createdAt)}</td>
                        <td>
                          <span
                            className={`vacation-manage__status is-${request.status.toLowerCase()}`}
                          >
                            {STATUS_LABELS[request.status]}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {selectedRequest && (
          <VacationRequestDetailPanel
            selectedRequest={selectedRequest}
            errorMessage={errorMessage}
            isSubmitting={isSubmitting}
            onClose={() => setSelectedRequestId(null)}
            onApprove={() => reviewRequest("APPROVED")}
            onReject={(rejectReason) => reviewRequest("REJECTED", rejectReason)}
            formatDate={formatDate}
            vacationTypeLabel={VACATION_TYPE_LABELS[selectedRequest.type]}
          />
        )}
      </div>
    </section>
  );
};

export default VacationManageClient;
