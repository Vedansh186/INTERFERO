
import { useEffect, useMemo, useRef, useState } from 'react'
import './index.css'

import {
  baseline,
  type Parameters,
  type SlitMode,
  fringeWidth,
  intensityAt,
  measurementAt,
  wavelengthColor
} from './physics'

const mm = (x: number, d = 2) => `${(x * 1e3).toFixed(d)} mm`
const deg = (x: number) => `${(x * 180 / Math.PI).toFixed(3)}°`

type Observation = {
  n: number
  y: number
}

const presets: {
  name: string
  description: string
  values: Partial<Parameters>
}[] = [
  { name: 'Green baseline', description: 'Clear 2.75 mm fringes.', values: {} },
  { name: 'Blue light', description: 'Shorter wavelength pulls fringes closer.', values: { wavelength: 450e-9 } },
  { name: 'Red light', description: 'Longer wavelength spreads fringes out.', values: { wavelength: 650e-9 } },
  { name: 'Wide separation', description: 'More widely spaced slits make narrow fringes.', values: { separation: 0.55e-3 } },
  { name: 'Long path', description: 'A distant screen magnifies spacing.', values: { distance: 2.5 } },
  { name: 'Diffraction envelope', description: 'Wide slits limit outer fringes.', values: { width: 0.14e-3 } }
]

function Range({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (n: number) => void
}) {
  return (
    <label className="range">
      <span>
        {label}
        <output>
          {value.toFixed(unit === 'nm' ? 0 : 2)} {unit}
        </output>
      </span>
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
      />
    </label>
  )
}

function Graph({
  p,
  selected,
  envelope
}: {
  p: Parameters
  selected: number
  envelope: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return

    const x = c.getContext('2d')
    if (!x) return

    const r = c.getBoundingClientRect()
    const d = window.devicePixelRatio || 1
    const w = r.width
    const h = r.height
    const E = 0.016

    c.width = w * d
    c.height = h * d
    x.setTransform(d, 0, 0, d, 0, 0)

    x.fillStyle = '#100b12'
    x.fillRect(0, 0, w, h)

    x.strokeStyle = '#493344'
    x.beginPath()
    x.moveTo(0, h - 25)
    x.lineTo(w, h - 25)
    x.stroke()

    const curve = (
      f: (y: number) => number,
      col: string,
      dash: boolean
    ) => {
      x.beginPath()

      for (let q = 0; q < w; q++) {
        const v = f(E * (q / w * 2 - 1))
        const py = h - 30 - v * (h - 44)

        q ? x.lineTo(q, py) : x.moveTo(q, py)
      }

      x.strokeStyle = col
      x.lineWidth = 2
      x.setLineDash(dash ? [5, 4] : [])
      x.stroke()
      x.setLineDash([])
    }

    curve(
      y => intensityAt(y, p),
      wavelengthColor(p.wavelength * 1e9),
      false
    )

    if (envelope) {
      curve(
        y => intensityAt(y, { ...p, mode: 'upper' }),
        '#d99ab9',
        true
      )
    }

    const q = (selected / E + 1) * w / 2

    x.strokeStyle = '#fff'
    x.globalAlpha = 0.65
    x.beginPath()
    x.moveTo(q, 0)
    x.lineTo(q, h - 25)
    x.stroke()
    x.globalAlpha = 1

    x.fillStyle = '#c1a9ba'
    x.font = '11px system-ui'
    x.fillText('−16 mm', 5, h - 7)
    x.fillText('0', w / 2 - 3, h - 7)
    x.fillText('+16 mm', w - 42, h - 7)
  }, [p, selected, envelope])

  return <canvas ref={ref} className="graph" />
}

