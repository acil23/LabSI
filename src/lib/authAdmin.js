
// Kunci utama untuk data di localStorage
const KEY = 'isLabAdmin';

// Atur durasi sesi di sini (dalam milidetik)
// Contoh: 1 jam = 1 * 60 * 60 * 1000
const SESSION_DURATION_MS = 1 * 60 * 60 * 1000;

/**
 * Memeriksa apakah admin masih login dan sesinya belum kadaluarsa.
 */
export function isAdmin() {
  const sessionDataString = localStorage.getItem(KEY);
  if (!sessionDataString) {
    return false; // Tidak ada data sesi
  }

  try {
    const sessionData = JSON.parse(sessionDataString);
    const loginTime = sessionData.timestamp; // Waktu saat login
    const currentTime = new Date().getTime(); // Waktu saat ini

    // Cek selisih waktu
    if (currentTime - loginTime > SESSION_DURATION_MS) {
      // Sesi telah kadaluarsa!
      logoutAdmin(); // Hapus sesi yang kadaluarsa
      return false;
    }

    // Sesi masih valid
    return true;

  } catch (e) {
    // Jika data JSON rusak/tidak valid, hapus saja
    console.error("Gagal mem-parsing data sesi:", e);
    logoutAdmin();
    return false;
  }
}

/**
 * Mencoba login sebagai admin.
 */
export function loginAdmin(pass) {
  if (pass && pass === (process.env.ADMIN_PASS || '')) {
    // Buat objek data sesi yang berisi timestamp saat ini
    const sessionData = {
      timestamp: new Date().getTime()
    };
    
    // Simpan sebagai string JSON
    localStorage.setItem(KEY, JSON.stringify(sessionData));
    return true;
  }
  return false;
}

/**
 * Menghapus sesi admin dari localStorage.
 */
export function logoutAdmin() {
  localStorage.removeItem(KEY);
}
