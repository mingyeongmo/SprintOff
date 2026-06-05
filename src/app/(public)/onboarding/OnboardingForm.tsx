"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CompanyResponse = {
  error?: string;
};

export const OnboardingForm = () => {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!companyName.trim()) {
      setErrorMessage("회사 또는 팀 이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    const response = await fetch("/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName: companyName.trim(),
      }),
    });

    const data = (await response.json().catch(() => ({}))) as CompanyResponse;

    if (!response.ok) {
      setErrorMessage(
        data.error ?? "회사 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.",
      );
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="stacked-form">
        <label htmlFor="companyName">회사 또는 팀 이름</label>
        <input
          id="companyName"
          type="text"
          placeholder="예: 스프린트오프 개발팀"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <button className="primary-button" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "생성 중..." : "워크스페이스 생성하기"}
        </button>
      </form>

      <button className="text-button" onClick={() => signOut({ redirectTo: "/" })}>
        로그아웃
      </button>
    </>
  );
};
