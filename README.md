# LunarLeaper — Navigation × Science Assessment

First-order **model-based systems engineering** tool for LunarLeaper positioning and geodesy.
It answers the questions in *Project: Navigation Reference Frame for LunarLeaper* by crossing:

1. **Navigation / geodetic ConOps** (what knowledge the walking quadruped can achieve)
2. **Payload survey ConOps** (how instruments acquire data within one lunar day)

…and propagating both into **science detectability, coverage, and ranked error budgets**.

Live (GitHub Pages): repository root → [`index.html`](index.html).

Legacy 3D gravimetry toy: [`error-explorer.html`](error-explorer.html).

## What this is / is not

| Is | Is not |
|---|---|
| Evidence-graded first-order approximation | Flight navigation filter / SLAM |
| Local vs map vs cartographic vs inertial layers | Single “position accuracy” scalar |
| Science-down + navigation-up trades | Full geophysical inversion |
| Explicit TBDs and negative source assessments | Invented requirements laundered as facts |

## Architecture

```
src/mission-model.mjs   declarative MBSE: frames, ConOps, sources, assumptions, presets
src/assessment.mjs      pure deterministic engines (nav, gravity, GPR, spectrometer)
src/app.mjs             decision UI
styles.css              layout
tests/assessment.test.mjs
```

No build step. ES modules in the browser and Node.

## Knowledge layers (do not collapse)

1. **Local / relative** — autonomy, station spacing, GPR migration, footprint co-registration  
2. **Map-relative** — trajectory-to-DEM / NAC co-registration (drives terrain corrections)  
3. **Cartographic absolute (mean Earth, ME)** — archive / interoperability  
4. **Inertial / ephemeris (principal axes, PA, ICRF)** — tides, celestial azimuth  

Over a few-hundred-metre traverse, GRAIL-scale lunar potential is a smooth ramp. Differentiating a cave signal is usually limited by **map-relative DEM registration and radial knowledge**, not metre-class ME absolute.

Height convention: canonical **center-of-mass radius**; geometric `h = r − 1,737,400 m`. Do not mix with potential-referenced heights.

Default cartographic realization: **DE440 dynamics with DE421-aligned ME**. The mean Earth (ME) to principal axes (PA) transform is applied (about 875 m). That size is not an error. That size is not a bias. The residual uncertainty is TBD. The uncertainty is common to all points. A frame mistag is a fault of about 875 m. A mistag means a principal axes product is used as mean Earth, or the transform is skipped. The fault stays out of every 1-sigma.

## Platform model (quadruped)

- Continuous **walking** contact-aided visual-inertial estimation (not wheel odometry, not hopping).
- **Stance-correlated** slip / sinkage / settlement are first-class; lunar performance is **TBD**.
- Terrestrial 1–2% drift is an evidence-graded **prior for sweeps only**.
- Active mitigations are executable parameters: body leveling, locked gravity stance, fixed belly height, base reoccupation.
- Gravity is **stop-and-go** (gait accelerations ≫ µGal). Settle + integration time trade against 14-day coverage.
- Individual footprints are **not** a NAC geodetic source at 0.5–1 m/px (explicit negative assessment).

## Instruments

### Gravimeter
- Infinite/finite cylinder lava-tube forward model → peak signal and SNR.
- Reduction awareness: free-air (~187 µGal/m) vs simple Bouguer residual (~103 µGal/m at 2000 kg/m³).
- Budget terms: instrument, drift after network adjustment, elevation, horizontal×gradient, tilt (level + knowledge + creep), DEM/terrain, tide residual, weak GRAIL ramp.
- Survey design: spacing, settle, integration, reoccupation cadence, walk-back cost.

### GPR
- Continuous walking acquisition; 2D vs 3D sampling.
- At 500 MHz, εr≈3–4 → λ≈0.30–0.35 m; along-track / elevation needs scale with λ.
- Gait-phase antenna height and coherent vibration; fixed-belly-height mitigation.

### Spectrometer (parametric / aspirational)
- Footprint vs geolocation: `σ_eff² = σ_foot² + σ_geo²`.
- Stop-and-stare default; scene-relative co-registration, rarely global.

## Geodetic sources (PDF)

| Source | Assessment |
|---|---|
| Lander in NAC/LOLA | Primary recoverable object |
| Orbital landmarks | Useful map-relative; absolute limited by control |
| Visual landmarks | Local consistency unless surveyed |
| Quadruped tracks | **Negative** — sub-pixel / unreliable |
| Active beacons | Optional, high ops cost |
| Passive retroreflectors | Need external laser geometry; legacy LLR ≠ DE421-only forever |

## Run tests

```bash
node --test tests/assessment.test.mjs
```

GitHub Pages deploy runs the same tests before publishing.

## Interpreting results

- **SNR ≥ 3** is a screening detectability rule for the tube forward model, not a geometry-recovery guarantee.
- MEMS drift examples (≈153 / 268 µGal/day) are published prototypes, not a LunarLeaper spec.
- Map-matching &lt;5 m / &lt;3° is a literature *goal*, not demonstrated flight performance here; UI defaults are more conservative.
- Changing cartographic σ must not change purely local relative metrics — if it does, the model is wrong.

## Extending

1. Add instruments / ConOps in `mission-model.mjs`.
2. Add physics in `assessment.mjs` (keep pure / unit-explicit).
3. Add a test that locks the new limiting behavior.
4. Wire controls in `src/app.mjs` only if the trade is decision-relevant.
