"use client"

import React from 'react';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
    return (
        <div>
            login page
            <button onClick={() => signIn("google")}>
                구글 로그인
            </button>
        </div>
    );
};

export default LoginPage;