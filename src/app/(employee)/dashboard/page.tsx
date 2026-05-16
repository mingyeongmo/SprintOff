"use client";
import React from "react";
import { signOut } from "next-auth/react";

const EmployeeDashboardPage = () => {
  return (
    <div>
      EmployeeDashboardPage
      <button onClick={() => signOut()}>로그아웃</button>
    </div>
  );
};

export default EmployeeDashboardPage;
