'use client';
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { googleLoginAction } from '@/app/actions/auth/auth';
import styles from './loginwithGoogle.module.scss';
import { useAuth } from '@/context/AuthContext';

export default function LoginwithGoogle() {
    const router = useRouter();
    const { deviceId, login: authLogin } = useAuth();

    const handleSuccess = async (tokenResponse) => {
        try {
            const credential = tokenResponse.access_token;
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
        } catch (error) {
            toast.error('An error occurred during Google sign in');
        }
    };

    const login = useGoogleLogin({
        onSuccess: handleSuccess,
        onError: () => toast.error('Google sign-in failed'),
    });

    return (
        <div className={styles.loginwithGoogle}>
            <button onClick={() => login()} type="button">
                <Image
                    src="/assets/icons/google.svg"
                    alt="Google Logo"
                    width={20}
                    height={20}
                />
                Sign In with Google
            </button>
        </div>
    );
}