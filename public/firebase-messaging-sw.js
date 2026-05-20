importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCkpYxm_6yKxiC3KJgqTgVHsVnYHi005es",
  authDomain: "credblaze-16e8d.firebaseapp.com",
  projectId: "credblaze-16e8d",
  storageBucket: "credblaze-16e8d.firebasestorage.app",
  messagingSenderId: "234484475335",
  appId: "1:234484475335:web:37438bbe7938ed629f25e2",
  measurementId: "G-46G0VBVQ3P"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload?.notification?.title;
  const notificationOptions = {
    body: payload?.notification?.body,
    icon: payload?.notification?.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
