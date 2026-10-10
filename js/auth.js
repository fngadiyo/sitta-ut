const SittaAuth = (() => {
  const KUNCI = "sitta.pengguna";
  const memori = {};

  const backing = (() => {
    try {
      const uji = "__sitta_uji__";
      window.sessionStorage.setItem(uji, "1");
      window.sessionStorage.removeItem(uji);
      return window.sessionStorage;
    } catch (error) {
      return null;
    }
  })();

  function baca() {
    const mentah = backing ? backing.getItem(KUNCI) : memori[KUNCI];
    if (!mentah) return null;
    try {
      return JSON.parse(mentah);
    } catch (error) {
      return null;
    }
  }

  function tulis(pengguna) {
    const payload = JSON.stringify(pengguna);
    if (backing) backing.setItem(KUNCI, payload);
    else memori[KUNCI] = payload;
  }

  function hapus() {
    if (backing) backing.removeItem(KUNCI);
    delete memori[KUNCI];
  }

  function masuk(pengguna) {
    const sesi = {
      id: pengguna.id,
      nama: pengguna.nama,
      email: pengguna.email,
      role: pengguna.role,
      lokasi: pengguna.lokasi,
      masukPada: new Date().toLocaleString("id-ID")
    };
    tulis(sesi);
    return sesi;
  }

  function sekarang() {
    return baca();
  }

  function keluar() {
    hapus();
    window.location.href = "login.html";
  }

  function wajibMasuk() {
    const sesi = baca();
    if (!sesi) {
      window.location.replace("login.html");
      return null;
    }
    return sesi;
  }

  return { masuk, sekarang, keluar, wajibMasuk };
})();