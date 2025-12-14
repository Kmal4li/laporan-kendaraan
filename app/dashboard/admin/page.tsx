"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardAdmin() {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.role !== "admin") {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Dashboard Admin</h1>
      <p>!! halaman untuk melihat laporan</p>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}
