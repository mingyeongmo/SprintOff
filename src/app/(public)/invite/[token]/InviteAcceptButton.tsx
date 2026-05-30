"use client";

import { signIn } from "next-auth/react";

type InviteAcceptButtonProps = {
  token: string;
};

export const InviteAcceptButton = ({ token }: InviteAcceptButtonProps) => {
  return (
    <button
      className="primary-button"
      onClick={() =>
        signIn("google", {
          redirectTo: `/invite/${token}/accept`,
        })
      }
    >
      Google로 초대 수락하기
    </button>
  );
};
