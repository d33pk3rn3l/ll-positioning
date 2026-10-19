# mittelholz2026ll: Lava Tube Exploration with LunarLeaper (Mittelholz et al. 2026, Advances in Geophysics 67:161-207; arXiv:2609.11453)

## Claim
Concept chapter. LunarLeaper targets the Marius Hills Pit (MHP) and rille with gravimeter (GRASS heritage), RIMFAX-based GPR, imager, spectrometer and leg experiments.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- MHP location label 14.1° N, 303.2° E (figure 4 label) | frame not stated.
- Landing site to pit direct distance 256 m; pit-rim observation path 163 m; '50 m rille transition' | Fig. 12 on LRO WAC/NAC mosaic | frame not stated | planning values. Note: 256 m is the DIRECT distance, not a walked path length.
- Gravity every 10 m; every 5 m for 50 m across the rille | ConOps | plan.
- GPR every 10 cm | ConOps | plan.
- Images every 20 m along the path | ConOps | plan.
- Traverse ends <10 m from pit wall or at slope >10°.
- Free-air gradient ≈0.187 mGal/m; elevation knowledge 'less than 0.25 m' for free-air error <0.05 mGal | model | not stated.
- Robot mass ≃30 kg; 12 actuators; slopes up to ±30°; 0.3 m/s nominal, 0.7 m/s peak | design.
- Apollo 17 TGE: 0.035 mGal theoretical resolution vs ~2 mGal operational (cites Buck 1973) | secondary citation.
- GRASS reconstructs full 3-D vector, accuracy 'a few tens of microgals' | secondary description of Noeker et al.
- GPR antenna 'significant gain around ~100 MHz'; RIMFAX itself 150-1200 MHz; forward model Ricker 100 MHz (also tried 250 MHz) | plan/model.
- Anomaly examples: tube 500 m wide, 20 m high, 50 m deep, Δρ = -1500 kg/m³ -> ~1 mGal; 50 m wide tube -> 0.4 mGal | forward model.
- Imager: 0.25 mrad angular resolution for 5 cm at 100 m | requirement.

## Height reference
Not stated for the 0.25 m target. The text speaks of 'relative elevation changes' corrected by free-air and Bouguer corrections.

## Application to a walking quadruped on the Moon (LunarLeaper)
Baseline source for the ConOps. The 0.25 m target is the free-air share only (0.187 mGal/m x 0.25 m ≈ 0.047 mGal < 0.05 mGal). The text does not say whether it is 1-sigma or a bound, and does not say relative or absolute (see quote below). It is not tied to a stated anomaly size or station spacing.

## Quote on the 0.25 m height target
"Relative elevation changes are corrected by free-air and Bouguer corrections, which can be done employing a shape model of the Moon and assuming a mean density, while for terrain corrections ... a detailed digital elevation model (DEM) of the region is needed (Henriksen et al., 2017). The lunar free air gradient is ∂g/∂z ≈ 0.187 mGal m−1; hence, to reduce the error in free-air correction to less than 0.05 mGal, a knowledge of the elevation by less than 0.25 m is needed, which needs to be accomplished by a combination of a high resolution DEM and simultaneous location and mapping (SLAM) of the robot."
Reading: the context is relative elevation change (station-to-station), but the sentence itself does not say relative or absolute. Statistic: not stated. Anomaly size and spacing: not stated for this target.

## Inconsistencies with other LunarLeaper sources
- Mass ≃30 kg here vs '15 kg-class' in Kolvenbach et al. 2026.
- Gravity every 10 m (5 m on rille) here vs 'approximately one-meter intervals' in Kolvenbach et al. 2026.

## Grade
C/D (concept and model). Reason: mission concept; numbers are plans or forward models.

## URL or DOI
https://doi.org/10.1016/bs.agph.2026.06.003 ; https://arxiv.org/abs/2609.11453

## Date opened
2026-10-19
