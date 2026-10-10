(function () {
  var PARAM = "sidebar";
  var KUNCI = "sitta.sidebar";

  var ciut = null;
  try {
    var nilai = new URL(window.location.href).searchParams.get(PARAM);
    if (nilai !== null) ciut = nilai === "1";
  } catch (error) {
    ciut = null;
  }

  if (ciut === null) {
    try {
      var mentah = window.localStorage.getItem(KUNCI);
      if (mentah !== null) ciut = mentah === "1";
    } catch (error) {
      ciut = null;
    }
  }

  if (ciut) document.documentElement.classList.add("sidebar-collapsed");
})();