function Experiment({
  p,
  selected,
  setSelected,
  paused,
  waves
}: {
  p: Parameters
  selected: number
  setSelected: (n: number) => void
  paused: boolean
  waves: boolean
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  const clock = useRef(0)

  useEffect(() => {
    let id = 0

    const draw = (t: number) => {
      if (!paused) clock.current = t

      const c = ref.current
      if (!c) return

      const x = c.getContext('2d')
      if (!x) return

      const r = c.getBoundingClientRect()
      const d = window.devicePixelRatio || 1
      const w = r.width
      const h = r.height
      const cy = h / 2
      const bx = w * 0.30
      const sx = w * 0.78
      const E = 0.016

      c.width = Math.round(w * d)
      c.height = Math.round(h * d)
      x.setTransform(d, 0, 0, d, 0, 0)

      x.fillStyle = '#100b12'
      x.fillRect(0, 0, w, h)

      x.strokeStyle = '#65475e'
      x.lineWidth = 2
      x.beginPath()
      x.moveTo(bx, 18)
      x.lineTo(bx, h - 18)
      x.stroke()

      const gap = Math.min(50, p.separation / 0.0006 * 32)

      const ss = p.mode === 'both'
        ? [-gap, gap]
        : [p.mode === 'upper' ? -gap : gap]

      const color = wavelengthColor(p.wavelength * 1e9)

      x.fillStyle = color
      x.beginPath()
      x.arc(45, cy, 8, 0, Math.PI * 2)
      x.fill()

      x.strokeStyle = color
      x.globalAlpha = 0.28
      x.lineWidth = 1

      if (waves) {
        ss.forEach(s => {
          for (let R = 14; R < 190; R += 20) {
            x.beginPath()
            x.arc(
              bx,
              cy + s,
              R + (clock.current / 28 % 20),
              -Math.PI / 2,
              Math.PI / 2
            )
            x.stroke()
          }
        })
      }

      x.globalAlpha = 1
      x.strokeStyle = '#f4c6d9'
      x.lineWidth = 7

      ss.forEach(s => {
        x.beginPath()
        x.moveTo(bx, cy + s - 4)
        x.lineTo(bx, cy + s + 4)
        x.stroke()
      })

      x.fillStyle = '#211724'
      x.fillRect(sx - 4, 14, 16, h - 28)

      for (let py = 16; py < h - 16; py++) {
        const y = (py - cy) / (h * 0.5) * E

        x.globalAlpha = Math.min(
          1,
          intensityAt(y, p) * 1.25
        )

        x.fillStyle = color
        x.fillRect(sx, py, 8, 1)
      }

      x.globalAlpha = 1

      const sy = cy + selected / E * (h * 0.5)

      x.strokeStyle = '#ffffff'
      x.lineWidth = 1
      x.beginPath()
      x.moveTo(sx - 14, sy)
      x.lineTo(sx + 17, sy)
      x.stroke()

      x.fillStyle = '#c1afbf'
      x.font = '11px system-ui'

      x.fillText('SOURCE', 17, cy - 17)
      x.fillText('SLITS', bx - 18, 16)
      x.fillText('SCREEN', sx - 16, 13)
      x.fillText('−16 mm', sx + 20, 25)
      x.fillText('+16 mm', sx + 20, h - 18)

      id = requestAnimationFrame(draw)
    }

    id = requestAnimationFrame(draw)

    return () => cancelAnimationFrame(id)
  }, [p, paused, waves, selected])

  const pick = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect()

    const detectorTop = 16
    const detectorBottom = r.height - 16

    const fraction = Math.max(
      0,
      Math.min(
        1,
        (e.clientY - r.top - detectorTop) /
        (detectorBottom - detectorTop)
      )
    )

    setSelected((fraction - 0.5) * 0.032)
  }

  return (
    <canvas
      className="experiment"
      ref={ref}
      onPointerDown={e => {
        e.currentTarget.setPointerCapture(e.pointerId)
        pick(e)
      }}
      onPointerMove={e => {
        if (e.buttons === 1) pick(e)
      }}
      onPointerUp={e => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId)
        }
      }}
    />
  )
}

