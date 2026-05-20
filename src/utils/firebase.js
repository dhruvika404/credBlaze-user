import { initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCkpYxm_6yKxiC3KJgqTgVHsVnYHi005es",
  authDomain: "credblaze-16e8d.firebaseapp.com",
  projectId: "credblaze-16e8d",
  storageBucket: "credblaze-16e8d.firebasestorage.app",
  messagingSenderId: "234484475335",
  appId: "1:234484475335:web:37438bbe7938ed629f25e2",
  measurementId: "G-46G0VBVQ3P"
};

let messaging = null;

export const initFirebase = async () => {
  if (typeof window !== "undefined") {
    try {
      const app = initializeApp(firebaseConfig);
      const supported = await isSupported();
      if (supported) {
        messaging = getMessaging(app);
      }
    } catch (e) {
      console.error("Firebase initialization error", e);
    }
  }
};

export const getFcmToken = async () => {
  try {
    if (!messaging) {
      await initFirebase();
    }

    if (typeof window !== "undefined" && messaging && "Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        });
        return token;
      }
    }
  } catch (error) {
    console.error("An error occurred while retrieving token. ", error);
  }
  return "";
};
