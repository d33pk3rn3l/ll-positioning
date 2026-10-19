# State estimation for legged robots: fusion of leg kinematics and an inertial measurement unit (Bloesch et al., Robotics: Science and Systems VIII, 2012)

Citation key: `bloesch2012legged`. Original title: "State Estimation for Legged Robots - Consistent Fusion of Leg Kinematics and IMU".

## Claim
An extended Kalman filter (EKF) with observability constraints combines an inertial measurement unit (IMU) and leg kinematics. All states are observable while at least one foot touches the ground, except absolute position and yaw.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Quote: "apart from the absolute position and yaw angle of the robot all other states can be precisely observed as long as at least one foot is in contact with the ground." | analysis.
- Drift numbers: not extracted in this pass.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Leg odometry from internal sensors alone cannot find the absolute position or heading of LunarLeaper. An external heading (Sun or stars) and position ties (map, lander) are necessary.

## Attribution note
The list says "Bloesch et al. (2013), RSS VIII". Robotics: Science and Systems (RSS) VIII is 2012 (DOI 10.15607/RSS.2012.VIII.003). A 2013 book chapter (MIT Press) of the same paper exists.

## Grade
Lab or analog (grade B): experiments on the StarlETH robot. Model (grade C): the analysis.

## URL or DOI
https://doi.org/10.15607/RSS.2012.VIII.003 ; PDF https://www.roboticsproceedings.org/rss08/p03.pdf

## Date opened
2026-10-19
