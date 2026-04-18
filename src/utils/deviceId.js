/**
 * Retrieves the device ID from localStorage.
 * If it doesn't exist, it generates a new one and stores it.
 */
export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem('deviceId');

  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('deviceId', deviceId);
  }

  return deviceId;
};
