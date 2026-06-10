"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; description: string }> = {
  "/dashboard": {
    title: "휴가 신청",
    description: "새로운 휴가를 신청하고 업무 영향도를 확인하세요.",
  },
  "/admin/dashboard": {
    title: "팀 휴가 리스크 현황",
    description: "팀원의 휴가 신청과 초대 상태를 관리하세요.",
  },
};

const DashboardHeader = () => {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] ?? {
    title: "대시보드",
    description: "SprintOff 워크스페이스",
  };

  return (
    <header className="dashboard-layout-header">
      <div>
        <h1>{currentPage.title}</h1>
        <p>{currentPage.description}</p>
      </div>

      <button className="text-button" onClick={() => signOut({ redirectTo: "/" })}>
        로그아웃
      </button>
    </header>
  );
};

export default DashboardHeader;
