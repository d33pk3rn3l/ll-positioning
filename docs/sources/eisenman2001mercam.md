# eisenman2001mercam: Mars Exploration Rover engineering cameras (Eisenman, Liebe, Maimone, Schwochert, Willson; JPL)

## Claim
MER Pancam images the Sun to get the Sun vector; with accelerometers this gives rover attitude and north heading.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Expected Sun-vector accuracy in Pancam frame: ≤0.2° at boresight, ≤0.27° at field edge, ≤0.05° relative over 2.5° | design expectation | Pancam frame | bound.
- Pancam angular resolution 0.27 mrad/pixel | design.
- Heading accuracy itself: not stated.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
The old repo value '0.2 mrad' for sun/celestial azimuth is NOT supported. This source gives 0.2° (≈3.5 mrad) for the Sun vector. A lunar sun-sensor heading number is still missing.

## Grade
B (lab/design). Reason: pre-flight design and test values.

## URL or DOI
https://www-robotics.jpl.nasa.gov/media/documents/MER_Cameras.pdf (venue/year not shown in the text I read; likely SPIE 2001 - not verified)

## Date opened
2026-10-19
