"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

type Report = {
  date: string;
  reporter: string;
  vehicle: string;
  plate: string;
  location: string;
  description: string;
  photo?: string;
  status: string;
};

// Leaflet harus non-SSR
const MapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
});

export default function DashboardMahasiswa() {
  const router = useRouter();

  // 🔐 Proteksi Mahasiswa
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user || user.role !== "mahasiswa") {
      router.replace("/login");
    }
  }, [router]);

  const [form, setForm] = useState({
    date: "",
    reporter: "",
    vehicle: "",
    plate: "",
    location: "",
    description: "",
    photo: "",
  });

  const [reports, setReports] = useState<Report[]>([]);

  const vehiclePriority: Record<string, number> = {
    Truk: 3,
    Mobil: 2,
    Motor: 1,
  };

  const priority = vehiclePriority[form.vehicle] ?? 0;
  const status =
    priority === 3
      ? "Prioritas Tinggi"
      : priority === 2
      ? "Sedang"
      : "Rendah";

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!form.date || !form.reporter || !form.vehicle || !form.location) {
    alert("Lengkapi data terlebih dahulu");
    return;
  }

  const newReport = {
    id: Date.now(), // ID unik
    date: form.date,
    reporter: form.reporter,
    title: `Parkir ${form.vehicle}`,
    description: form.description,
    status: "Menunggu",
  };

  const existingReports = JSON.parse(
    localStorage.getItem("reports") || "[]"
  );

  const updatedReports = [newReport, ...existingReports];

  localStorage.setItem("reports", JSON.stringify(updatedReports));

  alert("Laporan berhasil dikirim");

  setForm({
    date: "",
    reporter: "",
    vehicle: "",
    plate: "",
    location: "",
    description: "",
    photo: "",
  });
};


  const handleLogout = () => {
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">SI PARKIR TelU</h1>
            <p className="text-sm opacity-90">
              Pelaporan Parkir Sembarangan – Telkom University
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* MAP TELKOM */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex justify-between items-center mb-2 text-black">
            <h2 className="font-semibold">Peta Lokasi Parkir Liar</h2>
            <span className="text-xs text-gray-500">
              Klik peta untuk memilih lokasi
            </span>
          </div>

          <MapPicker
            onSelectLocation={(lat, lng) =>
              setForm({
                ...form,
                location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
              })
            }
          />
        </div>

        {/* FORM + RIWAYAT */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-sm p-5 space-y-4 text-black"
          >
            <h2 className="font-semibold">Form Laporan</h2>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="h-11 border rounded-md px-3 w-full"
            />

            <input
              type="text"
              placeholder="Nama Pelapor"
              value={form.reporter}
              onChange={(e) => setForm({ ...form, reporter: e.target.value })}
              className="h-11 border rounded-md px-3 w-full"
            />

            <select
              value={form.vehicle}
              onChange={(e) => setForm({ ...form, vehicle: e.target.value })}
              className="h-11 border rounded-md px-3 w-full"
            >
              <option value="">Pilih Kendaraan</option>
              <option>Motor</option>
              <option>Mobil</option>
              <option>Truk</option>
            </select>

            <input
              type="text"
              placeholder="Nomor Polisi"
              value={form.plate}
              onChange={(e) => setForm({ ...form, plate: e.target.value })}
              className="h-11 border rounded-md px-3 w-full"
            />

            <input
              type="text"
              placeholder="Lokasi (otomatis dari peta)"
              value={form.location}
              readOnly
              className="h-11 border rounded-md px-3 w-full bg-gray-100"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setForm({ ...form, photo: URL.createObjectURL(file) });
              }}
            />

            {form.photo && (
              <img
                src={form.photo}
                className="w-full h-40 object-cover rounded-md border"
                alt="Preview"
              />
            )}

            <textarea
              rows={3}
              placeholder="Deskripsi"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="border rounded-md px-3 py-2 w-full"
            />

            <button className="w-full h-11 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Kirim Laporan
            </button>
          </form>

          {/* RIWAYAT */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-5 text-black">
            <h2 className="font-semibold mb-3">Riwayat Laporan</h2>

            {reports.length === 0 ? (
              <p className="text-sm text-gray-500">Belum ada laporan.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th>Tanggal</th>
                    <th>Pelapor</th>
                    <th>Kendaraan</th>
                    <th>Plat</th>
                    <th>Lokasi</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r, i) => (
                    <tr key={i} className="border-b">
                      <td>{r.date}</td>
                      <td>{r.reporter}</td>
                      <td>{r.vehicle}</td>
                      <td>{r.plate}</td>
                      <td>{r.location}</td>
                      <td className="text-yellow-600 font-semibold">
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
