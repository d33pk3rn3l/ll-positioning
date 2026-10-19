# Lava tube exploration with the LunarLeaper robot (Mittelholz et al. 2026, Advances in Geophysics 67:161-207; arXiv:2609.11453)

Citation key: `mittelholz2026ll`. Original title: "Lava Tube Exploration with LunarLeaper".

## Claim
Concept chapter. LunarLeaper goes to the Marius Hills Pit and the rille next to it. Payload: a gravimeter with heritage from the GRAvimeter for small Solar System bodies (GRASS) (full name as given in `ritter2019grass`), a ground-penetrating radar (GPR) based on the Radar Imager for Mars' Subsurface Experiment (RIMFAX) (full name as given in the source, p. 18), an imager, a spectrometer and leg experiments.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Marius Hills Pit location label 14.1° N, 303.2° E (figure 4 label) | frame not stated.
- Landing site to pit direct distance 256 m; pit-rim observation path 163 m; '50 m rille transition' | Fig. 12 on a mosaic from the Lunar Reconnaissance Orbiter (LRO) Wide Angle Camera (WAC) and Narrow Angle Camera (NAC) | frame not stated | planning values. Note: 256 m is the DIRECT distance, not a walked path length.
- Gravity every 10 m; every 5 m for 50 m across the rille | concept of operations (ConOps) | plan.
- GPR every 10 cm | ConOps | plan.
- Images every 20 m along the path | ConOps | plan.
- Traverse ends <10 m from pit wall or at slope >10°.
- Free-air gradient ≈0.187 mGal/m; elevation knowledge 'less than 0.25 m' for free-air error <0.05 mGal | model | not stated.
- Robot mass ≃30 kg; 12 actuators; slopes up to ±30°; 0.3 m/s nominal, 0.7 m/s peak | design.
- Apollo 17 Traverse Gravimeter Experiment (TGE): 0.035 mGal theoretical resolution vs ~2 mGal operational (cites Buck 1973) | secondary citation.
- GRASS reconstructs full 3-D vector, accuracy 'a few tens of microgals' | secondary description of Noeker et al.
- GPR antenna 'significant gain around ~100 MHz'; RIMFAX itself 150-1200 MHz; forward model Ricker 100 MHz (also tried 250 MHz) | plan/model.
- Anomaly examples: tube 500 m wide, 20 m high, 50 m deep, Δρ = -1500 kg/m³ -> ~1 mGal; 50 m wide tube -> 0.4 mGal | forward model.
- Imager: 0.25 mrad angular resolution for 5 cm at 100 m | requirement.
- Imager, source wording (p. 21): "To resolve structures of ∼5 cm in size across the pit from a distance of 100 meters, an angular resolution of 0.25 mrad is needed." Derived: 0.25 mrad x 100 m = 2.5 cm, so 5 cm is 2 x 2.5 cm. This agrees with two pixels across a 5 cm structure, but the source does not say "pixel" or "two pixels". The source is unclear on this point. Derived (inputs from the same paragraph, "2048x2048 pixels and 40◦ horizontal Field of View"): 40 deg / 2048 pixels = 0.341 mrad per pixel, which is 3.4 cm per pixel at 100 m. This is coarser than 0.25 mrad; the source does not discuss this.
- Derived: net height sensitivity of gravity after free-air and Bouguer corrections = free-air gradient - 2 pi G rho. Inputs: lunar free-air gradient 2g/R with g = 1.6242 m/s^2 (`konopliv2013gl0660b`, derived) and R = 1737.4 km: 2 x 1.6242 / 1 737 400 m = 1.8697e-6 s^-2 = 0.18697 mGal/m. This agrees with the 0.187 mGal/m that the note uses; I compute with 0.187 mGal/m. G = 6.674e-11 m^3 kg^-1 s^-2; rho = 2000 kg/m^3 (assumption from prof-payload review; density TBD, no source yet). 2 pi G rho = 2 x 3.14159 x 6.674e-11 x 2000 = 8.387e-7 s^-2 = 0.0839 mGal/m. Net = 0.187 - 0.0839 = 0.103 mGal/m (about 0.10 mGal/m). Height for 0.05 mGal: 0.05 / 0.103 = 0.485 m (about 0.5 m). Not in source.
- Derived: the source's forward model (p. 13) says a 50 m wide tube "might generate a maximum signal amplitude of 4 · 10−1 mGal" (0.4 mGal; see the anomaly line above). 0.05 mGal / 0.4 mGal = 0.125, so 0.05 mGal is about one eighth of the smallest anomaly in the paper. Not in source.

## Height reference
Not stated for the 0.25 m target. The text speaks of 'relative elevation changes' corrected by free-air and Bouguer corrections.

## Application to a walking quadruped on the Moon (LunarLeaper)
Baseline source for the ConOps. The 0.25 m target is the free-air share only (0.187 mGal/m x 0.25 m ≈ 0.047 mGal < 0.05 mGal). The text does not say if it is 1-sigma or a bound. It does not say if it is relative or absolute (see quote below). It is not tied to a stated anomaly size or station spacing.

## Quote on the 0.25 m height target
"Relative elevation changes are corrected by free-air and Bouguer corrections, which can be done employing a shape model of the Moon and assuming a mean density, while for terrain corrections ... a detailed digital elevation model (DEM) of the region is needed (Henriksen et al., 2017). The lunar free air gradient is ∂g/∂z ≈ 0.187 mGal m−1; hence, to reduce the error in free-air correction to less than 0.05 mGal, a knowledge of the elevation by less than 0.25 m is needed, which needs to be accomplished by a combination of a high resolution DEM and simultaneous location and mapping (SLAM) of the robot."
Reading: the context is relative elevation change (from station to station). But the sentence itself does not say relative or absolute. Statistic: not stated. Anomaly size and spacing: not stated for this target.

## Inconsistencies with other LunarLeaper sources
- Mass ≃30 kg here vs '15 kg-class' in Kolvenbach et al. 2026 (`kolvenbach2026ll`).
- Gravity every 10 m (5 m on rille) here vs 'approximately one-meter intervals' in Kolvenbach et al. 2026.

## Grade
Model (grade C) to opinion (grade D). Reason: mission concept; the numbers are plans or forward models.

## URL or DOI
https://doi.org/10.1016/bs.agph.2026.06.003 ; https://arxiv.org/abs/2609.11453

## Date opened
2026-10-19
