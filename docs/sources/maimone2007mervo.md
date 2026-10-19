# Two years of visual odometry on the Mars Exploration Rovers (Maimone, Cheng & Matthies 2007, Journal of Field Robotics 24(3))

Citation key: `maimone2007mervo`. Original title: "Two Years of Visual Odometry on the Mars Exploration Rovers".

## Claim
Visual odometry (VO) on the Mars Exploration Rovers (MER) converged 97 % (Spirit) and 95 % (Opportunity) of the time. It detected slip up to 125 % and measured changes as small as 2 mm. Wheel odometry alone was more than the 10 % budget on slippery terrain.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- MER design goal: position error ≤10 % of a 100 m drive | requirement.
- VO error <1 % of distance on a 2.45 m rock course with up to 85 % slip | Earth test, MER engineering model | not stated.
- VO absolute position error <2.5 % over 24 m (Marsyard), <1.5 % over 29 m (Johnson Valley) | Earth tests | not stated.
- Slip up to 125 % measured on Spirit, Sol 206 (Mars day 206), >25° slope | Mars flight.
- VO convergence 97 % / 95 % | Mars flight.

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Reference for wheeled rovers. On loose slopes wheel odometry fails. VO stays at ~1-2 % of distance in Earth tests. For a 256 m approach this is ~3-5 m. No value for a legged robot on the Moon is in this batch.

## Grade
Flight data (grade A) for the convergence and slip numbers on Mars. Lab or analog (grade B) for the percent error numbers.

## URL or DOI
https://doi.org/10.1002/rob.20184 ; PDF https://www-robotics.jpl.nasa.gov/media/documents/rob-06-0081.R4.pdf

## Date opened
2026-10-19
