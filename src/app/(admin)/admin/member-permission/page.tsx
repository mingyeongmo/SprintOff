import React from "react";
import { InviteMemberForm } from "./InviteMemberForm";

const AdminMemberPermissionPage = () => {
  return (
    <>
      <article className="panel">
        <h2>팀원 초대</h2>
        <p>
          초대할 이메일과 권한을 선택하면 7일 동안 유효한 초대장이 발송됩니다.
        </p>
        <InviteMemberForm />
      </article>
    </>
  );
};

export default AdminMemberPermissionPage;
