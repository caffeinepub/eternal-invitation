import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useAdminLogin,
  useAdminSignup,
  useIsAdminSetup,
  useVerifyAdminSession,
} from "../../hooks/useQueries";
import { hashPassword } from "../../utils/adminSession";

type Step = "check" | "setup" | "login" | "done";

export function AdminLoginPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: isSetup, isLoading: checkingSetup } = useIsAdminSetup();
  const { data: isSessionValid, isLoading: checkingSession } =
    useVerifyAdminSession();

  const signupMut = useAdminSignup();
  const loginMut = useAdminLogin();

  const [step, setStep] = useState<Step>("check");

  // Redirect if already logged in
  useEffect(() => {
    if (!checkingSession && isSessionValid === true) {
      void navigate({ to: "/admin" });
    }
  }, [checkingSession, isSessionValid, navigate]);

  // Setup form
  const [setupEmail, setSetupEmail] = useState("");
  const [setupPassword, setSetupPassword] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");
  const [showSetupPw, setShowSetupPw] = useState(false);
  const [showSetupConfirm, setShowSetupConfirm] = useState(false);
  const [setupError, setSetupError] = useState("");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Determine step once isSetup is known
  useEffect(() => {
    if (checkingSetup) return;
    if (step === "check") {
      setStep(isSetup ? "login" : "setup");
    }
  }, [checkingSetup, isSetup, step]);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setSetupError("");

    if (!setupEmail.trim()) {
      setSetupError("Please enter your email address.");
      return;
    }
    if (setupPassword.length < 8) {
      setSetupError("Password must be at least 8 characters.");
      return;
    }
    if (setupPassword !== setupConfirm) {
      setSetupError("Passwords do not match.");
      return;
    }

    try {
      const hash = await hashPassword(setupPassword);
      const success = await signupMut.mutateAsync({
        email: setupEmail.trim().toLowerCase(),
        passwordHash: hash,
      });
      if (!success) {
        setSetupError("Setup failed. Admin may already be registered.");
        return;
      }
      toast.success("Admin account created! Signing you in...");
      // Auto-login after signup
      await loginMut.mutateAsync({
        email: setupEmail.trim().toLowerCase(),
        passwordHash: hash,
      });
      void qc.invalidateQueries({ queryKey: ["adminSession"] });
      setStep("done");
      setTimeout(() => {
        void navigate({ to: "/admin" });
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Setup failed";
      setSetupError(msg);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim()) {
      setLoginError("Please enter your email address.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please enter your password.");
      return;
    }

    try {
      const hash = await hashPassword(loginPassword);
      await loginMut.mutateAsync({
        email: loginEmail.trim().toLowerCase(),
        passwordHash: hash,
      });
      void qc.invalidateQueries({ queryKey: ["adminSession"] });
      toast.success("Access granted! Welcome to your dashboard.");
      setStep("done");
      setTimeout(() => {
        void navigate({ to: "/admin" });
      }, 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      if (
        msg.includes("Invalid") ||
        msg.includes("wrong") ||
        msg.includes("not found") ||
        msg.includes("incorrect") ||
        msg.includes("Unauthorized")
      ) {
        setLoginError("Incorrect email or password. Please try again.");
      } else {
        setLoginError(msg);
      }
    }
  }

  const isLoading = checkingSetup || step === "check";

  return (
    <main className="min-h-screen bg-foreground flex items-center justify-center px-6 py-12">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-5 blur-3xl bg-gold" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-5 blur-2xl bg-gold" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-3 blur-3xl bg-gold" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/assets/generated/eternal-logo-transparent.dim_200x200.png"
            alt="Eternal Invitation"
            className="w-16 h-16 mx-auto mb-4"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <h1 className="font-display text-3xl text-ivory mb-2">
            Admin Access
          </h1>
          <p className="font-body text-xs text-ivory/40 tracking-widest uppercase">
            Eternal Invitation Dashboard
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-sm p-8"
          style={{
            background: "oklch(var(--ivory) / 0.04)",
            border: "1px solid oklch(var(--gold) / 0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Loading / check step */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-6">
              <Loader2 size={32} className="text-gold animate-spin" />
              <p className="font-body text-sm text-ivory/40 tracking-widest uppercase">
                Checking setup...
              </p>
            </div>
          )}

          {/* Setup step */}
          {step === "setup" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-lg text-ivory">
                    Create Admin Account
                  </h2>
                  <p className="font-body text-xs text-ivory/40">
                    First-time setup — only done once
                  </p>
                </div>
              </div>

              <form onSubmit={handleSetup} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="setup-email"
                    className="font-body text-xs text-ivory/50 tracking-widest uppercase block mb-2"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
                    />
                    <input
                      id="setup-email"
                      type="email"
                      value={setupEmail}
                      onChange={(e) => {
                        setSetupEmail(e.target.value);
                        setSetupError("");
                      }}
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                      data-ocid="admin.setup.email_input"
                      className="w-full bg-ivory/5 border border-gold/20 rounded-sm pl-10 pr-4 py-3 font-body text-sm text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="setup-password"
                    className="font-body text-xs text-ivory/50 tracking-widest uppercase block mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
                    />
                    <input
                      id="setup-password"
                      type={showSetupPw ? "text" : "password"}
                      value={setupPassword}
                      onChange={(e) => {
                        setSetupPassword(e.target.value);
                        setSetupError("");
                      }}
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      required
                      data-ocid="admin.setup.password_input"
                      className="w-full bg-ivory/5 border border-gold/20 rounded-sm pl-10 pr-12 py-3 font-body text-sm text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition"
                      aria-label={
                        showSetupPw ? "Hide password" : "Show password"
                      }
                    >
                      {showSetupPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="setup-confirm"
                    className="font-body text-xs text-ivory/50 tracking-widest uppercase block mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
                    />
                    <input
                      id="setup-confirm"
                      type={showSetupConfirm ? "text" : "password"}
                      value={setupConfirm}
                      onChange={(e) => {
                        setSetupConfirm(e.target.value);
                        setSetupError("");
                      }}
                      placeholder="Repeat your password"
                      autoComplete="new-password"
                      required
                      data-ocid="admin.setup.confirm_input"
                      className="w-full bg-ivory/5 border border-gold/20 rounded-sm pl-10 pr-12 py-3 font-body text-sm text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSetupConfirm((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition"
                      aria-label={
                        showSetupConfirm ? "Hide password" : "Show password"
                      }
                    >
                      {showSetupConfirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {setupError && (
                  <div className="p-3 rounded-sm bg-destructive/20 border border-destructive/30">
                    <p className="font-body text-xs text-destructive leading-relaxed">
                      {setupError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={signupMut.isPending || loginMut.isPending}
                  data-ocid="admin.setup.submit_button"
                  className="btn-gold w-full flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium disabled:opacity-50 mt-2"
                >
                  {signupMut.isPending || loginMut.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={15} />
                      Create Admin Account
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Login step */}
          {step === "login" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center">
                  <Lock size={18} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-display text-lg text-ivory">
                    Admin Sign In
                  </h2>
                  <p className="font-body text-xs text-ivory/40">
                    Enter your email and password
                  </p>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="login-email"
                    className="font-body text-xs text-ivory/50 tracking-widest uppercase block mb-2"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
                    />
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="your@email.com"
                      autoComplete="email"
                      required
                      data-ocid="admin.login.email_input"
                      className="w-full bg-ivory/5 border border-gold/20 rounded-sm pl-10 pr-4 py-3 font-body text-sm text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="login-password"
                    className="font-body text-xs text-ivory/50 tracking-widest uppercase block mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-ivory/30"
                    />
                    <input
                      id="login-password"
                      type={showLoginPw ? "text" : "password"}
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="Your admin password"
                      autoComplete="current-password"
                      required
                      data-ocid="admin.login.password_input"
                      className="w-full bg-ivory/5 border border-gold/20 rounded-sm pl-10 pr-12 py-3 font-body text-sm text-ivory placeholder:text-ivory/20 focus:outline-none focus:border-gold/50 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-ivory/30 hover:text-ivory/60 transition"
                      aria-label={
                        showLoginPw ? "Hide password" : "Show password"
                      }
                    >
                      {showLoginPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {loginError && (
                  <div className="p-3 rounded-sm bg-destructive/20 border border-destructive/30">
                    <p className="font-body text-xs text-destructive leading-relaxed">
                      {loginError}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginMut.isPending}
                  data-ocid="admin.login.submit_button"
                  className="btn-gold w-full flex items-center justify-center gap-2 px-8 py-4 rounded-sm font-body text-sm tracking-widest uppercase font-medium disabled:opacity-50 mt-2"
                >
                  {loginMut.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock size={15} />
                      Sign In
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          )}

          {/* Done step */}
          {step === "done" && (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={24} className="text-gold" />
              </div>
              <h3 className="font-display text-xl text-ivory mb-2">
                Access Granted
              </h3>
              <p className="font-body text-sm text-ivory/50 mb-4">
                Redirecting to your dashboard...
              </p>
              <Loader2 size={20} className="text-gold animate-spin mx-auto" />
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center font-body text-xs text-ivory/15 mt-8 leading-relaxed">
          This is a secured admin portal. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </main>
  );
}
