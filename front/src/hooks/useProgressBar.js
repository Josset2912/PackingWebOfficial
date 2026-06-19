import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configuración de NProgress
NProgress.configure({
  showSpinner: false, // Oculta el spinner circular
  speed: 400,
  minimum: 0.08,
  trickleSpeed: 200,
  easing: "ease",
  trickle: true,
});

// Exportar funciones para controlar la barra de progreso
export const startProgress = () => {
  NProgress.start();
};

export const incrementProgress = (amount) => {
  NProgress.inc(amount);
};

export const completeProgress = () => {
  NProgress.done();
};

export const setProgress = (n) => {
  NProgress.set(n);
};
