"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OnboardingPage = () => {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(companyName);

    const response = await fetch("/api/company", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        companyName,
      }),
    });

    if (!response.ok) {
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <div>
      <h1>회사 기본 정보</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="예: (주)테크노베이션"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <button type="submit">생성하기</button>
      </form>
      <button onClick={() => signOut({ redirectTo: "/" })}>로그아웃</button>
    </div>
  );
};

export default OnboardingPage;
