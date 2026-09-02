import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "motion/react";

import { useAuth } from "../../context/AuthContext";

function getErrorMessage(error) {
  return (
    error?.data?.message ||
    error?.message ||
    "Unable to sign in. Please check your credentials."
  );
}

function extractUser(response) {
  return response?.data?.user || response?.user || null;
}

/*
 * Select the correct interface
 * based on the authenticated role.
 */
function getLoginDestination(user, requestedPath) {
  if (user?.role === "admin") {
    /*
     * Preserve an admin page that
     * originally redirected to login.
     */
    if (requestedPath?.startsWith("/admin")) {
      return requestedPath;
    }

    return "/admin";
  }

  /*
   * Never send a customer back
   * into an admin route.
   */
  if (
    requestedPath &&
    !requestedPath.startsWith("/admin") &&
    requestedPath !== "/login"
  ) {
    return requestedPath;
  }

  return "/";
}

export default function Login() {
  const navigate = useNavigate();

  const location = useLocation();

  const { user, loading: authLoading, login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const requestedPath = location.state?.from?.pathname;

  /*
   * If an authenticated user manually
   * opens /login, send them to the
   * correct interface.
   */
  useEffect(() => {
    if (authLoading || !user) {
      return;
    }

    navigate(getLoginDestination(user, requestedPath), {
      replace: true,
    });
  }, [authLoading, user, requestedPath, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    const email = formData.email.trim().toLowerCase();

    const password = formData.password;

    if (!email) {
      setError("Email address is required.");

      return;
    }

    if (!password) {
      setError("Password is required.");

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const response = await login({
        email,
        password,
      });

      const loggedInUser = extractUser(response);

      if (!loggedInUser) {
        throw new Error("User information was not returned after login.");
      }

      const destination = getLoginDestination(loggedInUser, requestedPath);

      navigate(destination, {
        replace: true,
      });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return <LoginLoading />;
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 lg:grid-cols-2">
          <LoginBrandPanel />

          <div className="flex items-center p-6 sm:p-10 lg:p-12">
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto w-full max-w-md"
            >
              <MobileLogo />

              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Sign in to CogniMart
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Customers and administrators use the same secure login.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <EmailInput
                  value={formData.email}
                  onChange={handleChange}
                  disabled={submitting}
                />

                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                  visible={showPassword}
                  disabled={submitting}
                  onToggle={() => setShowPassword((current) => !current)}
                />

                {error && (
                  <p
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                  >
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight
                        size={17}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 flex items-start gap-2 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                <ShieldCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Your account role is verified by the server. Administrators
                  are redirected to the admin dashboard automatically.
                </p>
              </div>

              <p className="mt-7 text-center text-sm text-slate-500 dark:text-slate-400">
                Don&apos;t have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
                >
                  Create account
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

/*
|--------------------------------------------------------------------------
| Brand panel
|--------------------------------------------------------------------------
*/

function LoginBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-emerald-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10" />

      <div className="relative z-10">
        <Link to="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
            <span className="text-lg font-bold">C</span>
          </div>

          <span className="text-xl font-bold tracking-tight">CogniMart</span>
        </Link>

        <div className="mt-20 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
            Smart shopping
          </p>

          <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
            Shop smarter.
            <br />
            Manage better.
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-6 text-emerald-50/85">
            A secure e-commerce platform for customers and administrators, with
            intelligent shopping features coming next.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-white" />

        <p className="text-sm text-emerald-50/80">
          Secure role-based account access
        </p>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Mobile logo
|--------------------------------------------------------------------------
*/

function MobileLogo() {
  return (
    <Link
      to="/"
      className="mb-8 flex items-center justify-center gap-2 lg:hidden"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
        <span className="font-bold">C</span>
      </div>

      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
        Cogni
        <span className="text-emerald-600">Mart</span>
      </span>
    </Link>
  );
}

/*
|--------------------------------------------------------------------------
| Email input
|--------------------------------------------------------------------------
*/

function EmailInput({ value, onChange, disabled }) {
  return (
    <div>
      <label
        htmlFor="email"
        className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
      >
        Email address
      </label>

      <div className="relative">
        <Mail
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="email"
          name="email"
          type="email"
          value={value}
          onChange={onChange}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={disabled}
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600"
        />
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Password input
|--------------------------------------------------------------------------
*/

function PasswordInput({ value, onChange, visible, disabled, onToggle }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="password"
          className="text-sm font-medium text-slate-700 dark:text-slate-200"
        >
          Password
        </label>

        <span className="text-xs text-slate-400">Secure account access</span>
      </div>

      <div className="relative">
        <LockKeyhole
          size={18}
          strokeWidth={1.8}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          id="password"
          name="password"
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={disabled}
          required
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:border-slate-600"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| Loading
|--------------------------------------------------------------------------
*/

function LoginLoading() {
  return (
    <main
      role="status"
      className="flex min-h-[calc(100vh-68px)] items-center justify-center bg-slate-50 dark:bg-slate-950"
    >
      <div className="text-center">
        <LoaderCircle
          size={29}
          className="mx-auto animate-spin text-emerald-600"
        />

        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
          Checking your session...
        </p>
      </div>
    </main>
  );
}
