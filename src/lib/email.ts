import { Role } from "@prisma/client";

type InvitationEmailInput = {
  to: string;
  companyName: string;
  invitedByName: string;
  inviteUrl: string;
  expiresAt: Date;
  role: Role;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "long",
    timeZone: "Asia/Seoul",
  }).format(date);

export const sendInvitationEmail = async ({
  to,
  companyName,
  invitedByName,
  inviteUrl,
  expiresAt,
  role,
}: InvitationEmailInput) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "SprintOff <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const safeCompanyName = escapeHtml(companyName);
  const safeInvitedByName = escapeHtml(invitedByName);
  const safeInviteUrl = escapeHtml(inviteUrl);
  const roleLabel = role === Role.ADMIN ? "관리자" : "팀원";
  const expiresLabel = formatDate(expiresAt);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `[SprintOff] ${safeCompanyName} 초대장이 도착했습니다`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #172033;">
          <h1 style="font-size: 24px;">SprintOff 팀 초대</h1>
          <p>${safeInvitedByName}님이 <strong>${safeCompanyName}</strong> 워크스페이스에 ${roleLabel} 권한으로 초대했습니다.</p>
          <p>아래 버튼을 눌러 Google 계정으로 로그인하고 초대를 수락하세요.</p>
          <p>
            <a href="${safeInviteUrl}" style="display: inline-block; padding: 12px 16px; border-radius: 8px; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700;">
              초대 수락하기
            </a>
          </p>
          <p style="color: #687083;">이 초대는 ${expiresLabel}까지 유효합니다.</p>
          <p style="color: #687083;">버튼이 열리지 않으면 아래 링크를 브라우저에 붙여넣어 주세요.</p>
          <p style="word-break: break-all; color: #2563eb;">${safeInviteUrl}</p>
        </div>
      `,
      text: `SprintOff 초대장\n\n${safeInvitedByName}님이 ${safeCompanyName} 워크스페이스에 ${roleLabel} 권한으로 초대했습니다.\n초대 수락: ${inviteUrl}\n만료일: ${expiresLabel}`,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      `Failed to send invitation email: ${JSON.stringify(payload)}`,
    );
  }

  return payload;
};
