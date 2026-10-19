# honeywell2017hg4930: Manufacturer specification of the Honeywell HG4930 small inertial measurement unit (Honeywell manual N61-1775-000-001, October 2017, and brochure N61-1523-000-010)

## Claim
Manufacturer specification of a tactical-grade micro-electro-mechanical system (MEMS) inertial measurement unit (IMU) (140 g, <2 W), a candidate class for a small robot.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Accelerometer "Bias (In Run Stability)": AA51 0.075, BA51 0.050, CA51 0.025 "mg, 1σ" | manual Table 1 | sensor frame | 1-sigma (Allan variance, "typical performance ... over the environments").
- Accelerometer "Bias Repeatability": 3 / 2 / 1.7 "mg, 1σ" | manual | 1-sigma.
- Gyro "Bias In Run Stability": 0.45 / 0.35 / 0.25 "°/hr, 1σ"; "Bias Repeatability": 20 / 10 / 7 "°/hr, 1σ" | manual Table 4 | 1-sigma.
- Brochure: "Gyro bias stability is >0.5 °/hr when measured over a constant operating period of one month."
- Brochure angle random walk (ARW): 0.06 / 0.05 / 0.04 °/√hr; velocity random walk (VRW) 0.06 / 0.04 / 0.03 m/s/√hr | typical over full temperature range.
- Alignment stability / non-orthogonality: "750 (< 375) μrad 1σ" | manual.
- Weight "140 grams"; power "< 2 Watts"; "designed to achieve full performance by 5 seconds" | manual/brochure.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Label for in-run bias stability: Allan deviation floor, best case; not a residual bias after calibration. Best grade (CA51) in-run accel bias 25 µg -> 0.15 mrad tilt on the Moon [derived, with g = 1.6242 m/s^2], inside the team's 33 µg / 0.2 mrad target; BA51 (50 µg -> 0.30 mrad) and AA51 (75 µg -> 0.45 mrad) do not meet it [derived]. Turn-on repeatability 1.7 mg -> ~10 mrad [derived], so (inference: a robot standing still cannot separate horizontal accelerometer bias from tilt; it needs a turn of the unit (for example 180 deg about vertical) between readings, or an independent tilt reference; question for the robot team). Gyro 0.25 °/hr is ~500x above the 0.0005 °/h north-finding need [derived]. Not space-qualified; no radiation data in these files.

## Grade
B (manufacturer datasheet, typical 1-sigma values).

## URL or DOI
https://www.mapgear.com.au/wp-content/uploads/2020/03/HG4930-Environmental-Performance-Manual.pdf ; https://aerospace.honeywell.com/content/dam/aerobt/en/documents/landing-pages/brochures/N61-1523-000-010-HG4930-MEMS-Inertial-Measurement-Unit-bro.pdf

## Date opened
2026-10-19
