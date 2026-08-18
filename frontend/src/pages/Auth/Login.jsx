import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // UI only for now.
    console.log("Login form:", formData);
  };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20 lg:grid-cols-2">

          {/* =================================================
              LEFT — BRAND / AI SIDE
          ================================================= */}
          <div className="relative hidden overflow-hidden bg-emerald-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
            
            {/* Decorative circles */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10" />

            <div className="relative z-10">
              <Link
                to="/"
                className="inline-flex items-center gap-2"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                  <span className="text-lg font-bold">
                    C
                  </span>
                </div>

                <span className="text-xl font-bold tracking-tight">
                  CogniMart
                </span>
              </Link>

              <div className="mt-20 max-w-md">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Smart shopping
                </p>

                <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
                  Shop smarter.
                  <br />
                  Let AI do the thinking.
                </h1>

                <p className="mt-6 max-w-sm text-sm leading-6 text-emerald-50/85">
                  Discover better products, compare prices, understand
                  reviews, and get personalized recommendations with
                  CogniMart's AI-powered shopping experience.
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white" />

                <p className="text-sm text-emerald-50/80">
                  Your intelligent shopping companion
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              RIGHT — LOGIN FORM
          ================================================= */}
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
              {/* Mobile logo */}
              <Link
                to="/"
                className="mb-8 flex items-center justify-center gap-2 lg:hidden"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm">
                  <span className="font-bold">
                    C
                  </span>
                </div>

                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Cogni<span className="text-emerald-600">Mart</span>
                </span>
              </Link>

              {/* Heading */}
              <div>
                <p className="text-sm font-semibold text-emerald-600">
                  Welcome back
                </p>

                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Sign in to CogniMart
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Continue your smarter shopping journey.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Email */}
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
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      autoComplete="email"
                      required
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        pl-11
                        pr-4
                        text-sm
                        text-slate-900
                        outline-none
                        transition-all
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-emerald-500
                        focus:ring-4
                        focus:ring-emerald-500/10
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                        dark:hover:border-slate-600
                        dark:focus:border-emerald-500
                      "
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Password
                    </label>

                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                    >
                      Forgot password?
                    </Link>
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
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      required
                      className="
                        h-12
                        w-full
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        pl-11
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        transition-all
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:border-emerald-500
                        focus:ring-4
                        focus:ring-emerald-500/10
                        dark:border-slate-700
                        dark:bg-slate-950
                        dark:text-white
                        dark:hover:border-slate-600
                        dark:focus:border-emerald-500
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="
                        absolute
                        right-2
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-slate-400
                        transition-colors
                        hover:bg-slate-100
                        hover:text-slate-700
                        dark:hover:bg-slate-800
                        dark:hover:text-slate-200
                      "
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      rounded
                      border-slate-300
                      accent-emerald-600
                    "
                  />

                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-500 dark:text-slate-400"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    group
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-600
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    shadow-emerald-600/20
                    transition-all
                    duration-200
                    hover:bg-emerald-700
                    hover:shadow-md
                    active:scale-[0.99]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-500
                    focus-visible:ring-offset-2
                    dark:bg-emerald-600
                    dark:hover:bg-emerald-500
                    dark:focus-visible:ring-offset-slate-900
                  "
                >
                  Sign in

                  <ArrowRight
                    size={16}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />

                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  or
                </span>

                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              {/* Register */}
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Create an account
                </Link>
              </p>

              {/* Back home */}
              <div className="mt-6 text-center">
                <Link
                  to="/"
                  className="text-xs font-medium text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                >
                  ← Back to shopping
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}