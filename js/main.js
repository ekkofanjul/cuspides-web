import { animate, inView, stagger } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

// Curva cinematográfica, no "juguetona" — la misma para todo el sitio
const EASE = [0.22, 1, 0.36, 1];

if (!prefersReducedMotion) {
  /* ---------------------------------------------
     1) Headline del hero: reveal palabra por palabra
     --------------------------------------------- */
  document.querySelectorAll(".hero__line").forEach((line) => {
    const words = line.textContent.trim().split(" ");
    line.innerHTML = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(" ");
  });

  animate(
    ".hero__line .word",
    { opacity: [0, 1], y: ["100%", "0%"] },
    { duration: 0.8, delay: stagger(0.12, { startDelay: 0.2 }), easing: EASE }
  );

  /* ---------------------------------------------
     2) Resto del hero (nav, frase, CTA): fade + slide
        suave al cargar, no al hacer scroll (van en el
        primer viewport)
     --------------------------------------------- */
  animate(
    ".reveal",
    { opacity: [0, 1], y: [16, 0] },
    { duration: 0.7, delay: stagger(0.1, { startDelay: 0.9 }), easing: EASE }
  );

  /* ---------------------------------------------
     3) Para el resto del sitio (secciones futuras):
        reveal al entrar en viewport, una sola vez.
        Cualquier elemento con clase "reveal" fuera del
        hero usa este patrón automáticamente.
     --------------------------------------------- */
  inView(
    "section:not(#hero) .reveal",
    (element) => {
      animate(
        element,
        { opacity: [0, 1], y: [24, 0] },
        { duration: 0.7, easing: EASE }
      );
    },
    { margin: "-10% 0px -10% 0px" }
  );
} else {
  // Sin animación: mostramos todo directo
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.opacity = "1";
  });
}

/* ---------------------------------------------
   4) Acordeón del checklist ("ESTO NO ES UN PASEO"):
      al clickear un título, se abre y se pinta de color
      acento; si había otro abierto, se cierra solo.
   --------------------------------------------- */
document.querySelectorAll(".paseo__item-toggle").forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest(".paseo__item");
    const wasActive = item.classList.contains("is-active");

    // cierra cualquier otro ítem abierto
    document.querySelectorAll(".paseo__item.is-active").forEach((openItem) => {
      openItem.classList.remove("is-active");
      openItem.querySelector(".paseo__item-toggle").setAttribute("aria-expanded", "false");
    });

    // si el que clickeaste ya estaba abierto, lo dejamos cerrado (toggle);
    // si estaba cerrado, lo abrimos
    if (!wasActive) {
      item.classList.add("is-active");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

/* ---------------------------------------------
   5) Escalado del bloque desktop de "EL PROCESO":
      el bloque tiene un tamaño fijo en píxeles (el mismo que en Figma:
      1922px de ancho). Acá lo achicamos con transform:scale para que
      entre en pantallas más chicas, sin romper las proporciones.
   --------------------------------------------- */
const stepsScaler = document.getElementById("stepsDesktopScaler");
const stepsRotor = stepsScaler ? stepsScaler.querySelector(".steps-desktop__rotor") : null;
const STEPS_NATURAL_WIDTH = 1922.38;

function scaleStepsDesktop() {
  if (!stepsScaler || !stepsRotor) return;
  const scale = stepsScaler.getBoundingClientRect().width / STEPS_NATURAL_WIDTH;
  stepsRotor.style.setProperty("--scale", scale);
}

if (stepsScaler) {
  scaleStepsDesktop();
  window.addEventListener("resize", scaleStepsDesktop);
}
