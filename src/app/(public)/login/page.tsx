"use client";

import React from "react";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <div>
      <p>이미 회사에 소속되어 있나요? 구글로 로그인하세요.</p>
      <button
        onClick={() =>
          signIn("google", {
            redirectTo: "/dashboard",
          })
        }
      >
        구글 로그인
      </button>
      <p>소속된 회사가 없으신가요?</p>
      <button>워크 스페이스 생성하러가기</button>
    </div>
  );
};

export default LoginPage;
