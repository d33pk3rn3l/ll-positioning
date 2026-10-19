# konopliv2013gl0660b: Moon gravity field and Moon mass value from the GRAIL twin-spacecraft mission, NASA JPL solution GL0660B (Konopliv et al., Journal of Geophysical Research: Planets 118:1415-1434, 2013)
Abbreviations in the title: JPL = Jet Propulsion Laboratory; NASA = National Aeronautics and Space Administration.

## Claim
Gravity Recovery and Interior Laboratory (GRAIL) Primary Mission gravity field GL0660B (degree 660), with the Moon's gravitational constant times mass (GM), Love numbers and a covariance-based map of surface resolution.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Table 4: "GM 4902.80031 ± 0.00044" (km^3/s^2) "Lunar solar system barycentric GM" | GL0660B | n/a | formal sigma x 40: "Note formal uncertainties are increased by a factor of 40 to obtain realistic errors."
- Text: "The GM solution variations indicate that the GM derived from joint planetary ranging and LLR has lower uncertainty than the current GRAIL-derived solutions" | statement.
- Reference sphere: "Accelerations are shown on the lunar reference sphere of 1738 km" | GL0660B | n/a.
- Love number "k2 = 0.02405 ± 0.00018" | GL0660B | realistic (x40) sigma.
- Resolution (abstract): "variable regional surface resolution between n = 371 (14.6 km) and n = 583 (9.3 km)" | GL0660B | covariance | n/a.
- Global signal: "(a_n)RMS = 57/√n mGals" (Kaula 0.00025/n^2) | model.
- Total error: "The total uncertainty of all harmonics ... to the crossing point of the Kaula power curve is fairly uniform over the entire lunar surface and is bounded between 10 and 12 mGals" | GL0660B | covariance | bound.
- Bouguer spectrum: "good to degree 330"; Bouguer power law "5.7/n^1/2 mGals" | GL0660B.
- Figure 10a caption: surface radial acceleration, truncated at degree 360, "max = 1268 mGals, min = 645 mGals, positive downward" | GL0660B | on 1738 km sphere. The caption does not say which degrees are removed; I do not read it as total g.
- Orbit accuracy: "GRAIL orbits are determined to an accuracy of 20 cm" | statistic not stated.
- Regional anomaly or free-air gradient at Marius Hills (14 N, 303 E): not given in the paper.

## Height reference
1738 km reference sphere for maps (not the 1737.4 km cartographic sphere).

## Application to a walking quadruped on the Moon (LunarLeaper)
Gives a sourced GM. Mean surface g [derived]: GM / R^2 = 4902.80031e9 / (1737.4e3)^2 = 1.6242 m/s^2 at R = 1737.4 km; 1.6231 m/s^2 at R = 1738.0 km. Use 1.6242 m/s^2 in all derived values. 1.62 and 1.625 are old unsourced code values. The 0.05 % difference to 1.625 does not matter for the tilt relation (bias/g), but the local g at the site also depends on height and anomaly: 1 km of height changes g by ~0.0019 m/s^2 [derived: 2g/R]. Centrifugal term at 14.1° N ~1.2e-5 m/s^2 [derived], negligible. Field resolution ~9-15 km: GRAIL cannot see a ~100 m lava tube; it gives only the regional background.

## Grade
A (flight data).

## URL or DOI
https://doi.org/10.1002/jgre.20097 ; PDF from Massachusetts Institute of Technology (MIT) DSpace https://dspace.mit.edu/server/api/core/bitstreams/dc04b6f1-a3b9-412d-a583-659482880b8f/content

## Date opened
2026-10-19
