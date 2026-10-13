// Botón "Ver como compu / Ver como celular".
// Fuerza el ancho de pantalla en vez de depender de girar el teléfono:
// con la rotación bloqueada (o en Safari) girar no siempre cambia la vista.
(function(){
  var ANCHO_COMPU = 1280, CLAVE = "vista";
  var meta = document.querySelector('meta[name="viewport"]');
  var param = new URLSearchParams(location.search).get(CLAVE);
  var modo = param;
  if (!modo) { try { modo = localStorage.getItem(CLAVE); } catch (e) {} }
  var compu = modo === "compu";
  if (compu && meta) meta.setAttribute("content", "width=" + ANCHO_COMPU);

  function cambiar(){
    var nuevo = compu ? "celu" : "compu";
    try { localStorage.setItem(CLAVE, nuevo); } catch (e) {}
    var u = new URL(location.href);
    u.searchParams.set(CLAVE, nuevo);
    location.replace(u.toString());
  }

  function boton(){
    var b = document.createElement("button");
    b.type = "button";
    b.className = "vista-btn";
    b.setAttribute("aria-label", compu ? "Ver como celular" : "Ver como computadora");
    b.innerHTML = compu
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg><span>Celu</span>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="13" rx="1"/><path d="M8 21h8M12 17v4"/></svg><span>Compu</span>';
    b.onclick = cambiar;
    var s = document.createElement("style");
    s.textContent =
      ".vista-btn{position:fixed;left:0;top:50%;z-index:9999;display:flex;flex-direction:column;align-items:center;gap:4px;" +
      "padding:10px 7px;border:0;border-radius:0 10px 10px 0;background:rgba(20,20,20,.82);color:#fff;" +
      "font:600 11px/1 system-ui,-apple-system,sans-serif;cursor:pointer;transform-origin:left center;" +
      "box-shadow:0 2px 10px rgba(0,0,0,.25);-webkit-tap-highlight-color:transparent}" +
      ".vista-btn:focus-visible{outline:2px solid #fff;outline-offset:2px}";
    document.head.appendChild(s);
    document.body.appendChild(b);

    // En vista compu la página se achica para entrar en la pantalla:
    // el botón se agranda en la misma proporción para seguir siendo tocable.
    function ajustar(){
      var z = window.visualViewport ? window.visualViewport.scale : 1;
      var f = z > 0 ? 1 / z : 1;
      b.style.transform = "translateY(-50%) scale(" + f + ")";
    }
    ajustar();
    if (window.visualViewport) {
      visualViewport.addEventListener("resize", ajustar);
      visualViewport.addEventListener("scroll", ajustar);
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boton);
  else boton();
})();
