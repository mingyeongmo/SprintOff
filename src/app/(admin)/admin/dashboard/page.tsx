const AdminDashboardPage = () => {
  return (
    <main className="app-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Admin Dashboard</p>
          <h1>팀 휴가 리스크 현황</h1>
        </div>
      </header>

      <section className="dashboard-grid">
        <article className="panel">
          <h2>이번 달 요약</h2>
          <div className="metric-list">
            <div>
              <span>대기 중 신청</span>
              <strong>4건</strong>
            </div>
            <div>
              <span>고위험 일정</span>
              <strong>2건</strong>
            </div>
            <div>
              <span>동시 휴가 최대</span>
              <strong>3명</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <h2>검토가 필요한 휴가</h2>
          <ul className="request-list">
            <li>
              <strong>김민준</strong>
              <span>2026.06.15 - 2026.06.16 · 리스크 높음</span>
            </li>
            <li>
              <strong>이서연</strong>
              <span>2026.06.22 · 리스크 보통</span>
            </li>
          </ul>
        </article>
      </section>
    </main>
  );
};

export default AdminDashboardPage;
