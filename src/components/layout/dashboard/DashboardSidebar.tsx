"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { DashboardRole } from "./DashboardShell";

type DashboardMenu = {
  label: string;
  href: string;
};

type DashboardSidebarProps = {
  role: DashboardRole;
};

const menusByRole: Record<DashboardRole, DashboardMenu[]> = {
  ADMIN: [
    { label: "대시보드", href: "/admin/dashboard" },
    { label: "휴가 관리", href: "/admin/vacation-manage" },
    { label: "팀 캘린더", href: "/admin/team-calender" },
    { label: "구성원 / 권한", href: "/admin/member-permission" },
  ],
  EMPLOYEE: [
    { label: "대시 보드", href: "/dashboard" },
    { label: "휴가 신청", href: "/vacation-request" },
    { label: "내 휴가 내역", href: "/vacation-history" },
    { label: "팀 캘린더", href: "/team-calender" },
  ],
};

const DashboardSidebar = ({ role }: DashboardSidebarProps) => {
  const pathname = usePathname();
  const menus = menusByRole[role];

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar-logo">
        <span className="dashboard-logo-mark">S</span>
        <strong>SprintOff</strong>
      </div>

      <nav className="dashboard-nav" aria-label="대시보드 메뉴">
        <p className="dashboard-nav-title">MAIN MENU</p>
        {menus.map((menu) => (
          <Link
            key={menu.label}
            className={
              isActive(menu.href)
                ? "dashboard-nav-link is-active"
                : "dashboard-nav-link"
            }
            href={menu.href}
          >
            <span aria-hidden="true">•</span>
            {menu.label}
          </Link>
        ))}
        <p className="dashboard-nav-title">SETTING</p>
        <Link
          className={
            isActive("/dashboard/setting")
              ? "dashboard-nav-link is-active"
              : "dashboard-nav-link"
          }
          href={"/dashboard/setting"}
        >
          <span aria-hidden="true">•</span>
          환경설정
        </Link>
      </nav>

      <div className="dashboard-sidebar-user">
        <div className="dashboard-user-avatar">U</div>
        <div>
          <strong>Workspace</strong>
          <span>SprintOff Team</span>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
