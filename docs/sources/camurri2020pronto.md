# camurri2020pronto: A state estimator for walking robots that fuses inertial, leg, camera and laser data, tested on ANYmal with ground truth (Camurri et al., Frontiers in Robotics and AI 7:68, 2020: "Pronto")

## Claim
Extended Kalman filter (EKF) that fuses inertial measurement unit (IMU) and leg odometry, with optional visual and light detection and ranging laser scanner (LiDAR) corrections. Tested on Atlas, Valkyrie, HyQ and ANYmal (B) for 2 h 13 min and 1.37 km, with ground truth.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- ANYmal (version B): "It is 80 cm long and weighs 33 kg" | hardware.
- ANYmal IMU (Table 1): "Xsens MTi-100 400 [Hz] Init Bias: 0.2 °/s | 5 mg Bias Stab: 10 °/h | 15 mg" | paper table. The '15 mg' does not match the Xsens datasheet value 15 µg (xsens2020mti100); probably a µ/m typo in the paper.
- HyQ IMU (Table 1): "KVH 1775 ... Init Bias: 0.5 °/h | 0.5 mg Bias Stab: 0.05 °/h | 0.05 mg" | paper table.
- ANYmal encoder "Res: < 0.025°" at 400 Hz.
- ANYmal experiment 7: "commanded to trot at 0.3 m/s ... for a total of 240 m distance covered in 33 min"; industrial site 32.5 x 42.5 m; ground truth Leica TS16 "with millimeter accuracy" | field test | local | n/a.
- Table 2 ANYmal: Relative pose error (RPE) 0.34 m with visual odometry (VO) and LiDAR (auto-tuned iterative closest point laser registration, AICP); 0.83 m without them (IMU + leg odometry only). "RPE, Relative Pose Error (translational part, evaluated over 10 m distance)" | field | local | RPE (statistic over segments not stated).
- Text: "achieving an RPE of 34 cm over 10 m, which corresponds to 3.4 % error"; LiDAR "allowed the RPE to be reduced by 60 % from the baseline algorithm with IMU and Leg Odometry only" | field | local.
- IMU + leg odometry only: 0.83 m per 10 m = 8.3 % [derived from Table 2]. Label: total drift of the position estimate from inertial unit plus leg odometry, one 10 m run, not a foot-slip rate. Foot slip grows as a random walk, so this figure does not scale linearly with distance.
- Vertical drift: "characteristic vertical drift caused by leg/ground compression while trotting" | qualitative.
- After 240 m with VO+LiDAR: "the pose estimate is <30 cm away from the ground truth" | field | local | bound.
- Atlas: "~1.67 % traveled distance in preliminary indoor tests" (Pronto without LiDAR) | lab | n/a | not stated.
- HyQ (Exp. 4): RPE 0.027 m over 10 m with all sensors; "without any exteroceptive signals, the drift was more than three times higher" | lab | local.
- Foot slip rate, walk (non-trot) gait, settling time: not stated.

## Height reference
Local frame of the test site.

## Application to a walking quadruped on the Moon (LunarLeaper)
Context only for this iteration; the budget uses delivered numbers from the robot team.
Primary number for leg-odometry drift on an ANYmal: 8.3 % of distance [derived] (total drift of the position estimate from inertial unit plus leg odometry, one 10 m run, not a foot-slip rate) for IMU + legs only, trotting at 0.3 m/s on an industrial site. Team slip prior 2 %: contradicted for proprioceptive-only ANYmal trotting (8.3 % observed); 6 %: of the same order but still lower than 8.3 %. The 1.67 % figure is for Atlas (a biped), not a quadruped. Note: the drift includes all error sources (not only foot slip), and it is a trot, not a static walk. Walk speed 0.15 m/s: not addressed (trot at 0.3 m/s). Belly height: only the qualitative vertical drift from leg compression. With VO + LiDAR, 3.4 %. Foot slip grows as a random walk, so this figure does not scale linearly with distance.

## Grade
B (field and lab experiments with ground truth).

## URL or DOI
https://doi.org/10.3389/frobt.2020.00068 ; PubMed Central (PMC) full text https://pmc.ncbi.nlm.nih.gov/articles/PMC7805780/

## Date opened
2026-10-19
