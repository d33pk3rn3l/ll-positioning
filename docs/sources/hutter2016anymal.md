# hutter2016anymal: First description and lab tests of the ANYmal four-legged walking robot (Hutter et al., IEEE/RSJ International Conference on Intelligent Robots and Systems 2016, pp. 38-44)
Abbreviations in the title: IEEE = Institute of Electrical and Electronics Engineers; RSJ = Robotics Society of Japan.

## Claim
First ANYmal paper: a 30 kg, 0.5 m tall, torque-controlled quadruped with 3 joints per leg, point feet, purely proprioceptive state estimation (inertial measurement unit (IMU) + leg kinematics + contact), static walking and trotting gaits.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Mass/size: "the 30 kg, 0.5 m tall robotic dog"; "approximate link length of 250 mm for thigh and shank" | ANYmal (2016 version) | n/a | nominal.
- Battery: "about 650 Wh energy and 3 kg weight", "more than 2 h autonomous operation" | n/a | nominal.
- IMU: "an Xsens MTi-100 IMU [is] fixedly installed for localization, navigation, and environment mapping" | sensor suite.
- Joint encoders: "position accuracy of 0.025°", torque resolution "0.08 Nm"; joint max "12 rad/s", "40 Nm" | ANYdrive | n/a | spec.
- State estimator and controller timed at "400 Hz" | n/a.
- Static walk: "a single leg is moved at the time and the base is shifted in order to maintain balance"; "the robot moves with approximately 0.3 m/s" | lab, flat ground | n/a | approximate.
- Trot: "Using a 50% duty cycle gait, the machine achieves a speed of about 0.8 m/s" | lab | n/a | approximate.
- Power: "about 290 W with about 5% fluctuation when trotting, about 100 W is consumed while idling in standing configuration"; cost of transport "about 1.2" | lab | n/a | mean.
- Body height/roll/pitch oscillation per step, gait frequency, settling time after stop, odometry drift, foot slip: not stated.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Context only for this iteration; the budget uses delivered numbers from the robot team.
Team assumption walk speed 0.15 m/s: not contradicted; the source gives ~0.3 m/s for the static walk on flat lab ground (Earth gravity, 30 kg robot). 0.15 m/s is half of that and is plausible for rough terrain, but this source does not address rough terrain. Slip priors 2 % / 6 %: not addressed. Levelling/creep angles and belly-height residuals: not addressed (only "very smooth and almost straight line of the base", no number). IMU class (MTi-100) is given; see xsens2020mti100.

## Grade
B (lab experiments on hardware).

## URL or DOI
https://doi.org/10.1109/International Conference on Intelligent Robots and Systems (IROS).2016.7758092 ; accepted version https://doi.org/10.3929/ethz-a-010686165 (opened via ETH Zurich, Swiss Federal Institute of Technology (ETH) Research Collection)

## Date opened
2026-10-19
