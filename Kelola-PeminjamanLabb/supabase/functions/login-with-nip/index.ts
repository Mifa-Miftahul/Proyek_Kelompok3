import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

export default {
  fetch: withSupabase({ auth: "none" }, async (req, ctx) => {
    try {
      if (req.method !== "POST") {
        return Response.json(
          {
            status: "error",
            message: "Metode permintaan tidak diizinkan.",
          },
          { status: 405 },
        );
      }

      let body: {
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

      const nip = body.nip?.trim() ?? "";
      const password = body.password ?? "";

      if (!/^\d{8,18}$/.test(nip)) {
        return Response.json(
          {
            status: "error",
            message: "NIP harus berupa angka, 8 sampai 18 digit.",
          },
          { status: 400 },
        );
      }

      if (!password || password.length > 128) {
        return Response.json(
          {
            status: "error",
            message: "NIP atau password salah.",
          },
          { status: 401 },
        );
      }

      // Mencari email berdasarkan NIP melalui akses admin.
      const { data: profile, error: profileError } =
        await ctx.supabaseAdmin
          .from("users")
          .select("email")
          .eq("nip", nip)
          .eq("is_active", true)
          .maybeSingle();

      if (profileError) {
        console.error("Gagal mencari profil berdasarkan NIP.");

        return Response.json(
          {
            status: "error",
            message: "Terjadi kesalahan pada server.",
          },
          { status: 500 },
        );
      }

      if (!profile?.email) {
        return Response.json(
          {
            status: "error",
            message: "NIP atau password salah.",
          },
          { status: 401 },
        );
      }

      // Memverifikasi password menggunakan Supabase Auth.
      const { data: authData, error: authError } =
        await ctx.supabase.auth.signInWithPassword({
          email: profile.email,
          password,
        });

      if (authError || !authData.session || !authData.user) {
        return Response.json(
          {
            status: "error",
            message: "NIP atau password salah.",
          },
          { status: 401 },
        );
      }

      // Memastikan identitas Auth sesuai dengan profil yang ditemukan.
      const { data: verifiedProfile, error: verifiedError } =
        await ctx.supabaseAdmin
          .from("users")
          .select("id, nama, nip, role, is_active")
          .eq("id", authData.user.id)
          .maybeSingle();

      if (
        verifiedError ||
        !verifiedProfile ||
        verifiedProfile.nip !== nip ||
        (verifiedProfile.role !== "laboran" &&
          verifiedProfile.role !== "guru") ||
        verifiedProfile.is_active !== true
      ) {
        return Response.json(
          {
            status: "error",
            message: "Akun tidak memiliki akses ke aplikasi.",
          },
          { status: 403 },
        );
      }

      return Response.json({
        status: "success",
        message: "Login berhasil.",
        data: {
          access_token: authData.session.access_token,
          refresh_token: authData.session.refresh_token,
          user: {
            id: verifiedProfile.id,
            nama: verifiedProfile.nama,
            nip: verifiedProfile.nip,
            role: verifiedProfile.role,
          },
        },
      });
    } catch (error) {
      console.error("Kesalahan pada fungsi login NIP:", error);

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
