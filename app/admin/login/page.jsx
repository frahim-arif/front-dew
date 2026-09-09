"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api/login";

export default function AdminLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      alert("Login Successful");

      router.push("/admin/dashboard");
    } catch (err) {
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 to-cyan-50 p-5">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

        <div className="text-center">

          <h1 className="text-4xl font-black text-sky-900">
            Admin Login
          </h1>

          <p className="text-gray-500 mt-2">
            Dew Care Hospital
          </p>

        </div>

        <form onSubmit={login} className="space-y-5 mt-8">

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={changeHandler}
            className="w-full border rounded-xl p-4 outline-cyan-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={changeHandler}
            className="w-full border rounded-xl p-4 outline-cyan-500"
          />

          <button
            disabled={loading}
            className="w-full bg-sky-900 hover:bg-cyan-700 transition text-white py-4 rounded-xl font-bold"
          >
            {loading ? "Please Wait..." : "Login"}
          </button>

        </form>

      </div>

    </main>
  );
}