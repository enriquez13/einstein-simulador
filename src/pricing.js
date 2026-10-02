// ====== REGLAS DE PRECIOS (edítalas aquí) ======
export const PRECIOS = { 1: 39500, 2: 75000, 3: 110000 }; // US$ por paquete completo
export const PLAZOS = [18, 24, 30, 36];                    // meses
export const CREDITO_INTERCAMBIO = 10000;                  // se resta si hay intercambio
export const ADICIONAL_SIN_INTERCAMBIO = 10000;            // se suma si no hay intercambio

// Calcula total y cuotas (trabajando en centavos para que la suma sea exacta)
export function calcular({ temas, meses, intercambio }) {
  const total = PRECIOS[temas] + (intercambio ? -CREDITO_INTERCAMBIO : ADICIONAL_SIN_INTERCAMBIO);
  const totalCents = Math.round(total * 100);
  const cuotaCents = Math.floor(totalCents / meses);
  const ultimaCents = totalCents - cuotaCents * (meses - 1); // la última ajusta los centavos
  return { total, cuota: cuotaCents / 100, ultima: ultimaCents / 100 };
}

const fmt = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const usd = (n) => `US$ ${fmt.format(n)}`;
