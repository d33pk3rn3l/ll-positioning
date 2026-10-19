# petit2010iers: Standard formulas for the mean motion of the Moon and Sun, used here for the length of the lunar day (IERS Conventions 2010, Chapter 5, Petit & Luzum eds., IERS Technical Note 36; chapter version 10 August 2012)

## Claim
Gives the fundamental lunisolar arguments (Delaunay arguments) as polynomials in Barycentric Dynamical Time (TDB), taken from Simon et al. (1994). The mean elongation D of the Moon from the Sun gives the mean synodic month.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Eq. (5.43): "F4 ≡ D = Mean Elongation of the Moon from the Sun = 297.85019547° + 1602961601.209000 t − 6.370600 t^2 + 0.00659300 t^3 − 0.0000316900 t^4" (coefficients of t in arcsec), "where t is measured in Julian centuries of TDB (Simon et al., 1994: Tables 3.4 (b.3) and 3.5 (b))" | International Earth Rotation and Reference Systems Service (IERS) 2010 | mean ecliptic of date | no uncertainty given.
- Eq. (5.43): F = L − Ω = 93.27209062° + 1739527262.847800 t ... | same.
- Mean synodic month [derived]: 360° / (1602961601.209" per 36525 d) = 29.530589 d (at J2000; the t^2 term changes it very slowly).

## Height reference
Not applicable.

## Application to a walking quadruped on the Moon (LunarLeaper)
Sourced synodic month (lunar day length, Sun cycle at the site): 29.530589 d [derived from a primary convention]. The local solar day at the site follows this mean value; true day length varies with the orbit (not quantified here).

## Grade
C (convention/model).

## URL or DOI
https://iers-conventions.obspm.fr/content/chapter5/icc5.pdf (IERS TN36, https://www.iers.org/IERS/EN/Publications/TechnicalNotes/tn36.html)

## Date opened
2026-10-19
