/**
 * Retrieves the device ID from localStorage.
 * If it doesn't exist, it generates a new one and stores it.
 */
export const getDeviceId = () => {
  if (typeof window === 'undefined') return '';

  let deviceId = localStorage.getItem('device_id');

  if (!deviceId) {
    deviceId = crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};
