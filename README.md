# LunarLeaper · Global position explorer

Sprint 1 answers one question: **how does global position uncertainty grow along one mission route, and which external observations help?**

The single page has a synthetic 3D scene, local and global views, one route cursor, east/north/up uncertainty plots, source contributions, and baseline comparison. An LL reviewer can change every scenario input without editing code. UWB range and orbital map matching can run separately or together.

## Run

Requires Node 22 or later.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. `npm run build` creates the deployable site in `dist/`. `npm run preview` serves that build. GitHub Pages publishes `dist/` after checks on `main`.

## Reviewer workflow

1. Set ravine distance walked and climb. The flat approach stays 150 m. Ravine distance is 0–500 m and includes the slope. Climb cannot exceed it.
2. Enter assumed robot motion standard deviations at 100 m and rover initialization error.
3. Enter lander position knowledge and initial heading knowledge separately.
4. Enable ultra-wideband (UWB) range, orbital map matching, or both. Open each method's assumptions.
5. Move the route cursor, click a plot or route, or select an observation in the log. All views select the same distance.
6. Compare the selected curve with the baseline. The table also compares each method separately when both are enabled.
7. Save a versioned JSON scenario. Save also stores the scenario in this browser. Load imports JSON. Refresh restores the last saved inputs.

A missing essential numeric value produces an incomplete assessment and suppresses stale results. Invalid scenario files leave the current scenario intact.

## Model and input definitions

All performance defaults are **illustrative assumptions**, expressed as one standard deviation. Horizontal uncertainties are **per axis**, with equal independent east/north prior variances. Inputs display units and assumption labels; saved scenarios carry per-input unit, statistic, source and status metadata.

| Inputs | Meaning |
| --- | --- |
| Ravine length / climb | True distance walked / geometric up change, m |
| Horizontal / up motion σ at 100 m | Independent increment variance grows as `sigma100² × distance_walked / 100 m` |
| Rover initialization σ | Relative starting-position error, separate from lander knowledge |
| Lander horizontal / up position σ | Shared knowledge error of the achieved position; excludes landing dispersion |
| Initial heading σ | Shared small-angle yaw error, degrees; gravity-aligned roll/pitch assumed |
| UWB range σ / maximum range / spacing | Scalar range noise, nominal availability bound, scheduled distance walked |
| Map match σ / shared map control σ / spacing | Independent horizontal measurement noise, one persistent horizontal control offset, scheduled distance walked |

The joint state retains covariance between rover position, initial heading, lander position and map control. Starting-position, heading, initialization, motion, map control and measurement noise contributions remain separate. UWB uses the rover–lander range Jacobian. Map matching measures horizontal position relative to the same uncertain map at each observation. Neither provides a direct heading fix; map matching provides no direct height fix.

The baseline is the starting tie plus motion, without external observations. All results are causal: future observations cannot alter previous estimates. Display subdivision does not change the growth model or observation schedule.

**Local navigation** is initialization plus motion in a robot frame with origin and heading fixed, before external ties. **Global position** additionally carries knowledge of the lunar origin and heading, conditioned on observations available so far. Global axes use a **synthetic lander-centred east–north–up frame aligned to DE421 mean Earth**. No lunar geodetic transform or actual terrain is applied. Up is geometric height above the synthetic tangent plane.

A reported absolute trajectory error (ATE), including “1% ATE”, is not automatically a standard deviation. No attached paper's benchmark error is used as a Gaussian input without an explicit statistical assumption. See [model equations](docs/sprint-1-model.md) and [research interpretation](docs/sources/sprint-1-research.md).

## Reproduce the demonstrations

Use the sidebar example buttons, or load the committed JSON files:

- [Blocked UWB](scenarios/blocked-uwb.json): select 400 m. The bend at 330 m blocks later ranges. Prior ranges remain useful, but unavailable ranges have no effect.
- [Shared map control limit](scenarios/shared-map-limit.json): select the 550 m route end. Many precise map matches retain approximately the declared 5 m horizontal control uncertainty. The weak independent lander prior is declared; a strong independent prior can reduce that limit.

`node scripts/demonstrations.mjs` regenerates both scenarios and [their numerical results](scenarios/results.json). `npm run check:demos` verifies exact reproduction.

Ellipsoid semiaxes equal one principal-axis standard deviation, at true scene scale, without a confidence percentage. The faint trajectories are deterministic baseline perturbations, not posterior samples. Terrain, rocks, marker sizes and the lander are illustrations. UWB blockage is an explicit nominal visibility mask behind the synthetic bend, not a radio simulation.

## Validation

```sh
npm test
npm run check:demos
npm run build
npx playwright install chromium
npm run test:browser
```

The browser check uses system Chromium when present or Playwright Chromium otherwise. `CHROMIUM_EXECUTABLE` can select a binary. It starts and stops a local production preview. Screenshots go to ignored `artifacts/`.

Numerical checks cover shared translation, heading lever arm and covariance, the stated motion law, subdivision invariance, range geometry, shared lander/map error, unavailable and uninformative observations, causal filtering, source attribution, covariance symmetry and eigenvalues, zero uncertainty, invalid inputs, and saved scenario reproduction. A separate seeded Monte Carlo calculation checks the baseline. Existing source-table checks remain intact. Browser checks exercise the complete workflow, both demonstrations, local/global views, imports, incomplete inputs and mobile layout.

## Architecture and preserved work

- `src/scenario.mjs`: versioned inputs, metadata, validation and route geometry.
- `src/localization.mjs`: pure covariance model and observation schedule.
- `src/covariance.mjs`: matrix operations and ellipsoid eigensystem.
- `src/app.mjs`, `src/viewport.mjs`: controls, plots and one Three.js viewport.
- `scenarios/`: saved demonstrations and reproducible outputs.

The old science/navigation assessment, legacy gravimetry page and their tests were removed. The source notes, bibliography, frame notes, science trace, motion audit and source-table validator remain as research. Earlier `CHARTER.md`, `DECISIONS.md` entries and status text describe the broader research programme; this Sprint 1 does not claim to approve those gates. See [issue reconciliation](docs/sprint-1-issues.md).

Deferred: LRO terrain import, image matching algorithms, radio simulation, loop closure, post-mission reconstruction and science models.
