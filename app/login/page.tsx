"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // AKUN DUMMY
  const users = [
    {
      email: "admin@telkom.ac.id",
      password: "admin123",
      role: "admin",
    },
    {
      email: "mahasiswa@telkom.ac.id",
      password: "mhs123",
      role: "mahasiswa",
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      alert("Email atau password salah");
      return;
    }

    // Simpan login (localStorage)
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect berdasarkan role
    if (user.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("dashboard/mahasiswa");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-[360px] space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login SIPARKIR TelU</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full h-11 border rounded-md px-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full h-11 border rounded-md px-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full h-11 bg-blue-600 text-white rounded-md">
          Login
        </button>

        <p className="text-xs text-gray-500 text-center">
          Admin & Mahasiswa Telkom
        </p>
      </form>
    </div>
  );
}
