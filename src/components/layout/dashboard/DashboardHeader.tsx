"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getDashboardPageInfo } from "./DashboardRoutes";

const DashboardHeader = () => {
  const pathname = usePathname();
  const currentPage = getDashboardPageInfo(pathname);

  return (
    <header className="dashboard-layout-header">
      <div>
        <h1>{currentPage.title}</h1>
        <p>{currentPage.description}</p>
      </div>

      <button
        className="text-button"
        onClick={() => signOut({ redirectTo: "/" })}
      >
        로그아웃
      </button>
    </header>
  );
};

export default DashboardHeader;
