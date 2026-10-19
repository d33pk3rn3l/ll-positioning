# lrolgcwg2008: LRO Project and LGCWG white paper v5: A Standardized Lunar Coordinate System for LRO and Lunar Datasets

## Claim
Use the Mean Earth/Polar Axis (ME) system with planetocentric coordinates for PDS archive products, operations planning, targeting, landform identification and inter-mission communication. PA may be used internally, but data must be converted to ME before PDS delivery. Data providers must always state the frame to which their data is tied.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- ME vs PA axes differ by "about 1 km at the lunar surface" | general statement | ME vs PA (DE-unspecific) | approximate, statistic not stated.
- DE421 PA-to-ME: M = Rx(-0.30") Ry(-78.56") Rz(-67.92") P; inverse P = Rz(67.92") Ry(78.56") Rx(0.30") M | DE421 (selected by LDWG) | DE421 PA -> DE421 ME | uncertainty not stated in this document; "these angles apply only when using DE421".
- Reference sphere radius 1737.4 km (IAU/IAG 2000 and 2006 value) | n/a | n/a | defined value.
- Expected change of feature coordinates from LRO frame improvement: "at the kilometer level" | n/a | n/a | approximate.

## Height reference
Radius from the Moon's centre of mass is preferred. If needed (e.g. 4-byte DTM), height above/below a 1737.4 km reference sphere.

## Application to a walking quadruped on the Moon (LunarLeaper)
This is the cartographic recommendation the old repo followed: tag every map product as ME, and never mix PA-tagged gravity data with ME-tagged maps without the DE-specific rotation. For a few-hundred-metre walk the ME/PA rotation is a common offset, but a mistag moves all map ties by hundreds of metres.

## Grade
C (convention). Reason: an agreed standard, not a measurement.

## URL or DOI
https://science.nasa.gov/wp-content/uploads/2024/01/luncoordwhitepaper-10-08.pdf (Version 5, 2008-10-01). Version 4: https://pds-imaging.jpl.nasa.gov/documentation/LRO_Coordinate_System.pdf (not opened).

## Date opened
2026-10-19
