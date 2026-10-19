# A standard lunar coordinate system for the Lunar Reconnaissance Orbiter and lunar datasets (LRO Project white paper, version 5, 2008)

Citation key: `lrolgcwg2008`. Original title: "A Standardized Lunar Coordinate System for the Lunar Reconnaissance Orbiter and Lunar Datasets". Authors: Lunar Reconnaissance Orbiter (LRO) Project and LGCWG (full name: TBD - check).

## Claim
Use the Mean Earth/Polar Axis (ME) system with planetocentric coordinates for products in the Planetary Data System (PDS) archive. Use it also for operations planning, targeting, naming of landforms and communication between missions. Teams can use the principal axis (PA) system internally. They must convert data to ME before PDS delivery. Data providers must always state the frame of their data.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- ME vs PA axes differ by "about 1 km at the lunar surface" | general statement | ME vs PA (no specific Development Ephemeris (DE)) | approximate, statistic not stated.
- DE421 PA-to-ME: M = Rx(-0.30") Ry(-78.56") Rz(-67.92") P; inverse P = Rz(67.92") Ry(78.56") Rx(0.30") M | DE421 (selected by LDWG, full name TBD - check) | DE421 PA -> DE421 ME | uncertainty not stated in this document; "these angles apply only when using DE421". Sign convention (source p. 8): "if M is a vector of Cartesian coordinates in the ME reference frame and P is a coordinate vector in the PA reference frame, then the derived rotation between reference frames is: M = Rx(-0.30") Ry(-78.56") Rz(-67.92") P where the angles are in seconds of arc and the rotations are around the body X, Y and Z axes." and "Note that rotation of coordinates of the above equations and the corresponding rotation of the frames have the opposite sense." Direction (PA to ME), axis order and coordinate sense are stated. The sense of a positive rotation (right-hand rule) is not stated in this document; it cites Williams et al. (2008), which I did not open. Context only, not for computation; sign convention not stated in source.
- Reference sphere radius 1737.4 km (value of the International Astronomical Union (IAU) and International Association of Geodesy (IAG), 2000 and 2006) | not applicable | not applicable | defined value.
- Expected change of feature coordinates from LRO frame improvement: "at the kilometer level" | not applicable | not applicable | approximate.

## Height reference
The document prefers radius from the Moon's centre of mass. If necessary (for example a digital terrain model (DTM) stored in 4 bytes), use height above or below a 1737.4 km reference sphere.

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo followed this cartographic recommendation. Tag every map product as ME. Do not mix gravity data tagged PA with maps tagged ME without the rotation for that DE. For a walk of a few hundred metres, the ME/PA rotation is a common offset. But a wrong tag moves all map ties by hundreds of metres.

## Grade
Model or convention (grade C). Reason: an agreed standard, not a measurement.

## URL or DOI
https://science.nasa.gov/wp-content/uploads/2024/01/luncoordwhitepaper-10-08.pdf (Version 5, 2008-10-01). Version 4: https://pds-imaging.jpl.nasa.gov/documentation/LRO_Coordinate_System.pdf (not opened).

## Date opened
2026-10-19
