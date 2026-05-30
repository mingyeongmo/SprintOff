"use client";

import { useState } from "react";

type InviteRole = "ADMIN" | "EMPLOYEE";

type InviteResponse = {
  success?: boolean;
  error?: string;
  inviteUrl?: string;
  resent?: boolean;
};

export const InviteMemberForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<InviteRole>("EMPLOYEE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");
    setErrorMessage("");
    setInviteUrl("");

    const response = await fetch("/api/invitations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        role,
      }),
    });

    const data = (await response.json()) as InviteResponse;

    setIsSubmitting(false);

    if (!response.ok) {
      setErrorMessage(data.error ?? "초대 발송에 실패했습니다.");
      return;
    }

    setEmail("");
    setInviteUrl(data.inviteUrl ?? "");
    setMessage(
      data.resent
        ? "이미 대기 중인 초대를 다시 발송했습니다."
        : "초대 이메일을 발송했습니다.",
    );
  };

  return (
    <form className="invite-form" onSubmit={handleSubmit}>
      <label>
        초대할 이메일
        <input
          type="email"
          placeholder="test2@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        권한
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as InviteRole)}
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">Admin</option>
        </select>
      </label>

      <button className="primary-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "발송 중..." : "초대 발송"}
      </button>

      {message ? <p className="form-success">{message}</p> : null}
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      {inviteUrl ? (
        <p className="form-note">
          개발 확인용 초대 링크: <span>{inviteUrl}</span>
        </p>
      ) : null}
    </form>
  );
};
