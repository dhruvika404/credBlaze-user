/**
 * Converts a flat object to FormData.
 * Handles File objects, strings, numbers, and booleans.
 * Skips null or undefined values.
 * 
 * @param {Object} data 
 * @returns {FormData}
 */
export const toFormData = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    }
  });
  return formData;
};
