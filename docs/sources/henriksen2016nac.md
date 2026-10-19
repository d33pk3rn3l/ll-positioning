# Accurate and precise topography from stereo images of the Lunar Reconnaissance Orbiter Narrow Angle Camera (Henriksen et al., ISPRS Archives XLI-B4, 2016)

Citation key: `henriksen2016nac`. Original title: "Extracting Accurate and Precise Topography from LROC Narrow Angle Camera Stereo Observations". ISPRS = International Society for Photogrammetry and Remote Sensing.

## Claim
Digital terrain models (DTM) from the Lunar Reconnaissance Orbiter Camera (LROC) Narrow Angle Camera (NAC) are controlled to profiles of the Lunar Orbiter Laser Altimeter (LOLA). Their absolute accuracy is similar to the LOLA profile uncertainty. Their relative precision is better than the DTM pixel scale.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- LOLA profile uncertainty with orbits converged with Gravity Recovery and Interior Laboratory (GRAIL) gravity: <10 m horizontal, <1 m vertical | LOLA profiles | LOLA frame | bound, statistic not stated.
- NAC DTM absolute offsets to LOLA: target <10 m horizontal, <1 m vertical; 'excepting a few outliers, are now constrained to within these uncertainties' | NAC DTMs made by Arizona State University (ASU) since 2013 | LOLA frame | bound. DTMs made before 2013 can have larger systematic errors.
- NAC DTM vs LOLA elevation root mean square error (RMSE): average 2.36 m over the last four years, 248 DTMs | ASU NAC DTMs | LOLA frame | RMSE (mean of the RMSE of each DTM).
- Relative vertical precision (linear error at 90 % probability, LE90): 0.5 to 2 x pixel scale; 2.2 m at 34.3° convergence; ~8.5 m at <10° convergence (5 m DTM case study) | estimate for each DTM from the SOCET SET software | LE90.
- Relative horizontal precision: reported as the DTM post spacing (2-5 m); circular error at 90 % (CE90) consistently less than the post spacing | CE90.
- LOLA ranging precision 10 cm; spot 5 m diameter, 25 m spacing at 50 km altitude | instrument values.

## Height reference
Not stated in the parts read (DTM elevations are compared to LOLA radii; the datum is not stated).

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo values '12/1.5 m' and '10/2 m' (horizontal/vertical) for NAC DTMs are NOT found here. This source supports <10 m horizontal and <1 m vertical (target for registration to LOLA, bound) and 2.36 m mean elevation RMSE. The relative precision inside one DTM, 2-5 m (LE90), matters most for terrain corrections along a short walk. Record the product identifier of each NAC DTM for each site.

## Grade
Flight data (grade A). Reason: measured offsets of real DTMs to LOLA.

## URL or DOI
https://isprs-archives.copernicus.org/articles/XLI-B4/397/2016/isprs-archives-XLI-B4-397-2016.pdf (doi:10.5194/isprsarchives-XLI-B4-397-2016). Companion Icarus paper doi:10.1016/j.icarus.2016.05.012 (abstract only, seen on the page of the United States Geological Survey (USGS)).

## Date opened
2026-10-19
