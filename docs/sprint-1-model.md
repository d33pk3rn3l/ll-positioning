# Sprint 1 uncertainty model

Status: declared first-order assessment model. All example performance inputs are assumed. This note defines the model implemented in `src/localization.mjs`; it does not adopt a flight estimator or convert literature ATE percentages.

## State and priors

The error state is `x = [rE, rN, rU, ψ, lE, lN, lU, cE, cN]`.

- `r` is global rover position error.
- `ψ` is shared initial heading error in radians.
- `l` is shared lander position error.
- `c` is shared orbital map control error.

At the origin, `r = l + initialization`. Thus `Cov(r,l) = Cov(l,l)`. Initialization, heading, lander prior and map control prior are independent. Lander and map offsets are each shared across the whole route; they are not redrawn at each observation. Equal horizontal per-axis sigmas set isotropic horizontal priors. Up is separate. Missing essential inputs yield no assessment.

The frame is a synthetic lander-centred ENU tangent frame aligned to DE421 mean Earth. No ME/PA transform, realization mixing, lunar terrain, landing dispersion, or instrument science term enters this model. Frame realization labels do not imply that synthetic coordinates have been transformed to a real mission site.

## Propagation

For nominal displacement `Δp = [ΔE, ΔN, ΔU]`,

```
r_next = r + [-ΔN, ΔE, 0] ψ + w
ψ_next = ψ
l_next = l
c_next = c
Q_rover = diag(σH100², σH100², σU100²) × Δdistance_walked / 100 m
P_next = F P Fᵀ + Q
```

Roll and pitch are gravity aligned and have no uncertainty here. The first-order yaw approximation has displacement proportional to horizontal distance from the origin. Motion increments are independent in the declared ENU axes and their variance is proportional to **distance walked**, not the square of each display segment's length. This distinction makes the calculation independent of display subdivision.

Without observations, at nominal displacement `p` and walked distance `d`,

```
P_rover = P_lander + P_initialization
        + σψ² J(p) J(p)ᵀ
        + diag(σH100², σH100², σU100²) d / 100 m
J(p) = [-N, E, 0]ᵀ
```

A starting translation moves the whole trajectory together. Heading error rotates the horizontal trajectory about the origin and creates east/north covariance. Neither is an independent per-point noise draw.

## Observations

Schedules start one spacing from the origin. All scheduled locations are included exactly in the calculation grid, independently of the display sampling. The filter stores pre- and post-observation values at observation locations so plots show an instantaneous update. Snapshots contain only information available at their distance. No smoother or backward pass is used.

For UWB, nominal `u = (p_rover - p_lander) / range` and

```
H_range = [uE, uN, uU, 0, -uE, -uN, -uU, 0, 0]
R_range = σrange²
```

A single observation provides one scalar constraint. Cross-track and other unobserved directions remain uncertain. Because rover and lander share global translation, the range cannot observe that translation. With the lander at the route origin, pure initial yaw also leaves nominal range invariant. Up can benefit through sloped range geometry; it is not directly measured as height.

UWB is unavailable beyond the assumed maximum straight-line range or behind the bend when terrain blockage is enabled. The bend is at 45% of the ravine leg. This is a nominal synthetic visibility mask, not a ray-traced terrain or radio model. Unavailable observations are logged but produce no covariance update. A range at zero separation has no direction and gives no update.

Orbital map matching has two rows:

```
H_E = [1, 0, 0, 0, 0, 0, 0, -1, 0]
H_N = [0, 1, 0, 0, 0, 0, 0, 0, -1]
R = σmatch² I₂
```

These are horizontal observations relative to the uncertain map control. The rows may be applied sequentially because their measurement noises are independent. They have no direct heading or up entries, although horizontal position observations can indirectly constrain heading through accumulated correlations. Each available enabled match is assumed successful. No image algorithm or outlier process is simulated.

Repeated matches average independent match noise; they do not create independent map control realizations. With a weak lander prior, the uncertainty approaches the shared map control scale. This is not a universal hard lower bound: independent lander knowledge can help estimate the control offset.

## Covariance and attribution

For each scalar measurement,

```
S = H P Hᵀ + R
K = P Hᵀ / S
A = I - K H
P_updated = A P Aᵀ + K R Kᵀ
```

This Joseph update retains the joint rover/heading/lander/map covariance. Zero-information measurements and infinite noise are no-ops. Zero innovation variance is also a no-op, with no division by zero.

Each independent error source holds its own full covariance contribution. Propagation maps each with `F P_source Fᵀ` and adds motion noise to the motion contribution. Conditioning maps every source with `A P_source Aᵀ` and assigns `K R Kᵀ` to range or match noise. These contributions sum to the full covariance after conditioning. The dominant contribution uses the trace of each source's rover position block, in m². It is a variance attribution, not a set of independent axiswise standard deviations to add.

## Views and statistics

Plots show `sqrt(Pii)` in east, north and up. Ellipsoid principal semiaxes are `sqrt(eigenvalue(P_rover))`; the full covariance sets their orientation. No confidence percentage is assigned.

The local navigation row and local viewport use initialization and motion with origin and heading fixed, before external ties. The global rows include starting reference and heading knowledge and all observations available so far. This makes the definitions explicit; the local row is not a second independently fused estimate.

Two faint baseline perturbation trajectories combine declared positive/negative 1σ starting translation, yaw and distance-scaled motion perturbations. They are illustrative deterministic paths, not posterior samples or a multivariate confidence region. Nearby ghost rock registration uses the same origin and yaw perturbations as the route; in the local frame these shared reference effects cancel. Marker and lander sizes are illustrative.

## Verification

`tests/localization.test.mjs` checks analytic limits, joint cross-covariance, subdivision invariance with both methods, covariance eigenvalues, source-sum equality, causal filtering and saved reproduction. The seeded Monte Carlo check draws translation, initialization, yaw and distance-scaled motion independently of the filter implementation, then compares the empirical covariance with the analytic baseline. `scripts/browser-check.mjs` validates the production page and saved scenario workflow.
