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
      const nama = String(body.nama ?? "").trim();
      const nip = String(body.nip ?? "").trim();
      const password = String(body.password ?? "");

      if (!id || !nama || !nip) {
        return Response.json(
          { message: "ID, nama, dan NIP wajib diisi" },
          { status: 400 }
        );
      }

      if (nama.length < 2 || nama.length > 100) {
        return Response.json(
          { message: "Nama harus terdiri dari 2 sampai 100 karakter" },
          { status: 400 }
        );
      }

      if (!/^\d{8,18}$/.test(nip)) {
        return Response.json(
          { message: "NIP harus berupa 8 sampai 18 digit angka" },
          { status: 400 }
        );
      }

      if (password && password.length < 6) {
        return Response.json(
          { message: "Password minimal 6 karakter" },
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
          { message: "Akses ditolak. Hanya Laboran aktif yang dapat mengedit akun guru." },
          { status: 403 }
        );
      }

      // Pastikan akun yang akan diedit benar-benar Guru.
      const { data: teacher, error: teacherError } = await admin
        .from("users")
        .select("id, nama, nip, role")
        .eq("id", id)
        .maybeSingle();

      if (teacherError) {
        return Response.json(
          { message: "Gagal memeriksa akun guru" },
          { status: 500 }
        );
      }

      if (!teacher || teacher.role !== "guru") {
        return Response.json(
          { message: "Akun guru tidak ditemukan" },
          { status: 404 }
        );
      }

      // Periksa NIP agar tidak digunakan akun lain.
      const { data: duplicate, error: duplicateError } = await admin
        .from("users")
        .select("id")
        .eq("nip", nip)
        .neq("id", id)
        .maybeSingle();

      if (duplicateError) {
        return Response.json(
          { message: "Gagal memeriksa NIP" },
          { status: 500 }
        );
      }

      if (duplicate) {
        return Response.json(
          { message: "NIP sudah digunakan oleh akun lain" },
          { status: 409 }
        );
      }

      // Perbarui profil Guru terlebih dahulu.
      const { error: updateProfileError } = await admin
        .from("users")
        .update({ nama, nip })
        .eq("id", id)
        .eq("role", "guru");

      if (updateProfileError) {
        return Response.json(
          { message: "Gagal memperbarui data guru" },
          { status: 500 }
        );
      }

      const authChanges: {
        email?: string;
        email_confirm?: boolean;
        password?: string;
      } = {};

      if (nip !== teacher.nip) {
        authChanges.email = `${nip}@silakom.id`;
        authChanges.email_confirm = true;
      }

      if (password) {
        authChanges.password = password;
      }

      // Sinkronkan email/password Supabase Auth jika ada perubahan.
      if (Object.keys(authChanges).length > 0) {
        const { error: authError } =
          await admin.auth.admin.updateUserById(id, authChanges);

        if (authError) {
          // Kembalikan profil ke data sebelumnya jika Auth gagal.
          const { error: rollbackError } = await admin
            .from("users")
            .update({
              nama: teacher.nama,
              nip: teacher.nip,
            })
            .eq("id", id);

          if (rollbackError) {
            console.error("Rollback profil gagal:", rollbackError);
          }

          console.error("Update Auth gagal:", authError);

          return Response.json(
            {
              message: rollbackError
                ? "Gagal memperbarui Auth dan mengembalikan data profil. Perlu pemeriksaan administrator."
                : "Gagal memperbarui email atau password akun guru. Data profil dikembalikan.",
            },
            { status: 500 }
          );
        }
      }

      return Response.json({
        message: "Akun guru berhasil diperbarui",
        data: {
          id,
          nama,
          nip,
        },
      });
    } catch (error) {
      console.error("Update teacher error:", error);

      return Response.json(
        { message: "Terjadi kesalahan pada server" },
        { status: 500 }
      );
    }
  }),
};
