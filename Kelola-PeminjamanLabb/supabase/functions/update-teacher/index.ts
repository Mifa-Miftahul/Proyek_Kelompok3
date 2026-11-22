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
      const email = String(body.email ?? "").trim().toLowerCase();
      const password = String(body.password ?? "");

      if (!id || !nama || !nip || !email) {
        return Response.json(
          { message: "ID, nama, NIP, dan email wajib diisi" },
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

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return Response.json(
          { message: "Format email tidak valid" },
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
          {
            message:
              "Akses ditolak. Hanya Laboran aktif yang dapat mengedit akun guru.",
          },
          { status: 403 }
        );
      }

      // Pastikan akun yang akan diedit benar-benar Guru.
      const { data: teacher, error: teacherError } = await admin
        .from("users")
        .select("id, nama, nip, email, role")
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
      const { data: duplicateNip, error: nipError } = await admin
        .from("users")
        .select("id")
        .eq("nip", nip)
        .neq("id", id)
        .maybeSingle();

      if (nipError) {
        return Response.json(
          { message: "Gagal memeriksa NIP" },
          { status: 500 }
        );
      }

      if (duplicateNip) {
        return Response.json(
          { message: "NIP sudah digunakan oleh akun lain" },
          { status: 409 }
        );
      }

      // Periksa email agar tidak digunakan akun lain.
      const { data: duplicateEmail, error: emailError } = await admin
        .from("users")
        .select("id")
        .eq("email", email)
        .neq("id", id)
        .maybeSingle();

      if (emailError) {
        return Response.json(
          { message: "Gagal memeriksa email" },
          { status: 500 }
        );
      }

      if (duplicateEmail) {
        return Response.json(
          { message: "Email sudah digunakan oleh akun lain" },
          { status: 409 }
        );
      }

      // Ambil email Auth yang sebenarnya, termasuk untuk akun lama.
      const { data: authUserData, error: getAuthUserError } =
        await admin.auth.admin.getUserById(id);

      if (getAuthUserError || !authUserData.user) {
        console.error("Gagal mengambil akun Auth Guru:", getAuthUserError);
        return Response.json(
          { message: "Gagal memeriksa akun autentikasi Guru" },
          { status: 500 }
        );
      }

      const previousAuthEmail = authUserData.user.email;

      if (!previousAuthEmail) {
        return Response.json(
          { message: "Akun autentikasi Guru tidak memiliki email" },
          { status: 500 }
        );
      }

      // Simpan perubahan profil terlebih dahulu.
      const { error: updateProfileError } = await admin
        .from("users")
        .update({ nama, nip, email })
        .eq("id", id)
        .eq("role", "guru");

      if (updateProfileError) {
        console.error("Update profil gagal:", updateProfileError);
        return Response.json(
          { message: "Gagal memperbarui data profil Guru" },
          { status: 500 }
        );
      }

      // Sinkronkan email dan password pada Supabase Auth.
      const authChanges: {
        email?: string;
        email_confirm?: boolean;
        password?: string;
      } = {};

      if (email !== previousAuthEmail.toLowerCase()) {
        authChanges.email = email;
        authChanges.email_confirm = true;
      }

      if (password) {
        authChanges.password = password;
      }

      if (Object.keys(authChanges).length > 0) {
        const { error: authError } =
          await admin.auth.admin.updateUserById(id, authChanges);

        if (authError) {
          console.error("Update Auth gagal:", authError);

          // Kembalikan profil jika perubahan Auth gagal.
          const { error: rollbackError } = await admin
            .from("users")
            .update({
              nama: teacher.nama,
              nip: teacher.nip,
              email: teacher.email,
            })
            .eq("id", id)
            .eq("role", "guru");

          if (rollbackError) {
            console.error("Rollback profil gagal:", rollbackError);
            return Response.json(
              {
                message:
                  "Update Auth dan rollback profil gagal. Perlu pemeriksaan administrator.",
              },
              { status: 500 }
            );
          }

          return Response.json(
            { message: "Gagal memperbarui email atau password akun Guru." },
            { status: 500 }
          );
        }
      }

      return Response.json({
        message: "Akun Guru berhasil diperbarui",
        data: {
          id,
          nama,
          nip,
          email,
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
