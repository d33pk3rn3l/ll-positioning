# arm2023analog: A team of three ANYmal walking robots explores Moon and Mars test sites on Earth (Arm et al., Science Robotics 8(80), eade9548, 2023: "Scientific exploration of challenging planetary analog environments with a team of legged robots")

## Claim
Three ANYmal C/D robots (ETH Zurich, Swiss Federal Institute of Technology (ETH) Robotic Systems Lab (RSL)) with light detection and ranging laser scanner (LiDAR) simultaneous localization and mapping (SLAM), cameras and science payloads explored three planetary analog sites (ExoMars testbed, Swiss quarry, ESA-ESRIC Space Resources Challenge). Legged robots climb granular slopes >25° without locomotion failure.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Platforms: "The Scout is an ANYmal C (2019), whereas the Hybrid and the Scientist are based on ANYmal D (2021)" | hardware.
- Mass: "ANYmal weighs 50 kg, has a payload capacity of 15 kg, and a nominal operation time of 90 min while continuously walking" | ANYmal C/D | n/a | nominal.
- Slopes: Scout climbed and descended slopes "up to 25° - the maximum of the testbed" on ESA Mars soil simulant (ES-4) simulant and bedrock; three tests each, "without a locomotion failure ... for example due to slippage" | analog field test | n/a | count.
- Speed on slope: "Even on the maximum slope of the testbed, the robot reached a top speed of 0.7 m/s" | analog | n/a | maximum.
- Table S3: ANYmal maximum speed on flat ground "1900 mm/s / 2.043 body length/s"; slope "min 25 on granular soil" | n/a | maximum.
- Standby power: "the robot consumes 175 W" (all computers and actuators in standby) | lab | n/a | measured.
- Power test: robot walked between waypoints "3.8 m apart", stopping "for 8 s at every waypoint, simulating a short measurement" | lab | n/a | test design (not a settling-time measurement).
- Localisation: LiDAR SLAM (CompSLAM, Velodyne VLP16), "we rely only on the inertial data as a prior" | method | n/a | no drift number.
- Elevation map: "8 m x 8 m with a resolution of 40 mm" | n/a.
- Inertial measurement unit (IMU) model, odometry drift %, foot slip rate, body height/roll/pitch while walking, settling time: not stated in the text I read.

## Height reference
Not stated.

## Application to a walking quadruped on the Moon (LunarLeaper)
Team assumption walk speed 0.15 m/s: not contradicted; analog-terrain top speed is 0.7 m/s on a 25° slope, so 0.15 m/s is conservative. Mean traverse speed is not stated. Slip priors 2 % / 6 %: not addressed (only "no locomotion failure"). Levelling/creep and belly height: not addressed. Note the mass (50 kg) is far above LunarLeaper's 15 kg class (kolvenbach2026ll), so speeds do not transfer directly. Earth gravity only.

## Grade
B (analog field deployment).

## URL or DOI
https://doi.org/10.1126/scirobotics.ade9548 ; arXiv https://arxiv.org/abs/2307.10079 (v1 PDF opened)

## Date opened
2026-10-19
