"use client";

import { signIn } from "next-auth/react";

const LandingPage = () => {
  return (
    <main className="landing-page">
      <header className="site-header">
        <strong>SprintOff</strong>
        <span>개발팀 휴가 리스크 분석 SaaS</span>
      </header>

      <section className="hero-section">
        <p className="eyebrow">Vacation Risk Intelligence</p>
        <h1>휴가 일정이 개발팀 업무에 미치는 영향을 미리 확인하세요.</h1>
        <p className="hero-copy">
          SprintOff는 팀 캘린더, PR 리뷰 상태, 배포 일정을 함께 분석해
          휴가로 인한 업무 공백과 병목을 줄이는 의사결정 도구입니다.
        </p>
        <button
          className="primary-button"
          onClick={() =>
            signIn("google", {
              redirectTo: "/auth/redirect",
            })
          }
        >
          Google로 시작하기
        </button>
      </section>

      <section className="feature-grid" aria-label="핵심 기능">
        <article>
          <span>01</span>
          <h2>휴가 리스크 분석</h2>
          <p>PR, 리뷰 요청, 팀원 동시 휴가를 기준으로 위험도를 계산합니다.</p>
        </article>
        <article>
          <span>02</span>
          <h2>팀 캘린더</h2>
          <p>월간 일정에서 팀원 부재와 중요한 업무 일정을 한눈에 확인합니다.</p>
        </article>
        <article>
          <span>03</span>
          <h2>추천 휴가 날짜</h2>
          <p>업무 영향이 낮은 날짜를 제안해 휴가 신청 결정을 돕습니다.</p>
        </article>
      </section>
    </main>
  );
};

export default LandingPage;
