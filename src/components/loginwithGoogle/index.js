'use client';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { googleLoginAction } from '@/app/actions/auth/auth';
import styles from './loginwithGoogle.module.scss';
import { useAuth } from '@/context/AuthContext';

export default function LoginwithGoogle() {
    const router = useRouter();
    const { deviceId, login: authLogin } = useAuth();

    const handleSuccess = async ({ credential }) => {
        try {
            const res = await googleLoginAction(credential, deviceId);

            if (res.success) {
                const token = res.data?.data?.access_token || res.data?.access_token || res.data?.token || '';
                const userData = res.data?.data?.user || res.data?.user || null;

                await authLogin(userData, token);
                toast.success('Signed in with Google');
                router.push('/dashboard');
            } else {
                toast.error(res.error || 'Google login failed');
            }
        } catch {
            toast.error('An error occurred during Google sign in');
        }
    };

    return (
        <div className={styles.loginwithGoogle}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => toast.error('Google sign-in failed')}
                useOneTap={false}
                text="signin_with"
                shape="rectangular"
                logo_alignment="left"
                width="100%"
                itp_support={false}
            />
        </div>
    );
}