export type DashboardRole = "ADMIN" | "EMPLOYEE";

export type DashboardMenu = {
  label: string;
  href: string;
  title: string;
  description: string;
};

export const menusByRole: Record<DashboardRole, DashboardMenu[]> = {
  ADMIN: [
    {
      label: "대시보드",
      href: "/admin/dashboard",
      title: "팀 휴가 리스크 현황",
      description: "팀 전체 휴가 일정과 업무 리스크를 한눈에 확인하세요.",
    },
    {
      label: "휴가 관리",
      href: "/admin/vacation-manage",
      title: "휴가 관리",
      description: "팀원의 휴가 신청을 검토하고 승인 상태를 관리하세요.",
    },
    {
      label: "팀 캘린더",
      href: "/admin/team-calendar",
      title: "팀 캘린더",
      description: "팀원의 휴가 일정을 캘린더에서 확인하세요.",
    },
    {
      label: "구성원 / 권한",
      href: "/admin/member-permission",
      title: "구성원 / 권한",
      description: "팀원을 초대하고 역할과 권한을 관리하세요.",
    },
  ],
  EMPLOYEE: [
    {
      label: "대시보드",
      href: "/dashboard",
      title: "내 휴가 현황",
      description: "내 휴가 사용 현황과 최근 신청 상태를 확인하세요.",
    },
    {
      label: "휴가 신청",
      href: "/vacation-request",
      title: "휴가 신청",
      description: "새로운 휴가를 신청하고 업무 영향도를 확인하세요.",
    },
    {
      label: "내 휴가 내역",
      href: "/vacation-history",
      title: "내 휴가 내역",
      description: "내가 신청한 휴가 기록과 승인 상태를 확인하세요.",
    },
    {
      label: "팀 캘린더",
      href: "/team-calendar",
      title: "팀 캘린더",
      description: "팀원의 휴가 일정을 함께 확인하세요.",
    },
  ],
};

const fallbackPage = {
  title: "대시보드",
  description: "SprintOff 워크스페이스",
};

export const getDashboardPageInfo = (pathname: string) => {
  return (
    Object.values(menusByRole)
      .flat()
      .find((menu) => menu.href === pathname) ?? fallbackPage
  );
};
