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
Version 1 files keep their original numeric inputs and independent reference errors.
Select **Reset** to use the new planning defaults.
If an essential input is missing, the page shows an incomplete assessment.

## Inputs and terms

Each uncertainty input is one standard deviation, written as σ or 1σ.
Horizontal values apply separately to the east and north axes.
All distances are in meters unless the page specifies another unit.

| Input                            | Default            | Basis                                                                                                      |
| -------------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------- |
| Approach; ravine; climb          | 150 m; 400 m; 80 m | Synthetic route; 550 m total distance walked                                                               |
| Motion σ at 100 m                | 4 m on each axis   | Planning allowance; see the ATE interpretation below                                                       |
| Rover start σ relative to lander | 0.5 m on each axis | Deployment allowance; no LL measurement supplied                                                           |
| Lander horizontal position σ     | 40 m per axis      | Includes 30 m shared map error and a separate lander location error                                        |
| Lander up position σ             | 15 m               | Height allowance; published DTM registration errors are not absolute height σ [2]                          |
| Initial heading σ                | 3°                 | Allowance conditional on an external direction reference; aligned ATE does not measure this error [3]      |
| UWB range σ                      | 0.5 m              | Allowance for accepted clear links; terrestrial LOS errors were 0.05–0.10 m RMSE [4]                       |
| UWB maximum range; spacing       | 75 m; 50 m walked  | Provisional cap below the published sensor's 80 m range; assumed observation spacing [4]                   |
| Horizontal map match σ           | 5 m per axis       | Allowance above WARG's reported 1.68 m real-data and 3.63 m domain-transfer errors [5]                     |
| Shared horizontal map control σ  | 30 m per axis      | Allowance above published latitude offset spreads up to 22.4 m; reference positions are also uncertain [1] |
| Map observation spacing          | 100 m walked       | Assumed operating interval                                                                                 |
| Lander position from this map    | On                 | Lander and map matches retain the same horizontal control error                                            |
| UWB; map matching                | Off; off           | Start with the baseline                                                                                    |

These are provisional planning values, not flight specifications or statistical bounds.
The research guides the allowances. Its reported errors are not converted to per-axis σ.
The 40 m lander input assumes that the achieved position is identified in a controlled orbital map.
A landing ellipse alone does not establish this knowledge.
The 3° heading input requires a separate direction measurement, such as a calibrated Sun or star observation.
If no such measurement is available, heading uncertainty remains to be specified.
The 75 m radio cap requires an LL link budget before mission use.
The range noise excludes blocked links and rejected measurements.
No radio hardware, antenna, clock, or map product has been specified for LL.

### Robot team's 1% ATE

The team reports ATE divided by trajectory length as 1%.
The planning comparison assumes RMSE. The statistic, evaluation length, dimensions, alignment, and sampling need confirmation.
If it is trajectory RMSE on a 550 m test, the reported error is 5.5 m.
It is not an endpoint error or a per-axis standard deviation.
The standard ATE method first aligns the trajectories [3].
This can remove the initial position and heading errors that affect global position.

The 4 m inputs are explicit allowances. They do not come from an automatic ATE conversion.
For this model, with a fixed origin and heading and uniform sampling by distance:

```text
sqrt(E[mean squared 3D motion error])
  = sqrt((2 σH100² + σU100²) × L / (2 × 100 m))
  = 11.49 m for L = 550 m and σH100 = σU100 = 4 m
```

This is about 2.1% of the example route length.
It is a model comparison, not a prediction of aligned test ATE.
One trajectory statistic cannot establish a growth law.
Keep these motion inputs fixed when the route length changes.
Use trajectory residuals from repeated tests to replace the allowances and check the growth law.

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
By default, the lander position comes from the same map as the orbital matches.
The horizontal lander error is `l = c + a`, where `a` is independent location error.
The lander input is the total σ: `var(a) = σlander² − σcontrol²`.
The lander σ must be at least the shared control σ.
The initial covariances `cov(r,c)` and `cov(l,c)` equal `σcontrol²` on each horizontal axis.
Vertical lander error remains separate.
Clear **Lander position from this map** only when the lander fix uses an independent reference.
That option retains the original independent lander and map priors.
Each common error remains shared along the full route.
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
An independent lander fix can reduce this control limit.
A lander fix from the same map cannot remove the common map error.

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

