# LunarLeaper: Global position explorer

Use this tool to assess global position uncertainty along one mission route.
Compare the baseline with ultra-wideband (UWB) range and orbital map matching.
All example performance values are assumptions.

## Run the page

Use Node.js 22 or later.

1. Run `npm ci` to install the dependencies.
2. Run `npm run dev` to start the local server.
3. Open the URL that the server shows.

Run `npm run build` to build the site in `dist/`.
Run `npm run preview` to view that build.
GitHub Pages publishes `dist/` after the tests pass on `main`.
The workflow does not publish a preview for each pull request.

## Use the page

Select **Inputs** on a small screen.

1. Set the ravine distance walked.
2. Set the ravine climb.
3. Enter the robot performance assumptions.
4. Enter the lander position uncertainty.
5. Enter the initial heading uncertainty.
6. Enable UWB range or orbital map matching.
7. Move the route cursor to select a position.
8. Compare the selected method with the baseline.
9. Select **Save** to download the scenario file.

The synthetic route starts with a 150 m flat approach.
The ascending ravine leg is 0–500 m long.
Distance walked includes the slope.
Climb cannot exceed the ravine distance walked.

The plots and tables use the same distance cursor.
Click or drag a plot to select a distance.
Select **Same range** to compare all axes with equal y-axis limits.
If both methods are enabled, the table also shows each method separately.

A saved JSON file contains the inputs, units, statistics, frame, and assumptions.
Save also keeps the scenario in this browser.
Refresh the page to restore the last saved scenario.
Select **Load** to open a scenario file.
If an essential input is missing, the page shows an incomplete assessment.

## Inputs and terms

Each uncertainty input is one standard deviation, written as σ or 1σ.
Horizontal values apply separately to the east and north axes.
All distances are in meters unless the page specifies another unit.

| Input | Definition |
| --- | --- |
| Ravine distance and climb | Distance walked and change in up position, in meters |
| Motion σ at 100 m | Assumed motion error after 100 m, in meters |
| Rover start σ | Rover starting position error relative to the lander, in meters |
| Lander position σ | Knowledge error of the achieved lander position, in meters |
| Initial heading σ | Knowledge error of the initial horizontal direction, in degrees |
| UWB range σ | Independent error of one range measurement, in meters |
| Maximum range | Assumed limit of the UWB link, in meters |
| Observation spacing | Distance walked between observations, in meters |
| Map match σ | Independent error of one horizontal map match, in meters per axis |
| Shared map control σ | One horizontal map position error shared by all matches, in meters per axis |

**Local navigation** includes rover start and motion error in a fixed robot frame.
The local result holds the origin and heading fixed.
It uses no external observations.

**Global position** also includes lander position and initial heading knowledge.
The baseline uses no external observations.
The selected result uses observations available at the route cursor.

The frame is synthetic east–north–up, with its origin at the lander.
Its axes align with DE421 mean Earth.
Up is geometric height above the synthetic tangent plane.
The model applies no lunar terrain data or geodetic frame transform.
Lander position knowledge is separate from landing dispersion.

Absolute trajectory error (ATE) depends on the evaluation method.
A reported “1% ATE” is not automatically a standard deviation.
The tool does not convert paper results into Gaussian performance inputs.

## Model

The model uses first-order Gaussian error propagation.
It keeps starting position, initial heading, initialization, and accumulated motion errors separate.
It assumes gravity-aligned roll and pitch.
It uses a small-angle approximation for initial heading error.

The joint error state is `x = [rE, rN, rU, ψ, lE, lN, lU, cE, cN]`.
`r` is rover position error.
`ψ` is initial heading error.
`l` is lander position error.
`c` is map control error.
Heading error uses radians in the calculation.

At the start, `r = l + initialization`.
The lander and map control priors are independent.
Each remains shared along the full route.
The covariance retains correlations between rover, heading, lander, and map errors.

For displacement `[ΔE, ΔN, ΔU]` and distance walked `Δd`:

```text
r_next = r + [-ΔN, ΔE, 0] ψ + w
Q_rover = diag(σH100², σH100², σU100²) × Δd / 100 m
P_next = F P Fᵀ + Q
```

`w` is an independent motion increment with covariance `Q_rover`.
`F` is the transition matrix for this state equation.
The other state variables stay constant during propagation.
Motion variance grows linearly with distance walked.
Display subdivision does not change the result.
Starting position error moves the full trajectory together.
Position error from initial heading grows with horizontal distance from the origin.

### External observations

