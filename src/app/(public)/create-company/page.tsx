"use client";

import { useState } from "react";

const CreateCompanyPage = () => {
  const [companyName, setCompanyName] = useState("");

  const handleSubmit = () => {
    console.log(companyName);
  };

  return (
    <div>
      <h1>회사 생성하기</h1>
      <p>회사 정보를 입력하고 서비스를 시작하세요.</p>
      <input
        type="text"
        placeholder="회사 이름"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />
      <button onClick={handleSubmit}>계속하기</button>
    </div>
  );
};

export default CreateCompanyPage;
