import React, { useState } from 'react';
import { UserIcon, EmailIcon, LockIcon } from '../../assets/icons';
import { FormInputWithLabel } from './FormInputWIthLabel';
import { toast } from 'react-toastify';
import { registerUserApi } from '../../api/authApi';
import TermsModal from '../auth/TermsModals';

export const SignupForm = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const validateStrongPassword = (pwd) => {
    if (pwd.length < 8) return "Password must be at least 8 characters long.";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) return "Password must contain at least one special character.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields.');
      return;
    }
    const pwdErr = validateStrongPassword(formData.password);
    if (pwdErr) {
      toast.error(pwdErr);
      return;
    }
    if (!agreed) {
      toast.error('You must agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    try {
      await registerUserApi(formData);
      toast.success('Account created! Please sign in.');
      setFormData({ fullName: '', email: '', password: '' });
      setAgreed(false);
      setTimeout(() => onSwitch(), 1500);
    } catch (err) {
      toast.error(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-black text-[#111118] tracking-tight">
          Create Account 🚀
        </h1>
        <p className="text-sm mt-1.5" style={{ color: '#4A4A65' }}>
          Join MotoFix and get your first service scheduled today.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <FormInputWithLabel
          id="fullName"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<UserIcon />}
          value={formData.fullName}
          onChange={handleChange}
        />
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
          placeholder="Create a strong password"
          icon={<LockIcon />}
          value={formData.password}
          onChange={handleChange}
        />

        {/* Terms checkbox */}
        <div className="flex items-start gap-3 mt-1">
          <div className="relative mt-0.5 flex-shrink-0">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={() => setAgreed(!agreed)}
              className="sr-only"
            />
            <div
              onClick={() => setAgreed(!agreed)}
              className={`w-4.5 h-4.5 rounded cursor-pointer border-2 flex items-center justify-center transition-all duration-200 ${
                agreed
                  ? 'bg-[#F5C000] border-[#F5C000]'
                  : 'border-[rgba(0,0,0,0.2)] bg-white hover:border-[#F5C000]'
              }`}
              style={{ width: '18px', height: '18px' }}
            >
              {agreed && (
                <svg className="w-2.5 h-2.5" fill="none" stroke="#0D0D14" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <label className="text-sm leading-snug cursor-pointer select-none" style={{ color: '#4A4A65' }}
                 onClick={() => setAgreed(!agreed)}>
            I agree to the{' '}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
              className="font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors duration-150"
              style={{ color: '#B8860B' }}
              onMouseEnter={e => e.currentTarget.style.color = '#E6B000'}
              onMouseLeave={e => e.currentTarget.style.color = '#B8860B'}
            >
              Terms and Conditions
            </button>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!agreed || loading}
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
              Creating Account...
            </>
          ) : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm mt-6" style={{ color: '#4A4A65' }}>
        Already have an account?{' '}
        <button
          onClick={onSwitch}
          className="font-semibold bg-transparent border-none p-0 cursor-pointer transition-colors"
          style={{ color: '#B8860B' }}
          onMouseEnter={e => e.currentTarget.style.color = '#E6B000'}
          onMouseLeave={e => e.currentTarget.style.color = '#B8860B'}
        >
          Sign In
        </button>
      </p>

      {showTermsModal && <TermsModal onClose={() => setShowTermsModal(false)} />}
    </>
  );
};
