import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bot, Eye, EyeOff } from 'lucide-react';
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (!passwordPattern.test(password)) errs.password = 'Password must be at least 8 characters and include one uppercase letter and one number';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const token = await authService.login(email, password);
      // Since backend doesn't return user, create a basic user object
      const user: User = { id: 1, name: email.split('@')[0], email };
      login(token, user);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Invalid credentials';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 items-center justify-center p-12">
        <div className="max-w-md text-white space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold">DocAI Assistant</h1>
          </div>
          <p className="text-xl font-semibold leading-snug">
            Chat with your documents using the power of AI
          </p>
          <p className="text-blue-100 text-sm leading-relaxed">
            Upload PDFs and Word documents, ask questions in natural language, and get instant AI-powered answers with context.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {['Smart Q&A', 'Auto Summary', 'Chat History', 'Multi-doc'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-200" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm space-y-7">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back — enter your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-all
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                    border-gray-300 dark:border-gray-600
                    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    placeholder:text-gray-400
                    ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
            </div>

            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
