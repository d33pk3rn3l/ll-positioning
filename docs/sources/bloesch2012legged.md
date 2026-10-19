# bloesch2012legged: State Estimation for Legged Robots - Consistent Fusion of Leg Kinematics and IMU (Bloesch et al., RSS VIII, 2012)

## Claim
An observability-constrained EKF fuses IMU and leg kinematics. Apart from absolute position and yaw, all states are observable while at least one foot is in contact.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Quote: "apart from the absolute position and yaw angle of the robot all other states can be precisely observed as long as at least one foot is in contact with the ground." | analysis.
- Drift numbers: not extracted in this pass.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Proprioceptive leg odometry alone cannot fix LunarLeaper's absolute position or heading. External heading (Sun/star) and position ties (map, lander) are needed.

## Attribution note
The list says "Bloesch et al. (2013), RSS VIII". RSS VIII is 2012 (DOI 10.15607/RSS.2012.VIII.003). A 2013 MIT Press book chapter of the same paper exists.

## Grade
B (lab experiments on StarlETH) / C (analysis).

## URL or DOI
https://doi.org/10.15607/RSS.2012.VIII.003 ; PDF https://www.roboticsproceedings.org/rss08/p03.pdf

## Date opened
2026-10-19
