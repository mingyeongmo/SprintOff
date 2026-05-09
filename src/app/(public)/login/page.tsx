"use client"

import React from 'react';
import { signIn, signOut } from 'next-auth/react';

const LoginPage = () => {
    return (
        <div>
            login page
            <button onClick={() => signIn("google",{
                redirectTo: "/dashboard",
            })}>
                구글 로그인
            </button>
            <button onClick={() => signOut()}>
                로그아웃
            </button>
        </div>
    );
};

export default LoginPage;