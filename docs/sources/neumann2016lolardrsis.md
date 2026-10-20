# Data format document of the Lunar Orbiter Laser Altimeter for reduced data and derived products (Neumann, version 2.6, 11 March 2016, NASA Planetary Data System)

Citation key: `neumann2016lolardrsis`. Original title: "Lunar Reconnaissance Orbiter Lunar Orbiter Laser Altimeter Reduced Data Record and Derived Products Software Interface Specification", version 2.6, March 11, 2016. Prepared by Gregory A. Neumann (LOLA co-investigator, NASA Goddard Space Flight Center (GSFC)). Abbreviations: LOLA = Lunar Orbiter Laser Altimeter; LRO = Lunar Reconnaissance Orbiter; PDS = Planetary Data System; GDR = gridded data record; RDR = reduced data record; DE421 = Development Ephemeris 421 of the Jet Propulsion Laboratory.

## Claim
The format document of the LOLA products states that LOLA grid heights are given relative to a reference sphere of radius 1737.4 km. The sample GDR label uses the coordinate system "MEAN EARTH/POLAR AXIS OF DE421". This is a product convention, not a measurement.

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Reference sphere radius 1737.4 km. Quote (Section 5.4, sample GDR label for product LDEM_64, pages 33-34): "Map values are relative to a radius of 1737.4 km." and "OFFSET = 1737400." with the label note "where OFFSET is the radius of a reference sphere." Map projection radii: "A_AXIS_RADIUS = 1737.4 <km>", "B_AXIS_RADIUS = 1737.4 <km>", "C_AXIS_RADIUS = 1737.4 <km>" | LOLA GDR (sample label) | "MEAN EARTH/POLAR AXIS OF DE421" | defined value, no uncertainty.
- Geoid radius convention. Quote (Section 5.1, column SELENOID_RADIUS of the RDR format, page 17): "Equipotential radius (geoid) at Spot 1, relative to an equipotential surface whose mean equatorial radius is 1737.4 kilometers." The label note also says: "By convention, the average GEOID_RADIUS at the equator is OFFSET." | LOLA RDR | as above | defined value.
- Frame. Quote (Section 2.4.3): "The ME reference system is used for all LRO archival data." (ME = mean Earth.) The sample labels give "COORDINATE_SYSTEM_NAME = "MEAN EARTH/POLAR AXIS OF DE421"".

## Height reference
Sphere 1737.4 km (height = planetary radius minus 1737400 m). The document also defines a height above the geoid (planetary radius minus geoid radius). These two height references are different. Do not mix them.

## Application to a walking quadruped on the Moon (LunarLeaper)
This source supports the height reference `sphere_1737400m` for LOLA grid heights, in the mean Earth frame of DE421. It replaces archinal2018wgccre for this point, because only the abstract of that report was read. The value is a definition: it has no error. A height from a LOLA grid is a radius minus 1737.4 km. It is not a height above the geoid. The 1737.4 km in the label is the sample label for one product; check the label of each product that we use.

## Grade
Model or convention (grade C). Reason: a product format document, not a measurement.

## URL or DOI
https://pds-geosciences.wustl.edu/lro/lro-l-lola-3-rdr-v1/lrolol_1xxx/document/rdrsis.pdf (PDF file dated 2 March 2023 on the server; document version 2.6, 11 March 2016).

## Date opened
2026-10-19
