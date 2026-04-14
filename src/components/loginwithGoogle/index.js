'use client';
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { googleLogin } from '@/services/auth';
import styles from './loginwithGoogle.module.scss';

export default function LoginwithGoogle() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSuccess = async ({ credential }) => {
        setLoading(true);
        try {
            const data = await googleLogin(credential);
            localStorage.setItem('token', data.token || data.access_token || '');
            toast.success('Signed in with Google');
            router.push('/dashboard');
        } catch {
            // error toast already fired by auth service
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
            />
        </div>
    );
}