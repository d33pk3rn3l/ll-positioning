# Engineering cameras of the Mars Exploration Rovers (Eisenman, Liebe, Maimone, Schwochert, Willson; Jet Propulsion Laboratory)

Citation key: `eisenman2001mercam`. Original title: "Mars Exploration Rover Engineering Cameras".

## Claim
The panoramic camera (Pancam) of the Mars Exploration Rovers (MER) images the Sun to get the Sun vector. With accelerometers, this gives rover attitude and north heading.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Expected accuracy of the Sun vector in the Pancam frame: ≤0.2° at boresight, ≤0.27° at field edge, ≤0.05° relative over 2.5° | design expectation | Pancam frame | bound.
- Pancam angular resolution 0.27 mrad/pixel | design.
- Heading accuracy itself: not stated.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
The source does NOT support the old repo value '0.2 mrad' for Sun or celestial azimuth. This source gives 0.2° (≈3.5 mrad) for the Sun vector. A heading number for a Sun sensor on the Moon is still missing.

## Grade
Lab or analog (grade B). Reason: design and test values before flight.

## URL or DOI
https://www-robotics.jpl.nasa.gov/media/documents/MER_Cameras.pdf (venue and year not shown in the text I read; possibly SPIE 2001 - not verified)

## Date opened
2026-10-19
