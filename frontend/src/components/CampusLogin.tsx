import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { campusBrand } from '../campusDemoData';

interface CampusLoginProps {
  error: string;
  onLogin: (credentials: { email: string; password: string }) => Promise<void> | void;
}

export default function CampusLogin({ error, onLogin }: CampusLoginProps) {
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      await onLogin({ email, password });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#edf6ff_100%)] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(11,77,136,0.11),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(8,41,75,0.08),_transparent_24%)]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#082c56,#1da9ea)] p-2 shadow-[0_28px_55px_-24px_rgba(8,44,86,0.48)]">
              <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white">
                <img
                  src="/alpha-logo.png"
                  alt="Alpha Grew logo"
                  className="h-11 w-11 rounded-xl object-contain"
                />
              </div>
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#4d6d8f]">
              {campusBrand.companyName}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#0a2342] sm:text-5xl">
              {campusBrand.companyName} <span className="text-[#1a9be2]">AI</span>
            </h1>
            <p className="mt-4 text-lg text-[#55779a]">
              The next generation placement ecosystem
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-[560px] rounded-[34px] border border-white/90 bg-white/92 p-6 shadow-[0_40px_90px_-42px_rgba(10,35,66,0.28)] backdrop-blur sm:p-8">
            <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-[#edf4fb] p-2">
              <button
                type="button"
                className="rounded-[18px] bg-white px-4 py-3 text-base font-semibold text-[#1a4f87] shadow-[0_10px_24px_-18px_rgba(8,41,75,0.35)]"
              >
                Login
              </button>
              <button
                type="button"
                disabled
                className="rounded-[18px] px-4 py-3 text-base font-semibold text-[#6e8aaa]"
              >
                Register
              </button>
            </div>

            <div className="mt-6 rounded-[20px] border border-[#d8e7f4] bg-[linear-gradient(135deg,#f8fbff,#eef7ff)] px-4 py-3 text-center text-sm font-medium text-[#245b93]">
              Demo access: <span className="font-bold">admin@demo.com</span> / <span className="font-bold">demo123</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[#173a61]">Email Address</label>
                <div className="flex items-center gap-3 rounded-[20px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-4 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
                  <Mail size={20} className="text-[#7a9abb]" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full border-none bg-transparent text-base text-[#0a2342] outline-none placeholder:text-[#7b94ae]"
                    placeholder="name@university.edu"
                    type="email"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[#173a61]">Password</label>
                <div className="flex items-center gap-3 rounded-[20px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-4 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
                  <LockKeyhole size={20} className="text-[#7a9abb]" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border-none bg-transparent text-base text-[#0a2342] outline-none placeholder:text-[#7b94ae]"
                    placeholder="Enter password"
                    type="password"
                  />
                </div>
              </div>

              {error ? (
                <div className="rounded-[18px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[linear-gradient(135deg,#082c56,#1ba8e9)] px-4 py-4 text-base font-semibold text-white shadow-[0_24px_45px_-28px_rgba(8,44,86,0.55)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
                {!submitting ? <ArrowRight size={18} /> : null}
              </button>
            </form>
          </div>

          <p className="mt-9 text-center text-base text-[#58789a]">
            Need a new account? <span className="font-semibold text-[#0b4d88]">Contact the campus admin</span>
          </p>
        </motion.section>
      </div>
    </div>
  );
}
