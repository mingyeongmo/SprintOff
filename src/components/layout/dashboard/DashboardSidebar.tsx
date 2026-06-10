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
  ADMIN: [{ label: "휴가 관리", href: "/admin/dashboard" }],
  EMPLOYEE: [
    { label: "휴가 신청", href: "/dashboard" },
    { label: "구성원 / 권한", href: "/dashboard/auth" },
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
