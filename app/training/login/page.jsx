
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Loader2,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

export default function TrainingStudentLoginPage() {
  const router = useRouter();

  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API}/training/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Login failed. Please try again.");
      }

      if (data.token) {
        localStorage.setItem("trainingStudentToken", data.token);
      }

      if (data.student) {
        localStorage.setItem(
          "trainingStudent",
          JSON.stringify(data.student)
        );
      }

      router.push("/training/dashboard");
    } catch (err) {
      setError(
        err.message || "Unable to login. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f2f7f6] px-4 py-10 sm:py-16">
      <div className="mx-auto flex min-h-[75vh] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden border border-[#dce9e5] bg-white shadow-xl md:grid-cols-2">

          {/* LEFT SECTION */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-[#123d32] p-8 text-white sm:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
            <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full border border-white/10" />

            <div className="relative z-10">
              <Link href="/" className="inline-flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center bg-white text-[#123d32]">
                  <GraduationCap size={28} />
                </div>
                <div>
                  <p className="text-lg font-bold tracking-wide">
                    DEW CARE HOSPITAL
                  </p>
                  <p className="text-xs tracking-[3px] text-[#d7c58f]">
                    TRAINING PORTAL
                  </p>
                </div>
              </Link>

              <div className="mt-16">
                <p className="mb-4 text-sm font-semibold uppercase tracking-[3px] text-[#d7c58f]">
                  Student Portal
                </p>

                <h1 className="max-w-md text-3xl font-bold leading-tight sm:text-4xl">
                  Welcome Back to Your Learning Journey
                </h1>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/75">
                  Sign in to access your training course information,
                  application details and student dashboard.
                </p>
              </div>
            </div>

            <div className="relative z-10 mt-16 flex items-center gap-3 border-t border-white/15 pt-6">
              <ShieldCheck className="text-[#d7c58f]" size={25} />
              <p className="text-xs leading-5 text-white/70">
                Secure student access
                <br />
                Dew Care Hospital & Research Centre
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[2px] text-[#a18b50]">
                  Student Account
                </p>

                <h2 className="mt-3 text-3xl font-bold text-[#173b32]">
                  Student Login
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Enter your registered mobile number and password.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* MOBILE */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Mobile Number
                  </label>

                  <div className="flex h-13 items-center border border-gray-200 bg-[#fafcfb] px-4 focus-within:border-[#28745f]">
                    <Phone size={18} className="text-[#66877c]" />

                    <span className="ml-3 border-r border-gray-200 pr-3 text-sm text-gray-500">
                      +91
                    </span>

                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      maxLength={10}
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) =>
                        setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Password
                  </label>

                  <div className="flex h-13 items-center border border-gray-200 bg-[#fafcfb] px-4 focus-within:border-[#28745f]">
                    <Lock size={18} className="text-[#66877c]" />

                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm text-gray-800 outline-none"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-[#123d32]"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    href="/training/forgot-password"
                    className="text-sm font-medium text-[#28745f] hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-13 w-full items-center justify-center gap-2 bg-[#174b3d] px-5 text-sm font-bold text-white transition hover:bg-[#10382e] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={19} className="animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Login to Student Portal
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400">NEW STUDENT?</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <Link
                href="/training/application-form"
                className="flex h-12 w-full items-center justify-center border border-[#174b3d] text-sm font-bold text-[#174b3d] transition hover:bg-[#f0f7f4]"
              >
                Apply for Training
              </Link>

              <p className="mt-8 text-center text-xs leading-6 text-gray-400">
                © {new Date().getFullYear()} Dew Care Hospital & Research Centre.
                <br />
                All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
