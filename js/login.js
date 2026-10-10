const form = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const submitButton = form.querySelector("button[type='submit']");

const PESAN_GAGAL = "email/password yang anda masukkan salah";

function cariPengguna(email, password) {
  const emailNormal = email.trim().toLowerCase();
  return dataPengguna.find(
    (pengguna) => pengguna.email.toLowerCase() === emailNormal && pengguna.password === password
  );
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  if (email === "" || password === "") {
    alert("Email dan password wajib diisi.");
    (email === "" ? emailInput : passwordInput).focus();
    return;
  }

  await SittaUI.prosesTombol(
    submitButton,
    async () => {
      const pengguna = cariPengguna(email, password);
      await SittaUI.jeda(220);

      if (!pengguna) {
        SittaUI.selesaiBar();
        alert(PESAN_GAGAL);
        passwordInput.value = "";
        passwordInput.focus();
        return;
      }

      SittaAuth.masuk(pengguna);
      alert(`Login berhasil. Selamat datang, ${pengguna.nama}.`);
      SittaUI.pindahKe("dashboard.html");
    },
    { pesan: "Memeriksa..." }
  );
});

function setupModal(modal) {
  const fields = () =>
    Array.from(modal.querySelectorAll("input, button, select, textarea")).filter(
      (el) => !el.classList.contains("modal-close")
    );

  const tutup = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
  };

  const buka = async () => {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    await SittaUI.denganLoading(async () => SittaUI.jeda(140), { minimum: 160 });
    const pertama = fields()[0];
    if (pertama) pertama.focus();
  };

  modal.querySelector(".modal-close").addEventListener("click", tutup);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) tutup();
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const daftar = fields();
    if (daftar.length === 0) return;
    const pertama = daftar[0];
    const terakhir = daftar[daftar.length - 1];
    if (event.shiftKey && document.activeElement === pertama) {
      event.preventDefault();
      terakhir.focus();
    } else if (!event.shiftKey && document.activeElement === terakhir) {
      event.preventDefault();
      pertama.focus();
    }
  });

  return { buka, tutup };
}

const modalTerdaftar = new Map();

document.querySelectorAll("[data-modal]").forEach((tombol) => {
  const modal = document.getElementById(tombol.dataset.modal);
  if (!modal) return;
  const kendali = setupModal(modal);
  modalTerdaftar.set(tombol.dataset.modal, kendali);
  tombol.addEventListener("click", () => kendali.buka());
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    modalTerdaftar.forEach((kendali) => kendali.tutup());
  }
});

document.querySelector("#forgotForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const tombol = event.target.querySelector("button[type='submit']");
  const email = document.querySelector("#resetEmail").value.trim();

  await SittaUI.prosesTombol(
    tombol,
    async () => {
      const dikenal = dataPengguna.some(
        (pengguna) => pengguna.email.toLowerCase() === email.toLowerCase()
      );

      alert(
        dikenal
          ? `Instruksi reset password untuk ${email} berhasil dikirim.`
          : "Email belum terdaftar. Silakan gunakan email yang tersedia pada data dummy."
      );

      if (dikenal) modalTerdaftar.get("forgotModal").tutup();
    },
    { pesan: "Mengirim..." }
  );
});

document.querySelector("#registerForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const tombol = event.target.querySelector("button[type='submit']");
  const nama = document.querySelector("#registerName").value.trim();
  const email = document.querySelector("#registerEmail").value.trim();

  if (nama === "") {
    alert("Nama wajib diisi.");
    return;
  }

  const sudahAda = dataPengguna.some(
    (pengguna) => pengguna.email.toLowerCase() === email.toLowerCase()
  );
  if (sudahAda) {
    alert("Email sudah terdaftar. Silakan langsung melakukan login.");
    return;
  }

  await SittaUI.prosesTombol(
    tombol,
    async () => {
      alert(
        `Pendaftaran ${nama} (${email}) dicatat sebagai simulasi. ` +
          "Karena tugas ini tanpa backend, akun baru tidak dapat digunakan untuk login."
      );
      modalTerdaftar.get("registerModal").tutup();
      document.querySelector("#registerForm").reset();
    },
    { pesan: "Mendaftarkan..." }
  );
});

const demo = document.querySelector("#demoAccounts");

if (demo) {
  demo.innerHTML = dataPengguna
    .map(
      (pengguna) =>
        `<li><button type="button" class="demo-fill" data-email="${pengguna.email}" data-password="${pengguna.password}">` +
        `${pengguna.email} / ${pengguna.password}</button> <span class="muted">${pengguna.role}</span></li>`
    )
    .join("");

  demo.addEventListener("click", async (event) => {
    const tombol = event.target.closest(".demo-fill");
    if (!tombol) return;
    emailInput.value = tombol.dataset.email;
    passwordInput.value = tombol.dataset.password;
    await SittaUI.denganLoading(async () => SittaUI.jeda(120), { minimum: 140 });
    emailInput.focus();
  });
}

if (SittaAuth.sekarang()) {
  const note = document.querySelector("#demoNote");
  note.append(
    document.createTextNode(`Anda sudah masuk sebagai ${SittaAuth.sekarang().nama}. `)
  );
  note.appendChild(
    Object.assign(document.createElement("a"), {
      href: "dashboard.html",
      textContent: "Lanjut ke dashboard"
    })
  );
}