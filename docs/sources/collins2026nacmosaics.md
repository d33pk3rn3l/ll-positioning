# Controlled mosaics from ShadowCam and the Lunar Reconnaissance Orbiter Narrow Angle Camera, and their position accuracy (Collins et al. 2026, Remote Sensing 18(3):525)

Citation key: `collins2026nacmosaics`. Original title: "Photogrammetric Processing of Regional ShadowCam and LROC NAC Controlled Mosaics, Evaluation of Positional Accuracies, and Scientific Applications".

## Claim
The paper describes how the team of the Lunar Reconnaissance Orbiter Camera (LROC) makes controlled mosaics (CM). They use the program jigsaw of ISIS (Integrated Software for Imagers and Spectrometers). The paper measures the absolute position offsets of 645 Narrow Angle Camera (NAC) controlled mosaics against medians of uncontrolled NAC images.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Uncontrolled NAC images: mean positional accuracy 5.2 m to 31.1 m, as a function of mission phase, orbit and use of the Miniature Inertial Measurement Unit (MIMU) | Section 4.1 and Table 3 (cites Wagner et al. 2024) | lunar reference frame, realization not stated | MEAN (not 1-sigma).
- NAC CMs vs ≥5 images taken with MIMU active: median positional error <12 m latitude, <5 m longitude; "95% of these points having a positional error of ≤42 m in latitude and <17 m in longitude" | 1408 points with five or more such images (of 4858 valid points) | as above | MEDIAN and 95th percentile (not 1-sigma). The source gives "<" and "≤", so each value is an upper bound on the statistic.
- NAC CMs vs ≥5 Mapping Orbit images: median <10 m lat, <6 m lon; 95 % <62 m lat, <40 m lon | 131 points with five or more such images | as above | median / 95th percentile (not 1-sigma), upper bounds.
- Highlights: average offset < 13 m | mean.
- Seam tolerance: <15 m accepted, most <10 m (NAC); ShadowCam most <6 m | bound.
- A priori ground point sigma 15 m horizontal; vertical sigma of the NAC digital terrain model (DTM) = 3 x the root mean square (RMS) difference to the Lunar Orbiter Laser Altimeter (LOLA) (the LOLA RMS of NAC DTMs is usually 1-5 m) | input weights.
- 'only five laser retroreflector locations ... known to meter-level accuracy'.
- Limit of the offset method (Section 3.6): the "true" location is the median location of a point in 5 or more similarly illuminated, uncontrolled NAC images. Quote: "The primary limitation is that we are comparing the mosaic to uncontrolled images, which contain positional error themselves. While this error should average out if we use enough images in the analysis, often there is an insufficient number of NAC images". Reviewer point (prof-geodesy; not stated in the source): the comparison images share the error of the spacecraft position, so their errors are correlated and do not fully average out. Thus the reference is not independent truth, and the true absolute error can be larger than these offsets. Use the 95th percentile as the bound. Do not convert the median to a sigma.

## Height reference
Radius source from SLDEM2015 (LRO Lunar Orbiter Laser Altimeter digital elevation model (DEM) coregistered with Selene Data; full name from the abbreviation list of this paper), GLD100 (Global Lunar DTM 100 m), LDEM (LOLA digital elevation model) or NAC DTM. Datum not stated for the offsets (horizontal only).

## Application to a walking quadruped on the Moon (LunarLeaper)
Best current number for the absolute error of a NAC controlled basemap: about 10 m median, with tails to 40-60 m (95th percentile). These offsets are measured against uncontrolled images with correlated errors, not against independent truth, so the true absolute error can be larger. A LunarLeaper map tie must check the actual product for Marius Hills. Use the 95th percentile as the bound. Do not use the median, and do not convert it to a sigma.

## Attribution warning
Benedikt's list gives "Manheim et al. (2026)". The first author is William M. Collins. Manheim is not an author of this paper. The authors are Collins, Grieser, Henriksen, Clark, Carr, Wagner, Roseborough, Nystrom, Robinson. The numbers on the list (5-31 m, <12 m / <5 m median) agree with the paper. The <12/<5 m values are MEDIANS, not 1-sigma.

## Grade
Flight data (grade A). Reason: analysis of flight data.

## URL or DOI
https://doi.org/10.3390/rs18030525

## Date opened
2026-10-19
