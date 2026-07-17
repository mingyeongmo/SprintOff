import { useState } from "react";
import type { VacationManageRequest } from "./VacationManageClient";

type VacationRequestDetailPanelProps = {
  selectedRequest: VacationManageRequest;
  errorMessage: string;
  isSubmitting: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: (rejectReason: string) => void;
  formatDate: (date: string) => string;
  vacationTypeLabel: string;
};

const calculateDays = (startDate: string, endDate: string) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const difference =
    new Date(endDate).getTime() - new Date(startDate).getTime();

  return Math.floor(difference / millisecondsPerDay) + 1;
};

const VacationRequestDetailPanel = ({
  selectedRequest,
  errorMessage,
  isSubmitting,
  onClose,
  onApprove,
  onReject,
  formatDate,
  vacationTypeLabel,
}: VacationRequestDetailPanelProps) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  const openRejectForm = () => {
    setIsRejecting(true);
    setRejectReasonError("");
  };

  const closeRejectForm = () => {
    setIsRejecting(false);
    setRejectReason("");
    setRejectReasonError("");
  };

  const submitReject = () => {
    const trimmedRejectReason = rejectReason.trim();

    if (!trimmedRejectReason) {
      setRejectReasonError("반려 사유를 입력해주세요.");
      return;
    }

    onReject(trimmedRejectReason);
  };

  return (
    <aside className="vacation-manage__detail-panel">
      <div className="vacation-manage__detail-header">
        <div>
          <h2>휴가 신청 상세</h2>
          <p>{selectedRequest.user.name ?? selectedRequest.user.email}</p>
        </div>
        <button aria-label="상세 패널 닫기" type="button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="vacation-manage__detail-body">
        <dl className="vacation-manage__detail-grid">
          <div>
            <dt>휴가 유형</dt>
            <dd>{vacationTypeLabel}</dd>
          </div>
          <div>
            <dt>신청 일수</dt>
            <dd>
              {calculateDays(
                selectedRequest.startDate,
                selectedRequest.endDate,
              )}
              일
            </dd>
          </div>
          <div>
            <dt>시작일</dt>
            <dd>{formatDate(selectedRequest.startDate)}</dd>
          </div>
          <div>
            <dt>종료일</dt>
            <dd>{formatDate(selectedRequest.endDate)}</dd>
          </div>
        </dl>

        <section className="vacation-manage__detail-section">
          <h3>휴가 사유</h3>
          <p>{selectedRequest.reason || "입력된 휴가 사유가 없습니다."}</p>
        </section>

        <section className="vacation-manage__detail-section">
          <h3>팀 일정 확인</h3>
          <p className="vacation-manage__placeholder">
            팀 일정 충돌 정보는 다음 단계에서 연결합니다.
          </p>
        </section>
      </div>

      <div className="vacation-manage__detail-actions">
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        {isRejecting ? (
          <div className="vacation-manage__reject-form">
            <label htmlFor="rejectReason">반려 사유</label>
            <textarea
              id="rejectReason"
              value={rejectReason}
              rows={4}
              placeholder="예: 해당 기간에 팀 일정이 겹쳐 조정이 필요합니다."
              onChange={(e) => {
                setRejectReason(e.target.value);
                setRejectReasonError("");
              }}
              disabled={isSubmitting}
            />
            {rejectReasonError ? (
              <p className="form-error">{rejectReasonError}</p>
            ) : null}
            <div className="vacation-manage__reject-actions">
              <button
                type="button"
                onClick={closeRejectForm}
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                className="reject"
                type="button"
                onClick={submitReject}
                disabled={isSubmitting}
              >
                반려 확정
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              className="reject"
              type="button"
              onClick={openRejectForm}
              disabled={isSubmitting}
            >
              반려
            </button>
            <button
              className="is-primary"
              type="button"
              onClick={onApprove}
              disabled={isSubmitting}
            >
              승인
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default VacationRequestDetailPanel;
