// Validation utility functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

export const validatePolicyTitle = (title) => {
  return title && title.trim().length >= 5 && title.trim().length <= 100;
};

export const validatePolicyDescription = (description) => {
  return (
    description &&
    description.trim().length >= 10 &&
    description.trim().length <= 500
  );
};

export const validateFileType = (file, allowedTypes) => {
  if (!file) return false;
  return allowedTypes.includes(file.type);
};

export const validateFileSize = (file, maxSizeInMB) => {
  if (!file) return false;
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateArrayNotEmpty = (array) => {
  return Array.isArray(array) && array.length > 0;
};

// Validation error messages
export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL_INVALID: "Please enter a valid email address",
  PASSWORD_WEAK:
    "Password must be at least 8 characters with uppercase, lowercase, and number",
  USERNAME_INVALID:
    "Username must be 3-20 characters, alphanumeric and underscores only",
  TITLE_INVALID: "Title must be between 5-100 characters",
  DESCRIPTION_INVALID: "Description must be between 10-500 characters",
  FILE_TYPE_INVALID: "Invalid file type. Only PDF files are allowed",
  FILE_SIZE_INVALID: "File size must be less than 10MB",
  DEPARTMENTS_REQUIRED: "Please select at least one department",
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = formData[field];

    rules.forEach((rule) => {
      if (rule.validate && !rule.validate(value)) {
        if (!errors[field]) {
          errors[field] = rule.message;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
