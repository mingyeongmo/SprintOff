import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";

export type DashboardRole = "ADMIN" | "EMPLOYEE";

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

const DashboardShell = ({ children, role }: DashboardShellProps) => {
  return (
    <div className="dashboard-shell">
      <DashboardSidebar role={role} />

      <div className="dashboard-main">
        <DashboardHeader />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
};

export default DashboardShell;
