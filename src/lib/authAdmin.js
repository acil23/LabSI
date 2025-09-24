const KEY = 'isLabAdmin';

export function isAdmin() {
  return localStorage.getItem(KEY) === '1';
}

export function loginAdmin(pass) {
  if (pass && pass === (process.env.ADMIN_PASS || '')) {
    localStorage.setItem(KEY, '1');
    return true;
  }
  return false;
}

export function logoutAdmin() {
  localStorage.removeItem(KEY);
}
