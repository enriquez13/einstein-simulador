import { useEffect, useRef, useState } from "react";
import { PLAZOS, CREDITO_INTERCAMBIO, calcular, usd } from "./pricing.js";

// Número que "corre" suavemente hasta su nuevo valor
function useAnimatedNumber(target, duration = 600) {
  const [value, setValue] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = performance.now();
    const origin = from.current;
    let raf;

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = origin + (target - origin) * eased;

      from.current = v;
      setValue(v);

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

function Option({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`opt ${active ? "on" : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Logo() {
  return (
    <img
      src="/logo.png"
      alt="Einstein"
      className="logo-img"
    />
  );
}

export default function App() {
  const [temas, setTemas] = useState(2);
  const [meses, setMeses] = useState(24);
  const [intercambio, setIntercambio] = useState(true);

  const { total, cuota, ultima } = calcular({
    temas,
    meses,
    intercambio,
  });

  const totalAnim = useAnimatedNumber(total);
  const cuotaAnim = useAnimatedNumber(cuota);
  const hayAjuste = Math.abs(ultima - cuota) > 0.001;

  return (
    <main className="page">
      <section className="slide">

        <img
          src="/mapa-mundo.png"
          alt=""
          className="world-map"
        />

        <header className="brand">
          <Logo />

          <span className="brand-name">Einstein</span>

          <span className="brand-tag">
            Salud
            <br />
            sin fronteras
            <br />
            para un mundo
            <br />
            más saludable
          </span>
        </header>

        <h1>
          Diseñemos juntos
          <span>nuestra primera colaboración</span>
        </h1>

        <p className="sub">
          Exploremos sus prioridades, los tiempos y las posibilidades de intercambio.
        </p>

        <div className="grid">
          <div className="steps">
            <article className="card">
              <h2>
                <span className="ico">◎</span>
                <span>
                  1. Temas
                  <br />
                  priorizados
                </span>
              </h2>

              <div className="opts">
                {[1, 2, 3].map((n) => (
                  <Option
                    key={n}
                    active={temas === n}
                    onClick={() => setTemas(n)}
                  >
                    {n} {n === 1 ? "tema" : "temas"}
                  </Option>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>
                <span className="ico">▦</span>
                <span>
                  2. Tiempo
                  <br />
                  de ejecución
                </span>
              </h2>

              <div className="opts">
                {PLAZOS.map((m) => (
                  <Option
                    key={m}
                    active={meses === m}
                    onClick={() => setMeses(m)}
                  >
                    {m} meses
                  </Option>
                ))}
              </div>
            </article>

            <article className="card">
              <h2>
                <span className="ico">⇄</span>
                <span>
                  3. Intercambio
                  <br />
                  de una fortaleza
                </span>
              </h2>

              <div className="opts row">
                <Option
                  active={intercambio}
                  onClick={() => setIntercambio(true)}
                >
                  Sí
                </Option>

                <Option
                  active={!intercambio}
                  onClick={() => setIntercambio(false)}
                >
                  No
                </Option>
              </div>

              <p className={`credit ${intercambio ? "show" : ""}`}>
                Crédito por intercambio:
                <strong>
                  −US$ {CREDITO_INTERCAMBIO.toLocaleString("de-DE")}
                </strong>
              </p>
            </article>
          </div>

          <aside className="result" aria-live="polite">
            <h3>
              <span className="ico">▤</span>
              <span>
                Su inversión se actualiza
                <br />
                al instante
              </span>
            </h3>

            <div className="box">
              <label>Inversión total</label>
              <output>{usd(totalAnim)}</output>
            </div>

            <div className="box">
              <label>Cuota mensual</label>
              <output>{usd(cuotaAnim)}</output>

              <small>
                {meses} cuotas mensuales
                {hayAjuste && <> · la última es de {usd(ultima)}</>}
              </small>
            </div>
          </aside>
        </div>

        <footer>
          <span className="compass">⌖</span>

          <p>
            Seleccione sus prioridades. Explore alternativas. Defina su alcance.
          </p>

          <em>Plataforma de Internacionalización Einstein</em>
        </footer>
      </section>
    </main>
  );
}
