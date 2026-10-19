# henriksen2016nac: Extracting accurate and precise topography from LROC NAC stereo observations (Henriksen et al., ISPRS Archives XLI-B4, 2016)

## Claim
NAC DTMs are controlled to LOLA profiles. Absolute accuracy is commensurate with LOLA profile uncertainty; relative precision is better than the DTM pixel scale.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- LOLA profile uncertainty with GRAIL-converged orbits: <10 m horizontal, <1 m vertical | LOLA profiles | LOLA frame | bound, statistic not stated.
- NAC DTM absolute offsets to LOLA: target <10 m horizontal, <1 m vertical; 'excepting a few outliers, are now constrained to within these uncertainties' | ASU NAC DTMs made since 2013 | LOLA frame | bound. Pre-2013 DTMs may have larger systematic errors.
- NAC DTM vs LOLA elevation RMSE: average 2.36 m over the last four years, 248 DTMs | ASU NAC DTMs | LOLA frame | RMSE (mean of per-DTM RMSE).
- Relative vertical precision (linear error, LE90 = 90 % probability): 0.5 to 2 x pixel scale; 2.2 m at 34.3° convergence; ~8.5 m at <10° convergence (5 m DTM case study) | per-DTM SOCET SET estimate | LE90.
- Relative horizontal precision: reported as the DTM post spacing (2-5 m); CE90 consistently less than the post spacing | CE90.
- LOLA ranging precision 10 cm; spot 5 m diameter, 25 m spacing at 50 km altitude | instrument values.

## Height reference
Not stated in the parts read (DTM elevations are compared to LOLA radii; the datum is not stated).

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo values '12/1.5 m' and '10/2 m' (horizontal/vertical) for NAC DTMs are NOT found here. This source supports <10 m horizontal and <1 m vertical (LOLA-registration target, bound) and 2.36 m mean elevation RMSE. The relative (within-DTM) precision of 2-5 m (LE90) matters most for terrain corrections along a short walk. Each NAC DTM product ID must be recorded per site.

## Grade
A (flight data). Reason: measured offsets of real DTMs to LOLA.

## URL or DOI
https://isprs-archives.copernicus.org/articles/XLI-B4/397/2016/isprs-archives-XLI-B4-397-2016.pdf (doi:10.5194/isprsarchives-XLI-B4-397-2016). Companion Icarus paper doi:10.1016/j.icarus.2016.05.012 (abstract only seen via USGS page).

## Date opened
2026-10-19