export default function App() {
  const [p, setP] = useState<Parameters>(baseline)
  const [selected, setSelected] = useState(0)
  const [paused, setPaused] = useState(false)
  const [waves, setWaves] = useState(true)
  const [envelope, setEnvelope] = useState(true)
  const [obs, setObs] = useState<Observation[]>([])
  const [activePreset, setActivePreset] = useState<number | null>(0)

  const m = useMemo(
    () => measurementAt(selected, p),
    [selected, p]
  )

  const beta = fringeWidth(p)

  const update = (v: Partial<Parameters>) => {
    setP(x => ({ ...x, ...v }))
    setActivePreset(null)
  }

  const applyPreset = (index: number) => {
    setP({
      ...baseline,
      ...presets[index].values
    })
    setSelected(0)
    setActivePreset(index)
  }

  const reset = () => {
    setP(baseline)
    setSelected(0)
    setActivePreset(0)
    setPaused(false)
    setWaves(true)
    setEnvelope(true)
  }

  const exportCSV = () => {
    const content =
      'Order,Position mm,Theory mm\n' +
      obs.map(o =>
        `${o.n},${o.y * 1e3},${o.n * beta * 1e3}`
      ).join('\n')

    const a = document.createElement('a')
    a.href = URL.createObjectURL(
      new Blob([content], { type: 'text/csv' })
    )
    a.download = 'interfero-observations.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <main>
      <nav>
        <a className="brand" href="#home">
          INTERFERO <i>•</i>
        </a>

        <span>WAVE OPTICS LABORATORY</span>

        <div>
          <a href="#laboratory">Laboratory</a>
          <a href="#theory">Theory</a>
          <a href="#observations">Observations</a>
          <a href="#credits">Credits</a>
        </div>
      </nav>

      <section id="home" className="hero">
        <div>
          <p className="eyebrow">PHYSICS / OPTICS / YDSE</p>

          <h1>
            See light
            <br />
            <em>interfere.</em>
          </h1>

          <p className="lede">
            An interactive instrument for exploring Young's
            double-slit experiment—from coherent wavefronts
            to measured intensity.
          </p>

          <a className="button" href="#laboratory">
            Launch laboratory <b>↓</b>
          </a>
        </div>

        <div className="hero-orbits">
          <span />
          <span />
          <span />
          <span />
          <div>λ</div>
        </div>
      </section>

      <section id="laboratory" className="lab">
        <header>
          <div>
            <p className="eyebrow">LIVE INSTRUMENT</p>
            <h2>Double-slit apparatus</h2>
          </div>

          <div className="status">
            <i style={{
              background: wavelengthColor(p.wavelength * 1e9)
            }} />
            LASER {paused ? 'PAUSED' : 'ACTIVE'}
          </div>
        </header>

        <div className="lab-grid">
          <aside className="controls">
            <h3>Experimental controls</h3>

            <Range
              label="Wavelength λ"
              value={p.wavelength * 1e9}
              min={400}
              max={700}
              step={1}
              unit="nm"
              onChange={n => update({ wavelength: n * 1e-9 })}
            />

            <Range
              label="Slit separation d"
              value={p.separation * 1e3}
              min={0.12}
              max={0.8}
              step={0.01}
              unit="mm"
              onChange={n => update({
                separation: Math.max(
                  n * 1e-3,
                  p.width + 0.01e-3
                )
              })}
            />

            <Range
              label="Slit width a"
              value={p.width * 1e3}
              min={0.01}
              max={Math.max(0.02, p.separation * 1e3 - 0.01)}
              step={0.005}
              unit="mm"
              onChange={n => update({ width: n * 1e-3 })}
            />

            <Range
              label="Screen distance D"
              value={p.distance}
              min={0.5}
              max={3}
              step={0.05}
              unit="m"
              onChange={n => update({ distance: n })}
            />

            <div className="mode">
              <span>Open apertures</span>

              {(['both', 'upper', 'lower'] as SlitMode[]).map(q => (
                <button
                  className={p.mode === q ? 'active' : ''}
                  onClick={() => update({ mode: q })}
                  key={q}
                >
                  {q === 'both'
                    ? 'Both'
                    : q[0].toUpperCase() + q.slice(1)}
                </button>
              ))}
            </div>

            <div className="toggles">
              <label>
                <input
                  type="checkbox"
                  checked={waves}
                  onChange={e => setWaves(e.target.checked)}
                />
                Wavefronts
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={envelope}
                  onChange={e => setEnvelope(e.target.checked)}
                />
                Envelope
              </label>
            </div>

            <div className="control-row">
              <button onClick={() => setPaused(!paused)}>
                {paused ? 'Play' : 'Pause'}
              </button>

              <button onClick={reset}>Reset</button>
            </div>
          </aside>

          <div className="visual">
            <Experiment
              p={p}
              selected={selected}
              setSelected={setSelected}
              paused={paused}
              waves={waves}
            />

            <p className="hint">
              Drag across the detection screen to inspect a position
            </p>

            <div className="readout">
              <span>
                FRINGE WIDTH <b>{mm(beta)}</b>
              </span>
              <span>
                MODE <b>{p.mode === 'both' ? 'DOUBLE SLIT' : 'SINGLE SLIT'}</b>
              </span>
              <span>
                WINDOW <b>±16.00 mm</b>
              </span>
            </div>
          </div>
        </div>

        <div className="analysis">
          <article>
            <div className="card-head">
              <div>
                <p className="eyebrow">DETECTION PROFILE</p>
                <h3>Normalized intensity</h3>
              </div>
              <span>I / I₀</span>
            </div>

            <Graph
              p={p}
              selected={selected}
              envelope={envelope}
            />

            <p className="caption">
              <i /> intensity
              {envelope && (
                <>
                  <i className="dash" /> diffraction envelope
                </>
              )}
            </p>
          </article>

          <article className="measurement">
            <p className="eyebrow">MEASUREMENT CURSOR</p>

            <h3>
              {mm(selected, 3)}
              <span>screen position</span>
            </h3>

            <dl>
              <div>
                <dt>Angle θ</dt>
                <dd>{deg(m.theta)}</dd>
              </div>

              <div>
                <dt>Path difference Δ</dt>
                <dd>{m.path.toExponential(3)} m</dd>
              </div>

              <div>
                <dt>Phase φ</dt>
                <dd>{m.phase.toFixed(3)} rad</dd>
              </div>

              <div>
                <dt>Phase</dt>
                <dd>{deg(m.phase)}</dd>
              </div>

              <div>
                <dt>Intensity</dt>
                <dd>{m.intensity.toFixed(3)} I₀</dd>
              </div>

              <div>
                <dt>Classification</dt>
                <dd className={m.classification}>
                  {m.classification}
                </dd>
              </div>
            </dl>

            <button
              className="record"
              onClick={() => setObs(x => [
                ...x,
                { n: Math.round(m.order), y: selected }
              ])}
            >
              + Record measurement
            </button>
          </article>
        </div>
      </section>

      <section className="presets">
        <p className="eyebrow">EXPERIMENT SEQUENCES</p>
        <h2>Start with a question.</h2>

        <div>
          {presets.map((preset, index) => (
            <button
              key={preset.name}
              className={activePreset === index ? 'preset-active' : ''}
              aria-pressed={activePreset === index}
              onClick={() => applyPreset(index)}
            >
              <b>{preset.name}</b>
              <span>{preset.description}</span>
              <i>↗</i>
            </button>
          ))}
        </div>
      </section>

      <section id="observations" className="observations">
        <div>
          <p className="eyebrow">VIRTUAL NOTEBOOK</p>
          <h2>Observations</h2>

          <p>
            Record a cursor position to compare your measurement
            against the small-angle prediction. The detector uses
            exact screen geometry and the Fraunhofer intensity model.
          </p>
        </div>

        <div className="table-card">
          {obs.length ? (
            <table>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Measured y</th>
                  <th>Theory yₙ</th>
                </tr>
              </thead>

              <tbody>
                {obs.map((o, i) => (
                  <tr key={i}>
                    <td>{o.n}</td>
                    <td>{mm(o.y, 3)}</td>
                    <td>{mm(o.n * beta, 3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="empty">No measurements recorded yet.</p>
          )}

          <button
            onClick={exportCSV}
            disabled={!obs.length}
          >
            Export CSV
          </button>
        </div>
      </section>

      <section id="theory" className="theory">
        <p className="eyebrow">PHYSICS NOTES</p>
        <h2>From path difference to pattern.</h2>

        <div className="theory-grid">
          <article>
            <b>01 / COHERENCE</b>
            <p>
              Two narrow slits illuminated by one source act
              as coherent emitters. Their phase relation stays fixed.
            </p>
          </article>

          <article>
            <b>02 / SUPERPOSITION</b>
            <p>
              At a screen point, waves add. In phase gives a bright
              fringe; a π phase difference gives a dark fringe.
            </p>
          </article>

          <article>
            <b>03 / FRAUNHOFER MODEL</b>
            <p>
              The graph uses I/I₀ = (sin α / α)² cos² δ,
              with α = πa sinθ/λ and δ = πd sinθ/λ.
            </p>
          </article>
        </div>

        <div className="equation">
          <span>small-angle fringe width</span>
          <strong>β = λD / d</strong>
          <p>
            For the baseline: 550 nm × 1.5 m / 0.30 mm =
            <b> 2.75 mm</b>. Fringe positions are approximate
            in this expression; the detector uses θ = arctan(y/D).
          </p>
        </div>
      </section>

      {/* PROJECT CREDITS */}

      <section id="credits" className="credits">
        <div className="credits-inner">

          <div className="credits-intro">
            <p className="eyebrow">PROJECT INFORMATION</p>

            <h2>
              Where physics meets
              <em> technology.</em>
            </h2>

            <p>
              INTERFERO is an interactive educational laboratory
              developed to bring Young's double-slit experiment
              to life through real-time visualization, mathematical
              modelling and interactive experimentation.

              Explore wavefronts, observe interference patterns,
              investigate diffraction and understand the physics
              behind the phenomenon.
            </p>
          </div>

          <div className="credits-details">

            <div className="credit-block">
              <span>PROJECT CREATOR</span>
              <strong>Vedansh Sharma</strong>
              <small>Mathematics and Computing</small>
            </div>

            <div className="credit-block">
              <span>INSTITUTION</span>
              <strong>Jaypee Institute of Information Technology</strong>
              <small>Noida, Uttar Pradesh, India</small>
            </div>

            <div className="credit-block">
              <span>PROJECT CATEGORY</span>
              <strong>Physics PBL</strong>
              <small>Wave Optics · Young's Double-Slit Experiment</small>
            </div>

            <div className="credit-block">
              <span>PROJECT</span>
              <strong>INTERFERO</strong>
              <small>Interactive Wave Optics Laboratory</small>
            </div>

          </div>

          <div className="credits-connect">
            <p className="eyebrow">CONNECT & EXPLORE</p>

            <h3>
              Find me beyond
              <em> INTERFERO.</em>
            </h3>

            <p>
              Explore my work, projects and professional journey.
            </p>

            <div className="social-links">

              <a
                href="https://www.linkedin.com/in/vedanshsharma11/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>LINKEDIN</span>
                <strong>Professional profile ↗</strong>
              </a>

              <a
                href="https://github.com/Vedansh186"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>GITHUB</span>
                <strong>Projects & repositories ↗</strong>
              </a>

            </div>
          </div>

          <div className="credits-tech">
            <span>BUILT WITH</span>

            <div>
              {['React', 'TypeScript', 'Vite', 'HTML & CSS', 'Canvas API'].map(item => (
                <small key={item}>{item}</small>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section className="report">
        <div>
          <p className="eyebrow">PBL HANDOFF</p>
          <h2>Make a lab record.</h2>

          <p>
            Use the browser print dialog to save a formatted
            report with your live apparatus settings and observations.
          </p>
        </div>

        <button
          className="button"
          onClick={() => window.print()}
        >
          Print / save PDF
        </button>
      </section>

      <footer>
        <b>INTERFERO</b>
        <span>
          Interactive Wave Optics Laboratory ·  Physics PBL
        </span>
        <span>
          <a href="#credits">Project Credits</a>
          {' · '}
          <a href="https://github.com/Vedansh186" target="_blank" rel="noreferrer">
            GitHub
          </a>
          {' · '}
          <a href="https://www.linkedin.com/in/vedanshsharma11/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </span>
      </footer>

      <style>{`
        .credits {
          padding: 110px 10%;
          border-top: 1px solid #493344;
          background: radial-gradient(
            ellipse at 80% 10%,
            #302033 0%,
            #17111b 55%,
            #100b12 100%
          );
        }

        .credits-inner {
          max-width: 1100px;
          margin: auto;
        }

        .credits-intro {
          max-width: 720px;
          margin-bottom: 65px;
        }

        .credits-intro h2 {
          font-size: clamp(38px, 5vw, 62px);
          line-height: 1.05;
          margin: 0 0 25px;
        }

        .credits-intro h2 em,
        .credits-connect h3 em {
          font-family: 'Instrument Serif', serif;
          color: #e9a1c0;
          font-weight: 400;
        }

        .credits-intro > p:last-child {
          max-width: 620px;
          font-size: 14px;
          line-height: 1.9;
          color: #bcaaba;
        }

        .credits-details {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0 50px;
          border-top: 1px solid #65475e;
        }

        .credit-block {
          padding: 27px 0;
          border-bottom: 1px solid #493344;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .credit-block span,
        .credits-tech > span,
        .social-links span {
          font: 10px 'DM Mono', monospace;
          letter-spacing: .13em;
          color: #e9a1c0;
        }

        .credit-block strong {
          font-size: 17px;
          color: #f5eaf2;
          line-height: 1.5;
        }

        .credit-block small {
          color: #bcaaba;
          font-size: 12px;
        }

        .credits-connect {
          margin-top: 90px;
          padding-top: 45px;
          border-top: 1px solid #493344;
        }

        .credits-connect h3 {
          font-size: clamp(32px, 4vw, 48px);
          letter-spacing: -.055em;
          margin: 15px 0;
        }

        .credits-connect > p:not(.eyebrow) {
          font-size: 13px;
          color: #bcaaba;
          line-height: 1.8;
        }

        .social-links {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 35px;
        }

        .social-links a {
          display: flex;
          flex-direction: column;
          gap: 13px;
          padding: 25px;
          text-decoration: none;
          background: #1b1420;
          border: 1px solid #493344;
          transition: all .25s ease;
        }

        .social-links a:hover {
          background: #302033;
          border-color: #d58aaa;
          transform: translateY(-3px);
          box-shadow: 0 10px 30px #e9a1c022;
        }

        .social-links strong {
          color: #f5eaf2;
          font-size: 15px;
        }

        .credits-tech {
          margin-top: 75px;
          padding-top: 28px;
          border-top: 1px solid #493344;
        }

        .credits-tech > div {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 20px;
        }

        .credits-tech small {
          padding: 10px 15px;
          border: 1px solid #65475e;
          background: #1b1420;
          color: #e9a1c0;
          font: 11px 'DM Mono', monospace;
        }

        .presets button.preset-active {
          border-color: #d58aaa;
          background: #281b29;
          box-shadow: inset 0 0 0 1px #d58aaa44;
        }

        footer a {
          color: #e9a1c0;
          text-decoration: none;
        }

        footer a:hover {
          text-decoration: underline;
        }

        @media (max-width: 780px) {
          .credits {
            padding: 70px 7%;
          }

          .credits-details,
          .social-links {
            grid-template-columns: 1fr;
          }

          .credits-intro {
            margin-bottom: 40px;
          }

          .credits-connect {
            margin-top: 60px;
          }
        }
      `}</style>
    </main>
  )
}
