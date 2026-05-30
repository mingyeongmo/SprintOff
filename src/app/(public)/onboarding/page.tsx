"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const OnboardingPage = () => {
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

    if (!response.ok) {
      setErrorMessage("회사 정보를 저장하지 못했습니다. 잠시 후 다시 시도해주세요.");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <main className="onboarding-page">
      <section className="form-panel">
        <p className="eyebrow">Workspace Setup</p>
        <h1>회사 정보를 등록하세요.</h1>
        <p>
          SprintOff에서 함께 휴가 일정을 관리할 조직 또는 팀 이름을 입력하면
          관리자 대시보드가 생성됩니다.
        </p>

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
      </section>
    </main>
  );
};

export default OnboardingPage;
