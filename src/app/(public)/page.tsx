"use client";

import React from "react";
import { signIn } from "next-auth/react";

const LandingPage = () => {
  return (
    <div>
      <header>SprintOff</header>
      <body>
        <h1>팀의 휴가 관리, 이제 편하게 하세요.</h1>
        <button
          onClick={() =>
            signIn("google", {
              redirectTo: "/onboarding",
            })
          }
        >
          구글로 시작하기
        </button>
      </body>
      <footer>이용약관 개인정보처리방침 고객지원</footer>
    </div>
  );
};

export default LandingPage;
