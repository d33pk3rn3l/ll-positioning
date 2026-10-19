# xsens2020mti100: Manufacturer specification of the Xsens MTi-100 inertial unit used on ANYmal (Xsens leaflet "MTi 100-series US_20200910")

## Claim
Manufacturer specification of the micro-electro-mechanical system (MEMS) inertial measurement unit (IMU) used on ANYmal (hutter2016anymal, camurri2020pronto). The product is end-of-life.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Gyroscope: full range "+/- 450 º/s"; "Initial bias error 0.2 º/s"; "In-run bias stability 10 º/h"; bandwidth 415 Hz; g-sensitivity "0.003 º/s/g" | datasheet | sensor frame | typical, statistic not stated.
- Accelerometer: full range "+/- 20 g"; "Initial bias error 5 mg"; "In-run bias stability 15 µg"; bandwidth 375 Hz | datasheet | sensor frame | typical, statistic not stated.
- Non-orthogonality 0.05 deg (gyro and accel); non-linearity 0.01 % (gyro), 0.1 % (accel).
- Noise density: not printed in the leaflet table I opened (blank cell). Search snippets of other Xsens leaflets give 0.01 º/s/√Hz and 60 µg/√Hz; not seen in my file.
- Vertical reference unit (VRU)/attitude and heading reference system (AHRS) roll/pitch: "Roll/pitch (Static) 0.2º", "(Dynamic) 0.3º" (MTi-200/300/G-710, not the bare MTi-100 IMU) | datasheet | local level | statistic not stated.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Tilt error from accelerometer bias on the Moon is about bias / 1.625 m/s^2 (team relation). In g units: 15 µg -> 15e-6 x 9.80665 / 1.6242 = 0.09 mrad [derived]; this meets the team's 33 µg (0.2 mrad) target only for the in-run part. The initial (turn-on) bias 5 mg -> ~30 mrad [derived] is ~150x the target, so a per-station bias calibration (or a separate inclinometer) is needed. Gyro in-run bias 10 º/h is ~2e4 x above the 0.0005 º/h needed for lunar north-finding [derived from prof-geodesy number]. Statistic type not stated by the vendor.

## Grade
B (manufacturer datasheet, typical lab values, not independently verified).

## URL or DOI
https://www.xsens.com/hubfs/Downloads/Leaflets/mti-100-series.pdf

## Date opened
2026-10-19
