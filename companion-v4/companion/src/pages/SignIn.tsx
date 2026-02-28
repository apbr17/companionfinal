import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

export const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    aadhaar: '',
    password: '',
    confirmPassword: '',
    ageConfirmed: false,
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverOnline, setServerOnline] = useState<boolean | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook)\.(com|in)$/;
    if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Please enter a valid email (gmail, yahoo, or outlook)';
    }

    const aadhaarPattern = /^[2-9]{1}[0-9]{11}$/;
    if (!aadhaarPattern.test(formData.aadhaar)) {
      newErrors.aadhaar = 'Please enter a valid 12-digit Aadhaar number';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 uppercase letter';
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least 1 lowercase letter';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.ageConfirmed) {
      newErrors.ageConfirmed = 'You must confirm you are above 8 years of age';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE || '';
    if (!apiBase) {
      setServerOnline(false);
      return;
    }

    let cancelled = false;
    fetch(`${apiBase}/ping.php`)
      .then(r => r.json())
      .then(d => { if (!cancelled) setServerOnline(!!d.success); })
      .catch(() => { if (!cancelled) setServerOnline(false); });

    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateForm()) return;

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_BASE || '';
      const res = await fetch(`${apiBase}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          aadhaar: formData.aadhaar,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data?.message || 'Registration failed');
        return;
      }

      login({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        aadhaar: formData.aadhaar,
        rememberMe: formData.rememberMe,
      });

      navigate('/');
    } catch (err: any) {
      setServerError(err?.message ? `Could not contact server: ${err.message}` : 'Could not contact server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl p-8 shadow-2xl border border-slate-800">
          {/* Brand */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Companion<span className="text-red-500">.</span>
            </h1>
            <p className="text-slate-400 text-sm">Experience events together</p>
          </div>

          {serverOnline === false && (
            <div className="text-center mb-4 text-sm text-yellow-400 bg-yellow-400/10 rounded-lg p-3 border border-yellow-400/20">
              ⚠️ Server unreachable — check <code className="bg-slate-700 px-1 rounded">VITE_API_BASE</code> in your <code className="bg-slate-700 px-1 rounded">.env</code> file.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Aadhaar */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Aadhaar Number</label>
              <input
                type="text"
                name="aadhaar"
                placeholder="12-digit Aadhaar number"
                maxLength={12}
                value={formData.aadhaar}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setFormData(prev => ({ ...prev, aadhaar: value }));
                }}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
              {errors.aadhaar && <p className="text-red-400 text-xs mt-1">{errors.aadhaar}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Checkboxes */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="ageConfirmed"
                  checked={formData.ageConfirmed}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300">I confirm that I am above 8 years of age</span>
              </label>
              {errors.ageConfirmed && <p className="text-red-400 text-xs ml-6">{errors.ageConfirmed}</p>}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300">Remember me</span>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>

            {serverError && (
              <div className="text-center text-sm text-red-400 bg-red-400/10 rounded-lg p-3 border border-red-400/20">
                {serverError}
              </div>
            )}
          </form>

          <div className="text-center mt-6 text-sm text-slate-400">
            Already have an account?{' '}
            <a href="#" className="text-red-500 font-medium hover:text-red-400 transition">Login</a>
          </div>

          <div className="mt-6 p-3.5 bg-slate-800/50 rounded-lg text-xs text-slate-300 border border-slate-700">
            <p className="font-semibold text-slate-200 mb-2">What you can do on Companion:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>🎟 Book tickets for movies, concerts & live events</li>
              <li>👥 Post an event if you have no one to go with</li>
              <li>🪑 Join others via limited companion slots</li>
              <li>🔐 Safe, age-verified community</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
