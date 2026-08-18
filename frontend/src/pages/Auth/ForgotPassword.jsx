import { useState } from "react";
import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    // UI only for now.
    setSubmitted(true);
  };

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            w-full
            max-w-md
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-7
            shadow-xl
            shadow-slate-200/40
            sm:p-10
            dark:border-slate-800
            dark:bg-slate-900
            dark:shadow-black/20
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center justify-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <span className="text-lg font-bold">C</span>
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Cogni<span className="text-emerald-600">Mart</span>
            </span>
          </Link>

          {/* Icon */}
          <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
            <ShieldCheck size={28} strokeWidth={1.7} />
          </div>

          {!submitted ? (
            <>
              {/* Heading */}
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-emerald-600">
                  Account recovery
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Forgot your password?
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  No worries. Enter the email address associated
                  with your account and we'll help you reset your
                  password.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8"
              >
                <label
                  htmlFor="forgot-email"
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
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
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

                <button
                  type="submit"
                  className="
                    group
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-emerald-600
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    shadow-emerald-600/20
                    transition-all
                    hover:bg-emerald-700
                    hover:shadow-md
                    active:scale-[0.99]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-500
                    focus-visible:ring-offset-2
                    dark:hover:bg-emerald-500
                    dark:focus-visible:ring-offset-slate-900
                  "
                >
                  Send reset link

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            </>
          ) : (
            /* Success state */
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="mt-7 text-center"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <Mail size={22} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">
                Check your inbox
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                If an account exists for{" "}
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  {email}
                </span>
                , you'll receive a password reset link shortly.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
              >
                Try another email
              </button>
            </motion.div>
          )}

          {/* Back to login */}
          <Link
            to="/login"
            className="
              mx-auto
              mt-8
              flex
              w-fit
              items-center
              gap-2
              text-sm
              font-semibold
              text-slate-500
              transition-colors
              hover:text-slate-900
              dark:text-slate-400
              dark:hover:text-white
            "
          >
            <ArrowLeft size={15} />
            Back to sign in
          </Link>
        </motion.div>
      </div>
    </main>
  );
}