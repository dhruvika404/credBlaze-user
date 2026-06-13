'use server';

import { cookies } from 'next/headers';
import { login, googleLogin, signup, loginOtp, verifyLoginOtp } from '@/services/auth';

export async function loginOtpAction(credentials) {
  try {
    const data = await loginOtp(credentials);
    return { success: true, data };
  } catch (error) {
    console.error('Login OTP action error:', error);
    return {
      success: false,
      error: error?.message || error?.error || 'An unexpected error occurred while sending OTP.'
    };
  }
}

export async function verifyLoginOtpAction(payload) {
  try {
    const data = await verifyLoginOtp(payload);

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
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, data };
  } catch (error) {
    console.error('Verify login OTP action error:', error);
    return {
      success: false,
      error: error?.message || error?.error || 'An unexpected error occurred during OTP verification.'
    };
  }
}

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
      secure: false,
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

export async function googleLoginAction(credential, deviceId, fcmToken = '') {
  try {
    const data = await googleLogin(credential, deviceId, fcmToken);

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
      secure: false,
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
      secure: false,
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