Schedules start one observation spacing from the origin.
The calculation applies each observation at its scheduled distance.
Future observations cannot change earlier results.
An unavailable observation has no effect.

UWB measures rover–lander distance.
For the unit line-of-sight vector `u`, the measurement row is:

```text
H_range = [uE, uN, uU, 0, -uE, -uN, -uU, 0, 0]
R_range = σrange²
```

One range directly constrains only its line of sight.
It does not provide a complete position fix.
It cannot remove the shared lander position error.
The link is unavailable beyond the maximum range.
When blockage is enabled, the bend blocks the link after 45% of the ravine leg.
This visibility rule is an assumption.

An orbital map match measures horizontal position relative to the map:

```text
H_E = [1, 0, 0, 0, 0, 0, 0, -1, 0]
H_N = [0, 1, 0, 0, 0, 0, 0, 0, -1]
R_map = σmatch² I₂
```

The model assumes that each enabled, available map match succeeds.
Map matching provides no direct height or heading measurement.
Horizontal observations can improve heading knowledge through covariance.
Repeated matches reduce independent match noise.
They retain the shared map control error.
Independent lander knowledge can reduce this control limit.

Each scalar observation uses the Joseph covariance update:

```text
S = H P Hᵀ + R
K = P Hᵀ / S
A = I - K H
P_updated = A P Aᵀ + K R Kᵀ
```

Each error source retains its full covariance contribution.
The contributions sum to the total covariance after each update.
The largest contribution has the largest sum of rover position variances.
Zero-information observations and observations with infinite noise have no effect.

### Read the results

Each plot shows one axis standard deviation: `sqrt(Pii)`.
Gray dashed curves show the baseline.
Blue curves show the selected method.
The three plots share one distance axis and cursor.

Plots use the same y-axis range by default.
Select **Per axis** to inspect smaller changes on each axis.
The markers below the plots show observation availability.
A dot marks an available observation.
A cross marks an unavailable observation.
Faint markers show future observations.

## Repeat the examples

| Example | Action | Expected result |
| --- | --- | --- |
| [Blocked UWB](scenarios/blocked-uwb.json) | Load the file and select 400 m. | The bend at 330 m blocks later ranges. |
| [Shared map control](scenarios/shared-map-limit.json) | Load the file and select 550 m. | Horizontal uncertainty stays near the assumed 5 m map control error. |

Open **Examples** to load these scenarios.
Run `node scripts/demonstrations.mjs` to generate the files and [results](scenarios/results.json).
Run `npm run check:demos` to confirm that the saved results match the calculation.

## Run the tests

```sh
npm test
npm run check:demos
npm run build
npx playwright install chromium
npm run test:browser
```

The numerical tests cover growth, geometry, shared errors, covariance, and observation timing.
A separate seeded Monte Carlo calculation tests the baseline covariance.
The browser test covers the full workflow and mobile layout.
It uses system Chromium when available.
Otherwise, it uses Playwright Chromium.
Screenshots go to `artifacts/`.

## Files and references

| Path | Purpose |
| --- | --- |
| `src/scenario.mjs` | Inputs, validation, saved scenarios, and route geometry |
| `src/localization.mjs` | Covariance propagation and observation schedules |
| `src/covariance.mjs` | Matrix operations and covariance checks |
| `src/app.mjs` | Controls, uncertainty plots, and observation markers |
| `src/values-format.mjs`, `tests/values-schema.json` | Source table format validation for future data import |
| `scenarios/` | Saved examples and calculated results |

The following papers provide research context, not performance specifications:

- [Censible, Nash et al. (2024)](https://doi.org/10.1109/ICRA57147.2024.10611697): rover image registration to an orbital map on Mars.
- [WARG, Chen et al. (2026)](https://arxiv.org/abs/2606.10602v1): rover image registration to lunar orbital images.
- Li and Jiang (2009), *Lunar Rover Positioning Based on TOA Estimation for UWB Signal Using Unitary-ESPRIT*: simulated UWB positioning with additional geometry.

The [earlier research records](https://github.com/d33pk3rn3l/ll-positioning/tree/219c9b0054d931a88e22ea8aaf9dd9d8262b6119) retain source notes, source values, and review history.
[GitHub issues](https://github.com/d33pk3rn3l/ll-positioning/issues) track unresolved defects, including #19 and #26.

LRO terrain import, image algorithms, radio simulation, loop closure, reconstruction, and science models remain outside this scope.

Use [ASD-STE100 writing rules](https://asd-ste100.org/STE_faq.html) for project instructions.
Use short sentences, active voice, and the technical terms defined above.
Give one instruction in each procedure step.
