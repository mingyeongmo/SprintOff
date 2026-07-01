"use client";

import { useState } from "react";
import { differenceInCalendarDays, format } from "date-fns";

const VacationRequestForm = () => {
  const [selectedVacationType, setSelectedVacationType] = useState("연차");

  const TODAY = format(new Date(), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState(TODAY);
  const [endDate, setEndDate] = useState(TODAY);

  const days =
    differenceInCalendarDays(new Date(endDate), new Date(startDate)) + 1;

  const vacationTypes = [
    { label: "연차", description: "1일 단위 휴가" },
    { label: "반차", description: "오전/오후 0.5일" },
    { label: "병가", description: "질병, 부상 치료" },
    { label: "기타", description: "경조사, 공가 등" },
  ];

  console.log(selectedVacationType);

  const formSubmit = () => {
    console.log("vacationType : ", selectedVacationType);
    console.log(`startDate : ${startDate} endDate : ${endDate}`);
    console.log(`days : ${days}`);
  };

  return (
    <form className="vacation-request__form">
      <section className="form-panel vacation-request__form-card">
        <div className="vacation-request__form-header">
          <h2>새 휴가 신청서</h2>
          <p>필수 정보를 정확하게 입력해 주세요.</p>
        </div>

        <div className="vacation-request__form-body">
          <section className="vacation-request__section">
            <h3>1. 휴가 유형 선택</h3>

            <div className="vacation-request__type-grid">
              {vacationTypes.map((type) => (
                <button
                  className={
                    selectedVacationType === type.label
                      ? "vacation-request__type-card is-selected"
                      : "vacation-request__type-card"
                  }
                  key={type.label}
                  type="button"
                  onClick={() => {
                    setSelectedVacationType(type.label);
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
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setStartDate(e.target.value);
                  }}
                />
              </label>

              <label>
                종료일
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => {
                    if (!e.target.value) return;
                    setEndDate(e.target.value);
                  }}
                />
                <span>총 {days}일 신청</span>
              </label>
            </div>
          </section>

          <section className="vacation-request__section">
            <label>
              3. 사유 입력
              <textarea
                placeholder="휴가 사유를 상세히 적어주세요. 업무 대행자 정보도 함께 기재해주시면 좋습니다."
                rows={5}
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
          <button className="text-button" type="button">
            취소
          </button>
          <button className="primary-button" type="button" onClick={formSubmit}>
            신청 제출
          </button>
        </div>
      </section>
    </form>
  );
};

export default VacationRequestForm;
