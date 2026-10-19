# noeker2022wpm: The wedge-pentahedra method (WPM): topographic reduction of local terrain (Noeker & Karatekin 2022, Front. Space Technol. 3:982873)

## Claim
Analytical terrain reduction with triangulated wedges and variable density. Demonstrated on Phobos with an artificial high-resolution DEM, not on the Moon.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Topography effect on Phobos surface gravity: 'a few percent' | Phobos shape (100 m/pixel) + artificial DEM | Phobos | not stated.
- Terrain scale S_T = 100: effect larger than -0.1 %; S_T = 250: about -0.7 % | artificial DEM | ratio.
- DEM resolution sensitivity at S_T = 250 (Table 6): κ = -0.7099 % (1/10 ppmeter), -0.6954 % (1/20), -0.7773 % (1/40), -0.5448 % (1/80), -0.4455 % (1/200) | Phobos test | ratio vs original surface.
- Robot-to-terrain registration error sensitivity: NOT in this paper.
- Steep pit case: NOT in this paper (test point inside a depression on Phobos).

## Height reference
Local terrain heights relative to the Phobos shape model surface.

## Application to a walking quadruped on the Moon (LunarLeaper)
Method is usable for terrain correction near the pit, but its sensitivity numbers are for Phobos (g ~5.7e-3 m/s²) and an artificial DEM. They do not transfer to the Moon. A lunar pit study is needed; a LPSC 2022 abstract (1442) applies WPM to Apollo 17 (not opened in full).

## Grade
C (model). Reason: numerical method demo.

## URL or DOI
https://doi.org/10.3389/frspt.2022.982873

## Date opened
2026-10-19
