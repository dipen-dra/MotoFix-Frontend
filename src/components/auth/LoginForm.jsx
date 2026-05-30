import React, { useContext, useState } from 'react';
import { EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWIthLabel';
import { toast } from 'react-toastify';
import { loginUserApi } from '../../api/authApi';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../auth/AuthContext';

export const LoginForm = ({ onSwitch }) => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      const data = await loginUserApi(formData);
      login(data.data, data.data.token);
      toast.success('Login successful!');
    } catch (err) {
      toast.error(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-[#111118] tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-sm mt-1.5" style={{ color: '#4A4A65' }}>
          Sign in to manage your bookings and service history.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInputWithLabel
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<EmailIcon />}
          value={formData.email}
          onChange={handleChange}
        />
        <FormInputWithLabel
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          icon={<LockIcon />}
          value={formData.password}
          onChange={handleChange}
        />

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link
            to="/forgot-password"
            className="text-xs font-semibold transition-colors duration-150"
            style={{ color: '#B8860B' }}
            onMouseEnter={e => e.currentTarget.style.color = '#E6B000'}
            onMouseLeave={e => e.currentTarget.style.color = '#B8860B'}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-3 w-full h-12 rounded-xl font-semibold text-sm text-[#0D0D14]
                     bg-gradient-to-r from-[#F5C000] to-[#E6B000]
                     shadow-[0_4px_16px_rgba(245,192,0,0.35)]
                     hover:shadow-[0_6px_24px_rgba(245,192,0,0.5)]
                     hover:-translate-y-0.5
                     active:scale-[0.98]
                     transition-all duration-200
                     disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                     cursor-pointer
                     flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-[#0D0D14]/20 border-t-[#0D0D14] rounded-full animate-spin" />
              Signing In...
            </>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: '#4A4A65' }}>
        Don't have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors duration-150"
          style={{ color: '#B8860B' }}
          onMouseEnter={e => e.currentTarget.style.color = '#E6B000'}
          onMouseLeave={e => e.currentTarget.style.color = '#B8860B'}
        >
          Create Account
        </button>
      </p>
    </>
  );
};