import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      if (req.method !== "POST") {
        return Response.json(
          { message: "Method tidak diizinkan" },
          { status: 405 }
        );
      }

      const userId = ctx.userClaims?.id;

      if (!userId) {
        return Response.json(
          { message: "Sesi pengguna tidak valid" },
          { status: 401 }
        );
      }

      const body = await req.json();
      const id = String(body.id ?? "").trim();

      if (!id) {
        return Response.json(
          { message: "ID Guru wajib diisi" },
          { status: 400 }
        );
      }

      const admin = ctx.supabaseAdmin;

      // Pastikan pemanggil adalah Laboran aktif.
      const { data: caller, error: callerError } = await admin
        .from("users")
        .select("id, role, is_active")
        .eq("id", userId)
        .maybeSingle();

      if (
        callerError ||
        !caller ||
        caller.role !== "laboran" ||
        caller.is_active !== true
      ) {
        return Response.json(
          { message: "Akses ditolak. Hanya Laboran aktif yang dapat menghapus akun Guru." },
          { status: 403 }
        );
      }

      // Pastikan target adalah Guru yang masih aktif.
      const { data: teacher, error: teacherError } = await admin
        .from("users")
        .select("id, nama, role, is_active")
        .eq("id", id)
        .maybeSingle();

      if (teacherError) {
        return Response.json(
          { message: "Gagal memeriksa akun Guru" },
          { status: 500 }
        );
      }

      if (!teacher || teacher.role !== "guru") {
        return Response.json(
          { message: "Akun Guru tidak ditemukan" },
          { status: 404 }
        );
      }

      if (!teacher.is_active) {
        return Response.json(
          { message: "Akun Guru sudah dinonaktifkan" },
          { status: 409 }
        );
      }

      // Nonaktifkan akun tanpa menghapus riwayat peminjaman.
      const { error: updateError } = await admin
        .from("users")
        .update({ is_active: false })
        .eq("id", id)
        .eq("role", "guru");

      if (updateError) {
        console.error("Gagal menonaktifkan Guru:", updateError);

        return Response.json(
          { message: "Gagal menonaktifkan akun Guru" },
          { status: 500 }
        );
      }

      return Response.json({
        message: "Akun Guru berhasil dinonaktifkan",
        data: {
          id: teacher.id,
          nama: teacher.nama,
          is_active: false,
        },
      });
    } catch (error) {
      console.error("Delete teacher error:", error);

      return Response.json(
        { message: "Terjadi kesalahan pada server" },
        { status: 500 }
      );
    }
  }),
};
