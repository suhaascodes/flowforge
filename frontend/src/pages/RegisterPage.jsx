import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthShell from '../components/auth/AuthShell';
import AuthCard from '../components/auth/AuthCard';
import AuthInput from '../components/auth/AuthInput';
import AuthButton from '../components/auth/AuthButton';
import AuthFormError from '../components/auth/AuthFormError';
import AuthFormFooter from '../components/auth/AuthFormFooter';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validators';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitError('');
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters.';
    }

    if (!validateEmail(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate('/app', { replace: true });
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join FlowForge and set up your secure workspace in under a minute."
    >
      <AuthCard>
        <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AuthFormError message={submitError} />

          <AuthInput
            id="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Doe"
            autoComplete="name"
            error={errors.name}
            disabled={loading}
          />

          <AuthInput
            id="email"
            label="Work Email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@company.com"
            autoComplete="email"
            error={errors.email}
            disabled={loading}
          />

          <AuthInput
            id="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password}
            disabled={loading}
          />

          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={loading}
          />

          <AuthButton loading={loading}>Create Account</AuthButton>

          <AuthFormFooter text="Already have an account?" linkText="Sign in" to="/login" />
        </motion.form>
      </AuthCard>
    </AuthShell>
  );
}