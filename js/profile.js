const SittaProfile = (() => {
  function inisial(nama) {
    return (nama || "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((kata) => kata.charAt(0))
      .join("");
  }

  function barisDetail(label, nilai) {
    const baris = document.createElement("div");
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = nilai;
    baris.append(dt, dd);
    return baris;
  }

  function pasang(sesi) {
    const tombol = document.querySelector("#profileTrigger");
    const menu = document.querySelector("#profileMenu");
    if (!tombol || !menu || !sesi) return;

    const inisialTeks = inisial(sesi.nama);

    const avatar = document.createElement("span");
    avatar.className = "profile-avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = inisialTeks;

    const label = document.createElement("span");
    label.className = "profile-trigger-text";

    const nama = document.createElement("strong");
    nama.textContent = sesi.nama;

    const peran = document.createElement("small");
    peran.textContent = sesi.role;

    label.append(nama, peran);
    tombol.replaceChildren(avatar, label);
    tombol.setAttribute("aria-label", `Buka menu profil ${sesi.nama}`);

    const ringkasan = document.createElement("div");
    ringkasan.className = "profile-summary";

    const avatarBesar = document.createElement("span");
    avatarBesar.className = "profile-avatar profile-avatar-large";
    avatarBesar.setAttribute("aria-hidden", "true");
    avatarBesar.textContent = inisialTeks;

    const identitas = document.createElement("div");
    const namaBesar = document.createElement("strong");
    namaBesar.textContent = sesi.nama;
    const lokasi = document.createElement("p");
    lokasi.className = "muted";
    lokasi.textContent = `${sesi.role} - ${sesi.lokasi}`;
    identitas.append(namaBesar, lokasi);
    ringkasan.append(avatarBesar, identitas);

    const detail = document.createElement("dl");
    detail.className = "profile-details";
    detail.append(
      barisDetail("Email", sesi.email),
      barisDetail("Lokasi", sesi.lokasi),
      barisDetail("Masuk sejak", sesi.masukPada)
    );

    const keluar = menu.querySelector(".logout");
    keluar.addEventListener("click", () => SittaAuth.keluar());

    menu.querySelector(".profile-summary").replaceWith(ringkasan);
    menu.querySelector(".profile-details").replaceWith(detail);

    const tutup = () => {
      menu.hidden = true;
      tombol.setAttribute("aria-expanded", "false");
    };

    const buka = async () => {
      menu.hidden = false;
      tombol.setAttribute("aria-expanded", "true");
      await SittaUI.denganLoading(async () => SittaUI.jeda(120), { minimum: 140 });
      keluar.focus();
    };

    tombol.addEventListener("click", async (event) => {
      event.stopPropagation();
      if (menu.hidden) {
        await buka();
      } else {
        tutup();
      }
    });

    document.addEventListener("click", (event) => {
      if (menu.hidden) return;
      if (!menu.contains(event.target) && !tombol.contains(event.target)) tutup();
    });

    menu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        tutup();
        tombol.focus();
      }
    });
  }

  return { pasang, inisial };
})();