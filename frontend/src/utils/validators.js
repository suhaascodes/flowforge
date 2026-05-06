// Validation utilities for forms

export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validateName(name) {
  return name && name.trim().length >= 2;
}

export function validateRequired(value) {
  return value && value.toString().trim().length > 0;
}

// Returns object with validation errors
export function validateLoginForm(data) {
  const errors = {};

  if (!validateEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}

export function validateRegisterForm(data) {
  const errors = {};

  if (!validateName(data.name)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
}
