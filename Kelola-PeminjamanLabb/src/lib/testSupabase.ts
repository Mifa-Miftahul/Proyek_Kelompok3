import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('=== TEST SUPABASE SILAKOM ===');

  console.log('1. Supabase Client:', supabase ? 'OK' : 'GAGAL');

  const { data, error } = await supabase
    .from('laboratorium')
    .select('id_lab, nama_lab')
    .limit(5);

  if (error) {
    console.log('2. Koneksi database: GAGAL');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    return;
  }

  console.log('2. Koneksi database: BERHASIL');
  console.log('3. Data laboratorium:', data);
  console.log('=== TEST SELESAI ===');
}
