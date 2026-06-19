import DashboardHeader from "./DashboardHeader";
import DashboardSidebar from "./DashboardSidebar";
import { DashboardRole } from "./DashboardRoutes";
import { auth } from "@/auth/auth";
import "@/styles/dashboard.scss";

type DashboardShellProps = {
  children: React.ReactNode;
  role: DashboardRole;
};

const DashboardShell = async ({ children, role }: DashboardShellProps) => {
  const session = await auth();

  console.log(`session's user : ${JSON.stringify(session?.user)}`);
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
