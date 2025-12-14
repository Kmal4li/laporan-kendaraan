"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Report = {
  id: number;
  date: string;
  reporter: string;
  title: string;
  description: string;
  status: "Menunggu" | "Diproses" | "Selesai";
};

export default function DashboardAdmin() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);

  // 🔐 Proteksi Admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "admin") {
      router.replace("/login");
    }
  }, [router]);

  // 📥 Ambil laporan
  useEffect(() => {
    const storedReports = JSON.parse(
      localStorage.getItem("reports") || "[]"
    );
    setReports(storedReports);
  }, []);

  // 🔄 Update status
  const updateStatus = (id: number, status: Report["status"]) => {
    const updated = reports.map((r) =>
      r.id === id ? { ...r, status } : r
    );
    setReports(updated);
    localStorage.setItem("reports", JSON.stringify(updated));
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Dashboard Admin
            </h1>
            <p className="text-sm text-gray-500">
              Monitoring laporan mahasiswa
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* INFO CARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Total Laporan</p>
            <p className="text-2xl font-bold">{reports.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-500">
              {reports.filter((r) => r.status === "Menunggu").length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4">
            <p className="text-sm text-gray-500">Selesai</p>
            <p className="text-2xl font-bold text-green-600">
              {reports.filter((r) => r.status === "Selesai").length}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Pelapor</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Belum ada laporan masuk
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-2">{r.date}</td>
                    <td className="px-4 py-2">{r.reporter}</td>
                    <td className="px-4 py-2 font-medium">
                      {r.title}
                    </td>
                    <td className="px-4 py-2 truncate max-w-xs">
                      {r.description}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs text-white
                          ${
                            r.status === "Menunggu"
                              ? "bg-yellow-500"
                              : r.status === "Diproses"
                              ? "bg-blue-500"
                              : "bg-green-600"
                          }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center space-x-1">
                      <button
                        onClick={() =>
                          updateStatus(r.id, "Diproses")
                        }
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                      >
                        Proses
                      </button>
                      <button
                        onClick={() =>
                          updateStatus(r.id, "Selesai")
                        }
                        className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                      >
                        Selesai
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
