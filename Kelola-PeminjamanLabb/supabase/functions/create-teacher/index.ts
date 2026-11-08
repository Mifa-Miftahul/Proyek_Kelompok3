import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "user" }, async (req, ctx) => {
    try {
      // Hanya menerima metode POST.
      if (req.method !== "POST") {
        return Response.json(
          {
            status: "error",
            message: "Metode permintaan tidak diizinkan.",
          },
          { status: 405 },
        );
      }

      // Memastikan identitas pengguna tersedia.
      const userId = ctx.userClaims?.id;

      if (!userId) {
        return Response.json(
          {
            status: "error",
            message: "Silakan login terlebih dahulu.",
          },
          { status: 401 },
        );
      }

      // Memeriksa hak akses Laboran.
      const { data: laboran, error: laboranError } =
        await ctx.supabaseAdmin
          .from("users")
          .select("id, role, is_active")
          .eq("id", userId)
          .maybeSingle();

      if (laboranError) {
        console.error("Gagal memeriksa akun Laboran:", laboranError);

        return Response.json(
          {
            status: "error",
            message: "Gagal memeriksa hak akses pengguna.",
          },
          { status: 500 },
        );
      }

      if (
        !laboran ||
        laboran.role !== "laboran" ||
        laboran.is_active !== true
      ) {
        return Response.json(
          {
            status: "error",
            message: "Anda tidak memiliki izin untuk membuat akun Guru.",
          },
          { status: 403 },
        );
      }

      // Membaca data formulir.
      let body: {
        nama?: string;
        nip?: string;
        password?: string;
      };

      try {
        body = await req.json();
      } catch {
        return Response.json(
          {
            status: "error",
            message: "Format data yang dikirim tidak valid.",
          },
          { status: 400 },
        );
      }

      const nama = body.nama?.trim() ?? "";
      const nip = body.nip?.trim() ?? "";
      const password = body.password ?? "";

      // Validasi nama.
      if (!nama) {
        return Response.json(
          {
            status: "error",
            message: "Nama Guru wajib diisi.",
          },
          { status: 400 },
        );
      }

      // Validasi NIP.
      if (!/^\d{8,18}$/.test(nip)) {
        return Response.json(
          {
            status: "error",
            message: "NIP harus berupa angka, 8 sampai 18 digit.",
          },
          { status: 400 },
        );
      }

      // Validasi password.
      if (password.length < 6) {
        return Response.json(
          {
            status: "error",
            message: "Password minimal 6 karakter.",
          },
          { status: 400 },
        );
      }

      // Memeriksa apakah NIP sudah digunakan.
      const { data: existingTeacher, error: duplicateError } =
        await ctx.supabaseAdmin
          .from("users")
          .select("id")
          .eq("nip", nip)
          .maybeSingle();

      if (duplicateError) {
        console.error("Gagal memeriksa NIP:", duplicateError);

        return Response.json(
          {
            status: "error",
            message: "Gagal memeriksa ketersediaan NIP.",
          },
          { status: 500 },
        );
      }

      if (existingTeacher) {
        return Response.json(
          {
            status: "error",
            message: "NIP sudah terdaftar.",
          },
          { status: 409 },
        );
      }

      // Mengubah NIP menjadi email internal untuk Supabase Auth.
      const email = `${nip}@silakom.id`;

      // Membuat akun Guru melalui Supabase Auth.
      const { data: authData, error: createError } =
        await ctx.supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            nama,
            nip,
          },
        });

      if (createError) {
        console.error("Gagal membuat akun Guru:", createError);

        return Response.json(
          {
            status: "error",
            message:
              createError.code === "email_exists"
                ? "NIP sudah terdaftar."
                : "Gagal membuat akun Guru. Silakan coba kembali.",
          },
          { status: 400 },
        );
      }

      // Profil Guru dibuat otomatis oleh trigger handle_new_user().
      return Response.json(
        {
          status: "success",
          message: "Akun Guru berhasil ditambahkan.",
          data: {
            id: authData.user.id,
            nama,
            nip,
          },
        },
        { status: 201 },
      );
    } catch (error) {
      console.error("Kesalahan pada fungsi tambah Guru:", error);

      return Response.json(
        {
          status: "error",
          message: "Terjadi kesalahan pada server.",
        },
        { status: 500 },
      );
    }
  }),
};