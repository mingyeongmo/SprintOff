"use client";

import type { VacationType } from "@prisma/client";
import { useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";

type VacationTypeOption = {
  label: string;
  value: VacationType;
  description: string;
};

const VACATION_TYPES: VacationTypeOption[] = [
  { label: "연차", value: "연차", description: "1일 단위 휴가" },
  { label: "반차", value: "반차", description: "오전/오후 0.5일" },
  { label: "병가", value: "병가", description: "질병, 부상 치료" },
  { label: "기타", value: "기타", description: "경조사, 공가 등" },
];

type VacationRequestPayload = {
  type: VacationType;
  startDate: string;
  endDate: string;
  reason: string;
};

type VacationRequestResult =
  | {
      success: true;
      requestId: string;
      status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELED";
    }
  | {
      success: false;
      error: string;
    };

type VacationRequestFormProps = {
  submitVacationRequestAction: (
    payload: VacationRequestPayload,
  ) => Promise<VacationRequestResult>;
};

const VacationRequestForm = ({
  submitVacationRequestAction,
}: VacationRequestFormProps) => {
  const [selectedVacationType, setSelectedVacationType] =
    useState<VacationType>("연차");

  const TODAY = format(new Date(), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const days =
    startDate && endDate
      ? differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1
      : 0;

  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const isFormValid =
    startDate !== "" &&
    endDate !== "" &&
    days > 0 &&
    reason.trim().length >= 10;

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextStartDate = e.target.value;

    setStartDate(nextStartDate);

    if (endDate && endDate < nextStartDate) {
      setEndDate("");
    }
  };

  const resetForm = () => {
    setSelectedVacationType("연차");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const payload: VacationRequestPayload = {
      type: selectedVacationType,
      startDate,
      endDate,
      reason,
    };

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    try {
      const result = await submitVacationRequestAction(payload);

      console.log("Vacation request response:", result);

      if (!result.success) {
        setSubmitError(result.error);
        return;
      }

      setSubmitSuccess(`신청이 접수되었습니다.`);
      resetForm();
    } catch (error) {
      console.error(error);
      setSubmitError("휴가 신청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="vacation-request__form" onSubmit={handleSubmit}>
      <section className="form-panel vacation-request__form-card">
        <div className="vacation-request__form-header">
          <h2>새 휴가 신청서</h2>
          <p>필수 정보를 정확하게 입력해 주세요.</p>
        </div>

        <div className="vacation-request__form-body">
          <section className="vacation-request__section">
            <h3>1. 휴가 유형 선택</h3>

            <div className="vacation-request__type-grid">
              {VACATION_TYPES.map((type) => (
                <button
                  className={
                    selectedVacationType === type.value
                      ? "vacation-request__type-card is-selected"
                      : "vacation-request__type-card"
                  }
                  key={type.label}
                  type="button"
                  onClick={() => {
                    setSelectedVacationType(type.value);
                  }}
                >
                  <strong>{type.label}</strong>
                  <span>{type.description}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="vacation-request__section">
            <div className="vacation-request__date-grid">
              <label>
                시작일
                <input
                  type="date"
                  min={TODAY}
                  value={startDate}
                  required
                  onChange={handleStartDateChange}
                />
              </label>

              <label>
                종료일
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  disabled={!startDate}
                  required
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setEndDate(e.target.value);
                  }}
                />
                <span>
                  {days > 0 ? `총 ${days}일 신청` : "종료일을 선택해주세요."}
                </span>
              </label>
            </div>
          </section>

          <section className="vacation-request__section">
            <label>
              3. 사유 입력
              <textarea
                value={reason}
                placeholder="휴가 사유를 상세히 적어주세요. 업무 대행자 정보도 함께 기재해주시면 좋습니다."
                rows={5}
                required
                minLength={10}
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
          </section>

          <section className="vacation-request__section">
            <h3>4. 첨부 파일 선택</h3>
            <div className="vacation-request__upload-box">
              클릭하여 파일을 업로드하거나 드래그 앤 드롭하세요.
              <span>PDF, JPG, PNG 지원</span>
            </div>
          </section>
        </div>

        <div className="vacation-request__actions">
          {submitError && <p className="form-error">{submitError}</p>}
          {submitSuccess && <p className="form-success">{submitSuccess}</p>}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "신청 중..." : "신청 제출"}
          </button>
        </div>
      </section>
    </form>
  );
};

export default VacationRequestForm;
