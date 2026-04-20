'use client';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { googleLogin } from '@/services/auth';
import styles from './loginwithGoogle.module.scss';
import { useAuth } from '@/context/AuthContext';

export default function LoginwithGoogle() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { deviceId, login: authLogin } = useAuth();

    const handleSuccess = async ({ credential }) => {
        setLoading(true);
        try {
            const data = await googleLogin(credential, deviceId);
            const token = data.token || data.access_token || '';
            const userData = data?.user || data?.data?.user || null;

            authLogin(userData, token);
            toast.success('Signed in with Google');
            router.push('/dashboard');
        } catch {
        } finally {
            setLoading(false);
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
                itp_support={true}
            />
        </div>
    );
}
