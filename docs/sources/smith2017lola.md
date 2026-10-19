# smith2017lola: Summary of the Results from LOLA after Seven Years in Lunar Orbit (Smith et al. 2017, Icarus; accepted manuscript)

## Claim
LOLA defines the 'LOLA geodetic frame' to which LRO datasets are controlled. Current LRO orbits (GRGM900C to degree 600) are good to about 10 m total position and better than 1 m radially.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- LRO orbit reconstruction ≈10 m total position, <1 m radial | PDS LOLA-team orbits with GRGM900C (d/o 600) | LOLA geodetic frame (body-fixed realization not stated in the passage; LOLA products are in ME, not stated here) | approximate; from overlaps and track-to-DEM corrections; statistic not stated.
- Early mission: orbit overlaps better than 20 m with LOLA crossovers | Mazarico et al. 2012 orbits | not stated.
- LRO requirement 50 m orbit reconstruction | requirement.
- SLDEM2015 (LOLA + Kaguya TC, ±60° lat, 512 ppd): TC co-registration 3-4 m RMS elevation residuals to LOLA; '~3-4 m accuracy and ~60 m resolution' | SLDEM2015 | LOLA frame | RMS.
- GLD100 (LROC WAC, ±79°): ~1 km effective resolution, ~10-20 m mean vertical accuracy (Scholten et al. 2012) | GLD100 | statistic not stated.
- Highlight: 'LOLA-defined shape and reference frame enables accurate (<10m) geolocation globally' | bound.

## Height reference
Heights relative to the IAU 1737.4 km sphere for topography; mean radius from shape fit 1737.1513 ± 0.0005 km (table, product LRO_2050_SHA.TAB; statistic not stated).

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo's LOLA value '7.5 m horizontal / 0.75 m vertical' is NOT found here. This source says ~10 m total and <1 m radial (orbit level). Use 10 m / 1 m until a source for 7.5/0.75 m is found.

## Grade
A (flight data). Reason: orbit and altimetry results from LRO.

## URL or DOI
https://doi.org/10.1016/j.icarus.2016.06.006 ; manuscript https://ntrs.nasa.gov/api/citations/20160008718/downloads/20160008718.pdf

## Date opened
2026-10-19
