'use server';

import { cookies } from 'next/headers';
import { login, googleLogin, signup } from '@/services/auth';

export async function loginAction(credentials) {
  try {
    const data = await login(credentials);

    const token = data?.data?.access_token || data?.access_token || data?.token;

    if (!token) {
      return {
        success: false,
        error: 'Authentication failed: No token received.'
      };
    }

    const cookieStore = await cookies();

    // Set cookie for server-side access
    cookieStore.set('token', token, {
      httpOnly: false, // Set to false so client-side axios can still read it if needed
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data };
  } catch (error) {
    console.error('Login action error:', error);
    return {
      success: false,
      error: error?.message || error?.error || 'An unexpected error occurred during sign in.'
    };
  }
}

export async function googleLoginAction(credential, deviceId) {
  try {
    const data = await googleLogin(credential, deviceId);

    const token = data?.data?.access_token || data?.access_token || data?.token;

    if (!token) {
      return {
        success: false,
        error: 'Authentication failed: No token received.'
      };
    }

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data };
  } catch (error) {
    console.error('Google login action error:', error);
    return {
      success: false,
      error: error?.message || error?.error || 'An unexpected error occurred during Google sign in.'
    };
  }
}

export async function signupAction(credentials) {
  try {
    const data = await signup(credentials);

    const token = data?.data?.access_token || data?.access_token || data?.token;

    if (!token) {
      return {
        success: false,
        error: 'Registration succeeded, but authentication failed: No token received.'
      };
    }

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data };
  } catch (error) {
    console.error('Signup action error:', error);
    return {
      success: false,
      error: error?.message || error?.error || 'An unexpected error occurred during sign up.'
    };
  }
}
