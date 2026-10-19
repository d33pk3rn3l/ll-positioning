# Terrain correction of surface gravity with the wedge-pentahedra method (Noeker & Karatekin 2022, Frontiers in Space Technologies 3:982873)

Citation key: `noeker2022wpm`. Original title: "The wedge-pentahedra method (WPM): Topographic reduction of local terrain in the context of solar system surface gravimetry and robotic exploration".

## Claim
The wedge-pentahedra method (WPM) is an analytical terrain reduction. It uses triangulated wedges and variable density. The authors show it on Phobos with an artificial high-resolution digital elevation model (DEM). They do not show it on the Moon.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Topography effect on Phobos surface gravity: 'a few percent' | Phobos shape (100 m/pixel) + artificial DEM | Phobos | not stated.
- Terrain scale S_T = 100: effect larger than -0.1 %; S_T = 250: about -0.7 % | artificial DEM | ratio.
- DEM resolution sensitivity at S_T = 250 (Table 6): κ = -0.7099 % (1/10 ppmeter), -0.6954 % (1/20), -0.7773 % (1/40), -0.5448 % (1/80), -0.4455 % (1/200) | Phobos test | ratio vs original surface. ("ppmeter" is the unit as printed in the source; meaning TBD - check.)
- Sensitivity to the registration error between robot and terrain: NOT in this paper.
- Steep pit case: NOT in this paper (test point inside a depression on Phobos).

## Height reference
Local terrain heights relative to the surface of the Phobos shape model.

## Application to a walking quadruped on the Moon (LunarLeaper)
The method is usable for terrain correction near the pit. But its sensitivity numbers are for Phobos (g ~5.7e-3 m/s²) and an artificial DEM. They do not transfer to the Moon. A study of a lunar pit is necessary. An abstract at the Lunar and Planetary Science Conference (LPSC) 2022 (abstract 1442) applies WPM to Apollo 17 (not opened in full).

## Grade
Model (grade C). Reason: demonstration of a numerical method.

## URL or DOI
https://doi.org/10.3389/frspt.2022.982873

## Date opened
2026-10-19
