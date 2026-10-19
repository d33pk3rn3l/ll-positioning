# wan2014yutu: Locating the Chinese Yutu Moon rover from camera images taken at successive stops (Wan, Liu, Di, Wang, Zhou, ISPRS Archives XL-4:279-284, 2014)
Abbreviations in the title: ISPRS = International Society for Photogrammetry and Remote Sensing.

## Claim
Bundle adjustment of Navcam stereo images between stops ("sites") localizes Yutu better than inertial measurement unit (IMU) + wheel dead reckoning. Used in Chang'e-3 operations.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Rover ops: travels "no more than 10 meters at a low speed between adjacent waypoints", capable "of up to 200 meters per hour" | Yutu | n/a.
- Dead reckoning (IMU + wheel odometry): "the localization error can be up to 15%" ("through ground tests") | Yutu | local | bound.
- Field test (model rover, 16 sites, indoor Global Positioning System (GPS) truth): "error of visual localization in the simulated field is 1%~4%, average of which is about 3.3%, which satisfied for the designed accuracy 5%" | Earth analog | local | range / mean.
- Theory: "1.05% in forward-forward image capture mode"; "0.38% in forward-backward image capture mode" (f = 1189 px, B = 0.27 m, σp = 1/3 px, 4 tie points at 13-16 m, sites 10 m apart) | error propagation | local | 1-sigma (model).
- Mission: "By January 16th, 2014 ... Yutu has travelled 114.8m, passing by 17 sites" | flight.
- Processing time: "no more than 2 minutes" per localization | ops.

## Height reference
Not stated.

## Application to a walking quadruped on the Moon (LunarLeaper)
Only lunar rover localisation numbers found: dead reckoning up to 15 %, stop-and-look visual localization 1-4 % (Earth analog). For a quadruped the dead-reckoning number is wheel-based and not transferable, but it bounds the "IMU + odometry only" case. Team slip priors 2 % / 6 %: not addressed directly (wheel rover). Liu et al. 2015 (Sci. China Physics, Mechanics and Astronomy (PMA) 58, doi 10.1007/s11433-014-5612-0) was NOT opened (Springer page gave no abstract text); its "3.3 %" figure in search results matches this paper's field test.

## Grade
B (Earth analog test with ground truth); flight use is reported, but no flight accuracy number.

## URL or DOI
https://doi.org/10.5194/isprsarchives-XL-4-279-2014 ; PDF https://isprs-archives.copernicus.org/articles/XL-4/279/2014/isprsarchives-XL-4-279-2014.pdf

## Date opened
2026-10-19
