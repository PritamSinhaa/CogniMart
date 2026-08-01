import { useState } from "react";
import { Link } from "react-router-dom";
import { Bot, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    setError("");
    console.log("Login form data:", form);
  };

  return (
    <main className="flex h-dvh items-center overflow-hidden bg-[#faf9f4] px-4 py-4">
     <section className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold">
              <Bot className="h-8 w-8" />
              CogniMart
            </div>

            <p className="mt-20 text-4xl font-bold leading-tight">
              Shop smarter,
              <br />
              live better.
            </p>

            <p className="mt-5 max-w-sm text-primary-foreground/80">
              Your personal AI shopping assistant helps you discover products
              made for you.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/70">
            AI-powered recommendations • Secure payments • Fast delivery
          </p>
        </div>

        <div className="flex items-center justify-center p-7 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>

              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Log in to continue shopping with CogniMart.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="h-11 w-full rounded-xl border border-input bg-background pl-10 pr-11 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="h-11 w-full rounded-xl bg-primary font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Log in
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-muted-foreground">
              New to CogniMart?{" "}
              <Link to="/register" className="font-semibold text-primary hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Login;