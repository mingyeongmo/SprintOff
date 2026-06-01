"use client";

import { signOut } from "next-auth/react";

export const AdminLogoutButton = () => {
  return (
    <button
      className="text-button"
      onClick={() => signOut({ redirectTo: "/" })}
    >
      로그아웃
    </button>
  );
};