| Example                                               | Action                          | Expected result                                                       |
| ----------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| [Blocked UWB](scenarios/blocked-uwb.json)             | Load the file and select 400 m. | The bend at 330 m blocks later ranges.                                |
| [Shared map control](scenarios/shared-map-limit.json) | Load the file and select 550 m. | Horizontal uncertainty stays near the assumed 30 m map control error. |

Open **Examples** to load these scenarios.
The blocked-link example uses a synthetic 650 m range cap to isolate wall blockage.
It does not specify radio performance.
The map example uses 1,000 m lander uncertainty and no horizontal motion or heading error to isolate shared map control.
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

| Path                                                | Purpose                                                 |
| --------------------------------------------------- | ------------------------------------------------------- |
| `src/scenario.mjs`                                  | Inputs, validation, saved scenarios, and route geometry |
| `src/localization.mjs`                              | Covariance propagation and observation schedules        |
| `src/covariance.mjs`                                | Matrix operations and covariance checks                 |
| `src/app.mjs`                                       | Controls, uncertainty plots, and observation markers    |
| `src/values-format.mjs`, `tests/values-schema.json` | Source table format validation for future data import   |
| `scenarios/`                                        | Saved examples and calculated results                   |

The numbered sources support the planning rationale above:

1. [Collins et al. (2026), controlled LROC NAC mosaics](https://doi.org/10.3390/rs18030525), Table 4. Comparisons include error in the reference images. The 30 m control allowance is not a measured absolute lunar map σ.
2. [Henriksen et al. (2016), LROC NAC stereo DTMs](https://doi.org/10.5194/isprsarchives-XLI-B4-397-2016). DTM-to-LOLA vertical RMSE averages 2.36 m across the products studied. This is registration agreement, not independent absolute height accuracy. The 15 m height allowance also covers an unspecified LL product.
3. [Sturm et al. (2012), trajectory evaluation](https://jsturm.de/publications/data/sturm12iros.pdf). Defines aligned trajectory error and translation RMSE. It supplies no LL heading or motion specification.
4. [Chen et al. (2022), UWB and LiDAR experiments](https://doi.org/10.3390/rs14174258), Tables 1–2. Sensor range is below 80 m; blocked measurements have much larger errors than clear links. These are terrestrial tests.
5. [WARG, Chen et al. (2026)](https://arxiv.org/abs/2606.10602v1). Reports lunar image registration errors. The 5 m match allowance adds a planning margin; it excludes shared global map control.

[Censible, Nash et al. (2024)](https://doi.org/10.1109/ICRA57147.2024.10611697) also reports accurate rover-to-orbital registration on Mars. Its map-relative accuracy does not establish lunar global accuracy.
The supplied Li and Jiang (2009) UWB study uses simulation and additional geometry. It does not establish LL hardware range or single-range position accuracy.

The [earlier research records](https://github.com/d33pk3rn3l/ll-positioning/tree/219c9b0054d931a88e22ea8aaf9dd9d8262b6119) retain source notes, source values, and review history.
[GitHub issues](https://github.com/d33pk3rn3l/ll-positioning/issues) track unresolved defects, including #19 and #26.

LRO terrain import, image algorithms, radio simulation, loop closure, reconstruction, and science models remain outside this scope.

Use [ASD-STE100 writing rules](https://asd-ste100.org/STE_faq.html) for project instructions.
Use short sentences, active voice, and the technical terms defined above.
Give one instruction in each procedure step.
