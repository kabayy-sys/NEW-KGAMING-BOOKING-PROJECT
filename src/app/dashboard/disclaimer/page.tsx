"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Disclaimer } from "@/types/database";

const staticDisclaimers: Disclaimer[] = [
  { id: "1", content: "Booking dianggap aktif setelah pembayaran diverifikasi staff.", active: true, sort_order: 1 },
  { id: "2", content: "Pembayaran wajib dilakukan maksimal 15 menit setelah booking dibuat.", active: true, sort_order: 2 },
  { id: "3", content: "Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis.", active: true, sort_order: 3 },
  { id: "4", content: "Keterlambatan pelanggan tidak menambah durasi bermain.", active: true, sort_order: 4 },
  { id: "5", content: "Dengan melanjutkan, pelanggan dianggap menyetujui seluruh ketentuan.", active: true, sort_order: 5 },
  { id: "6", content: "Perpindahan waktu (reschedule) maksimal 6 jam sebelum jadwal bermain.", active: true, sort_order: 6 },
  { id: "7", content: "Uang booking yang sudah dibayarkan tidak dapat dikembalikan.", active: true, sort_order: 7 },
];

export default function DisclaimerPage() {
  const [disclaimers, setDisclaimers] = useState<Disclaimer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createContent, setCreateContent] = useState("");
  const [createActive, setCreateActive] = useState(true);

  const [editingDisclaimer, setEditingDisclaimer] = useState<Disclaimer | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editActive, setEditActive] = useState(true);

  const [deletingDisclaimer, setDeletingDisclaimer] = useState<Disclaimer | null>(null);

  const showNotification = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  // READ (Fetch all disclaimers)
  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("disclaimers")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Error fetching disclaimers:", error);
        setDisclaimers(staticDisclaimers);
      } else if (data && data.length > 0) {
        setDisclaimers(data);
      } else {
        setDisclaimers(staticDisclaimers);
      }
    } catch (err) {
      console.error("Fetch exception:", err);
      setDisclaimers(staticDisclaimers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // CREATE (Add new disclaimer)
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createContent.trim()) {
      showNotification("error", "Konten disclaimer tidak boleh kosong!");
      return;
    }

    setActionLoading(true);
    try {
      const nextSortOrder = disclaimers.length > 0 
        ? Math.max(...disclaimers.map((d) => d.sort_order)) + 1 
        : 1;

      const { data, error } = await supabase
        .from("disclaimers")
        .insert({
          content: createContent.trim(),
          active: createActive,
          sort_order: nextSortOrder,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      showNotification("success", "Disclaimer baru berhasil ditambahkan!");
      setIsCreateOpen(false);
      setCreateContent("");
      setCreateActive(true);
      await fetchData();
    } catch (err: any) {
      console.error("Create error:", err);
      showNotification("error", `Gagal menambahkan: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // UPDATE (Edit existing disclaimer)
  const openEditModal = (d: Disclaimer) => {
    setEditingDisclaimer(d);
    setEditContent(d.content);
    setEditActive(d.active);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDisclaimer) return;
    if (!editContent.trim()) {
      showNotification("error", "Konten disclaimer tidak boleh kosong!");
      return;
    }

    setActionLoading(true);
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(editingDisclaimer.id);

      let result;
      if (isUuid) {
        result = await supabase
          .from("disclaimers")
          .update({
            content: editContent.trim(),
            active: editActive,
          })
          .eq("id", editingDisclaimer.id);
      } else {
        // Jika fallback ID, update berdasarkan sort_order
        result = await supabase
          .from("disclaimers")
          .update({
            content: editContent.trim(),
            active: editActive,
          })
          .eq("sort_order", editingDisclaimer.sort_order);
      }

      if (result?.error) {
        throw new Error(result.error.message);
      }

      showNotification("success", "Disclaimer berhasil diperbarui!");
      setEditingDisclaimer(null);
      await fetchData();
    } catch (err: any) {
      console.error("Update error:", err);
      showNotification("error", `Gagal memperbarui: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Quick Toggle Active Status
  const handleQuickToggleActive = async (d: Disclaimer) => {
    const newStatus = !d.active;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(d.id);

    // Optimistic update
    setDisclaimers((prev) =>
      prev.map((item) => (item.id === d.id ? { ...item, active: newStatus } : item))
    );

    try {
      let result;
      if (isUuid) {
        result = await supabase
          .from("disclaimers")
          .update({ active: newStatus })
          .eq("id", d.id);
      } else {
        result = await supabase
          .from("disclaimers")
          .update({ active: newStatus })
          .eq("sort_order", d.sort_order);
      }

      if (result?.error) {
        throw new Error(result.error.message);
      }

      showNotification("success", `Disclaimer #${d.sort_order} ${newStatus ? "diaktifkan" : "dinonaktifkan"}`);
    } catch (err: any) {
      console.error("Toggle error:", err);
      showNotification("error", `Gagal mengubah status: ${err.message}`);
      await fetchData(); // Rollback
    }
  };

  // REORDER (Move Up / Down)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= disclaimers.length) return;

    const currentItem = disclaimers[index];
    const targetItem = disclaimers[targetIndex];

    const newDisclaimers = [...disclaimers];
    newDisclaimers[index] = { ...targetItem, sort_order: currentItem.sort_order };
    newDisclaimers[targetIndex] = { ...currentItem, sort_order: targetItem.sort_order };
    setDisclaimers(newDisclaimers);

    try {
      // Update keduanya di DB
      await Promise.all([
        supabase.from("disclaimers").update({ sort_order: targetItem.sort_order }).eq("id", currentItem.id),
        supabase.from("disclaimers").update({ sort_order: currentItem.sort_order }).eq("id", targetItem.id),
      ]);
      await fetchData();
    } catch (err) {
      console.error("Reorder error:", err);
      await fetchData();
    }
  };

  // DELETE
  const handleDeleteConfirm = async () => {
    if (!deletingDisclaimer) return;

    setActionLoading(true);
    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(deletingDisclaimer.id);

      let result;
      if (isUuid) {
        result = await supabase.from("disclaimers").delete().eq("id", deletingDisclaimer.id);
      } else {
        result = await supabase.from("disclaimers").delete().eq("sort_order", deletingDisclaimer.sort_order);
      }

      if (result?.error) {
        throw new Error(result.error.message);
      }

      showNotification("success", "Disclaimer berhasil dihapus!");
      setDeletingDisclaimer(null);
      await fetchData();
    } catch (err: any) {
      console.error("Delete error:", err);
      showNotification("error", `Gagal menghapus: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold">Disclaimer Management</h1>
          <p className="text-xs mt-1" style={{ color: "#A1A1AA" }}>
            Kelola syarat & ketentuan booking yang ditampilkan ke pelanggan (CRUD)
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold text-black transition-transform active:scale-95 hover:opacity-90 self-start sm:self-auto"
          style={{ backgroundColor: "#F5B700" }}
        >
          <span>➕</span>
          <span>Tambah Disclaimer Baru</span>
        </button>
      </div>

      {/* Notification Toast */}
      {message && (
        <div
          className="p-3.5 rounded-xl mb-4 text-xs font-medium flex items-center justify-between transition-all"
          style={{
            backgroundColor: message.type === "success" ? "#22C55E20" : "#EF444420",
            border: `1px solid ${message.type === "success" ? "#22C55E50" : "#EF444450"}`,
            color: message.type === "success" ? "#4ADE80" : "#F87171",
          }}
        >
          <span>{message.text}</span>
          <button onClick={() => setMessage(null)} className="opacity-70 hover:opacity-100 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Content List */}
      {loading ? (
        <div className="py-12 text-center text-sm" style={{ color: "#A1A1AA" }}>
          Memuat data disclaimer...
        </div>
      ) : disclaimers.length === 0 ? (
        <div
          className="rounded-xl p-8 text-center"
          style={{ backgroundColor: "#1F2330", border: "1px dashed #3F4452" }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: "#A1A1AA" }}>
            Belum ada disclaimer yang terdaftar.
          </p>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-black"
            style={{ backgroundColor: "#F5B700" }}
          >
            + Tambah Disclaimer Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {disclaimers.map((d, index) => (
            <div
              key={d.id || index}
              className="rounded-xl p-4 transition-all"
              style={{
                backgroundColor: "#1F2330",
                border: "1px solid #3F4452",
                opacity: d.active ? 1 : 0.65,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                {/* Number & Content */}
                <div className="flex items-start gap-3 flex-1">
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      backgroundColor: "#171923",
                      color: "#F5B700",
                      border: "1px solid #3F4452",
                    }}
                  >
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-white leading-relaxed whitespace-pre-wrap">{d.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: d.active ? "#22C55E20" : "#6B728020",
                          color: d.active ? "#4ADE80" : "#9CA3AF",
                          border: `1px solid ${d.active ? "#22C55E40" : "#6B728040"}`,
                        }}
                      >
                        {d.active ? "● Aktif" : "○ Nonaktif"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-start flex-shrink-0">
                  {/* Reorder Buttons */}
                  <div className="flex items-center bg-[#171923] rounded-lg p-0.5 border border-[#3F4452] mr-1">
                    <button
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      title="Geser ke Atas"
                      className="px-2 py-1 text-xs text-white hover:text-[#F5B700] disabled:opacity-30 disabled:hover:text-white transition-colors"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMove(index, "down")}
                      disabled={index === disclaimers.length - 1}
                      title="Geser ke Bawah"
                      className="px-2 py-1 text-xs text-white hover:text-[#F5B700] disabled:opacity-30 disabled:hover:text-white transition-colors"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Quick Active Toggle */}
                  <button
                    onClick={() => handleQuickToggleActive(d)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      backgroundColor: d.active ? "#22C55E15" : "#3F4452",
                      color: d.active ? "#4ADE80" : "#A1A1AA",
                      border: `1px solid ${d.active ? "#22C55E40" : "#52525B"}`,
                    }}
                    title="Ubah Status Aktif/Nonaktif"
                  >
                    {d.active ? "Nonaktifkan" : "Aktifkan"}
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(d)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:bg-opacity-80"
                    style={{ backgroundColor: "#2563EB" }}
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setDeletingDisclaimer(d)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-400 bg-red-950/40 hover:bg-red-900/60 transition-colors border border-red-800/40"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL: CREATE DISCLAIMER ================= */}
      {isCreateOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => !actionLoading && setIsCreateOpen(false)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            style={{ backgroundColor: "#1F2330", border: "1px solid #3F4452" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#3F4452]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>➕</span> Tambah Disclaimer Baru
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                disabled={actionLoading}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#A1A1AA" }}>
                  Isi Ketentuan / Disclaimer <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Contoh: Booking yang tidak dibayar dalam 15 menit akan dibatalkan otomatis."
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white resize-none outline-none focus:border-[#F5B700] transition-colors"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#171923] border border-[#3F4452]">
                <div>
                  <p className="text-xs font-semibold text-white">Status Disclaimer</p>
                  <p className="text-[11px]" style={{ color: "#A1A1AA" }}>
                    Tampilkan langsung di halaman booking
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateActive(!createActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    createActive ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {createActive ? "Aktif" : "Nonaktif"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-[#171923] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !createContent.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#F5B700" }}
                >
                  {actionLoading ? "Menyimpan..." : "Simpan Disclaimer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT DISCLAIMER ================= */}
      {editingDisclaimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => !actionLoading && setEditingDisclaimer(null)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4"
            style={{ backgroundColor: "#1F2330", border: "1px solid #3F4452" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#3F4452]">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>✏️</span> Edit Disclaimer #{editingDisclaimer.sort_order}
              </h3>
              <button
                onClick={() => setEditingDisclaimer(null)}
                disabled={actionLoading}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ color: "#A1A1AA" }}>
                  Isi Ketentuan / Disclaimer <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={4}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm text-white resize-none outline-none focus:border-[#F5B700] transition-colors"
                  style={{ backgroundColor: "#171923", border: "1px solid #3F4452" }}
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#171923] border border-[#3F4452]">
                <div>
                  <p className="text-xs font-semibold text-white">Status Disclaimer</p>
                  <p className="text-[11px]" style={{ color: "#A1A1AA" }}>
                    Tampilkan di halaman booking pelanggan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditActive(!editActive)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    editActive ? "bg-green-600 text-white" : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {editActive ? "Aktif" : "Nonaktif"}
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingDisclaimer(null)}
                  disabled={actionLoading}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-[#171923] transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !editContent.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-black transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ backgroundColor: "#F5B700" }}
                >
                  {actionLoading ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DELETE CONFIRMATION ================= */}
      {deletingDisclaimer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => !actionLoading && setDeletingDisclaimer(null)}
        >
          <div
            className="rounded-2xl p-6 w-full max-w-sm shadow-2xl space-y-4"
            style={{ backgroundColor: "#1F2330", border: "1px solid #EF444450" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-950/60 text-red-400 text-2xl mb-3 border border-red-700/50">
                ⚠️
              </span>
              <h3 className="text-base font-bold text-white">Hapus Disclaimer?</h3>
              <p className="text-xs mt-2 text-gray-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus ketentuan:
              </p>
              <div className="mt-2.5 p-3 rounded-lg bg-[#171923] border border-[#3F4452] text-xs text-left text-gray-200 line-clamp-3">
                &ldquo;{deletingDisclaimer.content}&rdquo;
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingDisclaimer(null)}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:bg-[#171923] border border-[#3F4452] transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 shadow-lg shadow-red-900/30"
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
