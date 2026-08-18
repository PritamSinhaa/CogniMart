import { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [resetComplete, setResetComplete] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    // UI only for now.
    setResetComplete(true);
  };

  const passwordsMatch =
    formData.confirmPassword.length === 0 ||
    formData.password === formData.confirmPassword;

  return (
    <main className="min-h-[calc(100vh-68px)] bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto flex min-h-[calc(100vh-68px)] w-full max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
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

          {!resetComplete ? (
            <>
              {/* Icon */}
              <div className="mx-auto mt-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <LockKeyhole size={27} strokeWidth={1.7} />
              </div>

              {/* Heading */}
              <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-emerald-600">
                  Create a new password
                </p>

                <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
                  Reset your password
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Choose a strong password that you haven't used
                  before.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* New password */}
                <div>
                  <label
                    htmlFor="reset-password"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    New password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="reset-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      required
                      minLength={8}
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

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* Confirm password */}
                <div>
                  <label
                    htmlFor="reset-confirm-password"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Confirm new password
                  </label>

                  <div className="relative">
                    <LockKeyhole
                      size={18}
                      strokeWidth={1.8}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="reset-confirm-password"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      required
                      minLength={8}
                      className={`
                        h-12
                        w-full
                        rounded-xl
                        border
                        bg-white
                        pl-11
                        pr-12
                        text-sm
                        text-slate-900
                        outline-none
                        transition-all
                        placeholder:text-slate-400
                        hover:border-slate-300
                        focus:ring-4
                        dark:bg-slate-950
                        dark:text-white
                        dark:hover:border-slate-600
                        ${
                          passwordsMatch
                            ? "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/10 dark:border-slate-700"
                            : "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                        }
                      `}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (previous) => !previous
                        )
                      }
                      aria-label={
                        showConfirmPassword
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
                        hover:bg-slate-100
                        hover:text-slate-700
                        dark:hover:bg-slate-800
                        dark:hover:text-slate-200
                      "
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>

                  {!passwordsMatch && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!passwordsMatch}
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
                    hover:bg-emerald-700
                    hover:shadow-md
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-emerald-500
                    focus-visible:ring-offset-2
                    dark:hover:bg-emerald-500
                    dark:focus-visible:ring-offset-slate-900
                  "
                >
                  Reset password

                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </form>
            </>
          ) : (
            /* Success */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-10 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <CheckCircle2 size={32} />
              </div>

              <h1 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
                Password reset successful
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Your password has been updated. You can now sign
                in with your new password.
              </p>

              <Link
                to="/login"
                className="
                  mt-7
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
                  transition-colors
                  hover:bg-emerald-700
                  dark:hover:bg-emerald-500
                "
              >
                Continue to sign in
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          )}

          {!resetComplete && (
            <Link
              to="/login"
              className="
                mx-auto
                mt-7
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
              ← Back to sign in
            </Link>
          )}
        </motion.div>
      </div>
    </main>
  );
}