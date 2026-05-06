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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
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

    if (!validateEmail(form.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!form.password || form.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.';
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
      await login(form.email.trim(), form.password);
      navigate('/app', { replace: true });
    } catch (error) {
      setSubmitError(error?.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Welcome Back"
      subtitle="Sign in to continue managing your SDLC flow with a secure, role-aware workspace."
    >
      <AuthCard>
        <motion.form onSubmit={handleSubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AuthFormError message={submitError} />

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
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password}
            disabled={loading}
          />

          <AuthButton loading={loading}>Sign In</AuthButton>

          <AuthFormFooter text="Don’t have an account?" linkText="Create one" to="/register" />
        </motion.form>
      </AuthCard>
    </AuthShell>
  );
}