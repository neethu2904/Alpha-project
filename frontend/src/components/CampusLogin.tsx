import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { campusBrand } from '../campusDemoData';

interface CampusLoginProps {
  error: string;
  onLogin: (credentials: { email: string; password: string }) => Promise<void> | void;
<<<<<<< HEAD
}

export default function CampusLogin({ error, onLogin }: CampusLoginProps) {
=======
  onRegister: (payload: { name: string; email: string; password: string }) => Promise<void> | void;
}

export default function CampusLogin({ error, onLogin, onRegister }: CampusLoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
>>>>>>> d7dc03e (demo)
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('demo123');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    try {
<<<<<<< HEAD
      await onLogin({ email, password });
=======
      if (isRegistering) {
        await onRegister({ name, email, password });
      } else {
        await onLogin({ email, password });
      }
>>>>>>> d7dc03e (demo)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#f8fbff_0%,#edf6ff_100%)] px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(11,77,136,0.11),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(8,41,75,0.08),_transparent_24%)]" />
<<<<<<< HEAD
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center justify-center">
=======
      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl items-center justify-center">
>>>>>>> d7dc03e (demo)
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
<<<<<<< HEAD
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
=======
          className="w-full max-w-[430px]"
        >
          <div className="rounded-[30px] border border-white/90 bg-white/94 p-5 shadow-[0_36px_84px_-44px_rgba(10,35,66,0.28)] backdrop-blur sm:p-6">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(145deg,#082c56,#1da9ea)] p-2 shadow-[0_24px_48px_-28px_rgba(8,44,86,0.42)]">
                <div className="flex h-full w-full items-center justify-center rounded-[18px] bg-white">
                  <img
                    src="/alpha-logo.png"
                    alt="Alpha Grew logo"
                    className="h-9 w-9 rounded-xl object-contain"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4d6d8f]">
                  {campusBrand.companyName}
                </p>
                <h1 className="mt-1 truncate text-2xl font-bold tracking-tight text-[#0a2342]">
                  {campusBrand.productName}
                </h1>
                <p className="mt-1 text-sm text-[#6c88a4]">
                  {isRegistering ? 'Create a student account' : 'Sign in to continue'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 rounded-[22px] bg-[#edf4fb] p-2">
              <button
                type="button"
                onClick={() => setIsRegistering(false)}
                className={`rounded-[18px] px-4 py-3 text-base font-semibold transition ${
                  !isRegistering
                    ? 'bg-white text-[#1a4f87] shadow-[0_10px_24px_-18px_rgba(8,41,75,0.35)]'
                    : 'text-[#6e8aaa]'
                }`}
>>>>>>> d7dc03e (demo)
              >
                Login
              </button>
              <button
                type="button"
<<<<<<< HEAD
                disabled
                className="rounded-[18px] px-4 py-3 text-base font-semibold text-[#6e8aaa]"
=======
                onClick={() => {
                  setIsRegistering(true);
                  setName('');
                  setEmail('');
                  setPassword('');
                }}
                className={`rounded-[18px] px-4 py-3 text-base font-semibold transition ${
                  isRegistering
                    ? 'bg-white text-[#1a4f87] shadow-[0_10px_24px_-18px_rgba(8,41,75,0.35)]'
                    : 'text-[#6e8aaa]'
                }`}
>>>>>>> d7dc03e (demo)
              >
                Register
              </button>
            </div>

<<<<<<< HEAD
            <div className="mt-6 rounded-[20px] border border-[#d8e7f4] bg-[linear-gradient(135deg,#f8fbff,#eef7ff)] px-4 py-3 text-center text-sm font-medium text-[#245b93]">
              Demo access: <span className="font-bold">admin@demo.com</span> / <span className="font-bold">demo123</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[#173a61]">Email Address</label>
                <div className="flex items-center gap-3 rounded-[20px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-4 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
=======
            {!isRegistering ? (
              <div className="mt-5 rounded-[18px] border border-[#d8e7f4] bg-[linear-gradient(135deg,#f8fbff,#eef7ff)] px-4 py-3 text-center text-sm font-medium text-[#245b93]">
                Demo access: <span className="font-bold">admin@demo.com</span> / <span className="font-bold">demo123</span>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {isRegistering ? (
                <div className="space-y-2.5">
                  <label className="text-sm font-semibold text-[#173a61]">Full Name</label>
                  <div className="flex items-center gap-3 rounded-[18px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-3.5 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="w-full border-none bg-transparent text-base text-[#0a2342] outline-none placeholder:text-[#7b94ae]"
                      placeholder="Enter your full name"
                      type="text"
                      required={isRegistering}
                    />
                  </div>
                </div>
              ) : null}

              <div className="space-y-2.5">
                <label className="text-sm font-semibold text-[#173a61]">Email Address</label>
                <div className="flex items-center gap-3 rounded-[18px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-3.5 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
>>>>>>> d7dc03e (demo)
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
<<<<<<< HEAD
                <div className="flex items-center gap-3 rounded-[20px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-4 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
=======
                <div className="flex items-center gap-3 rounded-[18px] border border-[#d5e4f2] bg-[#f8fbff] px-4 py-3.5 transition focus-within:border-[#67bee9] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#dff2fd]">
>>>>>>> d7dc03e (demo)
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
<<<<<<< HEAD
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
=======
                className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[linear-gradient(135deg,#082c56,#1ba8e9)] px-4 py-3.5 text-base font-semibold text-white shadow-[0_24px_45px_-28px_rgba(8,44,86,0.55)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (isRegistering ? 'Creating account...' : 'Signing in...') : isRegistering ? 'Create Account' : 'Sign In'}
                {!submitting ? <ArrowRight size={18} /> : null}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-[#58789a]">
              {isRegistering ? 'Already have an account?' : 'Need a new account?'}{' '}
              <button
                type="button"
                onClick={() => setIsRegistering((current) => !current)}
                className="font-semibold text-[#0b4d88] hover:underline"
              >
                {isRegistering ? 'Sign in' : 'Register now'}
              </button>
            </p>
          </div>
>>>>>>> d7dc03e (demo)
        </motion.section>
      </div>
    </div>
  );
}
