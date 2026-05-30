"use client";

import { signOut } from "next-auth/react";

const EmployeeDashboardPage = () => {
  return (
    <main className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Employee Dashboard</p>
          <h1>내 휴가 신청</h1>
        </div>
        <button className="text-button" onClick={() => signOut({ redirectTo: "/" })}>
          로그아웃
        </button>
      </header>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>휴가 일정 선택</h2>
          <div className="form-preview">
            <label>
              시작일
              <input type="date" defaultValue="2026-06-15" />
            </label>
            <label>
              종료일
              <input type="date" defaultValue="2026-06-16" />
            </label>
            <label>
              사유
              <textarea placeholder="선택 입력" rows={4} />
            </label>
          </div>
          <button className="primary-button">휴가 신청하기</button>
        </article>

        <article className="panel risk-panel">
          <h2>업무 영향 분석</h2>
          <strong className="risk-score">리스크 높음</strong>
          <ul>
            <li>리뷰 대기 PR 3건</li>
            <li>같은 팀원 휴가 1명</li>
            <li>이번 주 배포 일정 1건</li>
          </ul>
          <p>추천 날짜: 2026년 6월 18일, 2026년 6월 19일</p>
        </article>
      </section>
    </main>
  );
};

export default EmployeeDashboardPage;
