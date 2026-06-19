import VacationRequestForm from "./VacationRequestForm";
import "@/styles/vacation/vacation-request.scss";

const VacationRequestPage = () => {
  return (
    <section className="vacation-request">
      <VacationRequestForm />

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
