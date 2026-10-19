# Lunar frame definition file for the DE440 ephemeris (NASA Navigation and Ancillary Information Facility, 2025)

Citation key: `naif2025moonfk`. Original name: NAIF lunar frame kernel `moon_de440_250416.tf`. The Navigation and Ancillary Information Facility (NAIF) at the Jet Propulsion Laboratory (JPL) publishes these frame kernels (frame definition files). DE440 is a JPL Development Ephemeris (DE).

## Claim
The file defines the frames `MOON_PA_DE440` (principal axis, PA) and `MOON_ME_DE440_ME421` (mean Earth, ME). The ME frame is closely aligned with the DE421 ME frame. The generic names `MOON_PA` and `MOON_ME` point to them. `IAU_MOON` (from the International Astronomical Union (IAU) orientation series) stays only for backward compatibility. The IAU working group no longer publishes those data.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- `MOON_ME_DE440_ME421` relative to `MOON_PA_DE440`: angles (67.8526, 78.6944, 0.2785) arcsec, axes (3,2,1) | DE440 | PA->ME | values; uncertainty not stated. Sign convention (kernel moon_de440_250416.tf, lines 516-518): "The angles and axis sequence shown below represent the inverse of the cited rotation; hence the angles are negated and the sequence is reversed." The cited rotation is park2021de440 eq. (19) (PA DE440 to DE421 MER). TKFRAME_31009_RELATIVE = 'MOON_PA_DE440', AXES = (3, 2, 1). SPICE Frames Required Reading (naif.jpl.nasa.gov, frames.html, section "Defining a TK Frame Using Euler Angles", opened 2026-10-19): "If M is the matrix that converts vectors relative to the TK frame to the RELATIVE frame by left multiplication, then ... M = [angle_1]axis_1 [angle_2]axis_2 [angle_3]axis_3", with [A]1 = [1 0 0; 0 cos A sin A; 0 -sin A cos A]. So these angles take vector coordinates from MOON_ME_DE440_ME421 to MOON_PA_DE440. This is why the signs here are + and the signs in park2021de440 are -.
- ME-PA rotation angle ≈ 0.02886° ≈ 875 m along a great circle | DE440 | ME vs PA | approximate value.
- `MOON_ME_DE421` vs `MOON_ME_DE440_ME421`: max 5.82e-7 rad (slightly over 1 m) over 1900-2051; max 3.07e-7 rad (≈53.4 cm) over 2000-2040 | DE421 ME vs DE440 ME421 | maximum over ~1M samples. Label for the 53.4 cm: "maximum over 2000-2040, not a sigma".
- `IAU_MOON` vs DE440-based ME, 2000-2040: amplitude ≈0.0051° (≈155 m), mean ≈0.00239° (≈72 m) | IAU and International Association of Geodesy (IAG) series vs DE440 ME | amplitude / average.

## Height reference
Not applicable (frame orientation only).

## Application to a walking quadruped on the Moon (LunarLeaper)
Source for the ~875 m size of an ME/PA frame mistake. Also the source for the DE421-vs-DE440 ME difference: 53.4 cm, maximum over 2000-2040, not a sigma. The old repo used 0.6 m. That is close, but it is not the stated value. Keep this term separate from the ME/PA rotation uncertainty. The file also shows that `IAU_MOON` is off by up to ~155 m. Do not use it for map ties.

## Grade
Model (grade C). Reason: the numbers are NAIF comparisons of one ephemeris model with another. The inputs come from flight data.

## URL or DOI
https://naif.jpl.nasa.gov/pub/naif/pds/wgc/kernels/fk/moon_de440_250416.tf (also generic_kernels/fk/satellites/)

## Date opened
2026-10-19
