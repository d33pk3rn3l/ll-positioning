# Reading list from Benedikt, checked by ll-scout

**Reading guide from Benedikt, not a source. Claims unverified until a note in docs/sources/ confirms them.**

Source: Benedikt's curated list (five sections, received 2026-10-19 in full; an earlier copy was cut off at "Bourgoin et a"). Checked 2026-10-19 by ll-scout.

Status values: **verified** (paper exists, claimed numbers match), **number differs** (paper exists, a claim does not match), **misattributed** (paper exists, author/year/venue on the list is wrong), **exists, not read** (metadata checked only), **not found**, **not yet opened**.

Priority order (ll-lead): Mittelholz 2026, Noeker & Karatekin 2022, Kolvenbach 2026, James 2020, Archinal 2018, Lunar Reconnaissance Orbiter (LRO) white paper 2008, ground-penetrating radar (GPR) specification source, then the rest.

## Mission baseline and concept of operations (ConOps)

| Item | Status | Note | Check result |
|---|---|---|---|
| Mittelholz et al. 2026, Lava Tube Exploration with LunarLeaper, Advances in Geophysics | verified, with caveats | mittelholz2026ll | 256 m is the DIRECT landing-site-to-pit distance (not a "rille crossing"); 163 m pit-rim path; 10 m / 5 m gravity; 10 cm GPR; images every 20 m; <0.25 m elevation for <0.05 mGal free-air error (statistic and relative/absolute not stated); 12 actuators. Mass ≃30 kg here. |
| Kolvenbach et al. 2026, Acta Astronautica 240 | number differs | kolvenbach2026ll | Paper says "15 kg-class legged robot", not ~30 kg. Leg type (mammal vs spider) still open; leg count not stated. The numbered objectives in the paper are mission science objectives, not objectives of our work package. Gravity at ~1 m intervals (conflicts with Mittelholz 10 m). |
| Mittelholz et al. 2024, LunarLeaper - Unlocking a Subsurface World (European Geosciences Union (EGU) / German Aerospace Center (DLR)) | not yet opened | - | - |
| Arm et al. 2023, Science Robotics 8(80) | exists, not read | - | DOI 10.1126/scirobotics.ade9548 confirmed. |

## Flow-down of payload requirements

| Item | Status | Note | Check result |
|---|---|---|---|
| Noeker et al. 2022, GRASS (full name: TBD - check) rotation mechanism, 46th Aerospace Mechanisms Symposium (AMS) | not found | - | No record found in Crossref. Related GRASS papers exist (Noeker et al. 2024 CEAS Space Journal 17:755, spring design; Ritter et al. Europlanet Science Congress (EPSC) 2022-1115) - not opened. 3D vector claim: Mittelholz 2026 states GRASS reconstructs the full 3-D vector and needs no levelling (secondary). Attitude knowledge requirement: not found. |
| Noeker & Karatekin 2022, wedge-pentahedra method (WPM), Frontiers in Space Technologies 3 | verified (exists); claim partly unsupported | noeker2022wpm | Paper has sensitivity to the resolution of the digital elevation model (DEM) only for Phobos with an artificial DEM. No robot-to-terrain registration error analysis, no steep pit case, no lunar case. |
| James et al. 2020, arXiv:2009.03514 | number differs | james2020artemis | Paper uses 0.18 mGal/m, not 0.187 (0.187 is in Mittelholz 2026). Recommends elevation better than 1 m. |
| Carroll 2020, Lunar Surface Science Workshop (LSSW) abstract 5151 | exists, not read | - | Opened first page only: Canadensys, VectorGrav, "anticipated repeatability of 0.3 mGal on the Moon". Not written up. |
| Urbancic et al. 2016, NASA Technical Reports Server (NTRS) (Apollo 17 Traverse Gravimeter Experiment (TGE), 0.035 mGal sensor vs ~2 mGal) | number differs | urbancic2017a17 | The 2016 item is abstract 1790 of the Lunar and Planetary Science Conference (LPSC); neither it nor the 2017 paper in the Journal of Geophysical Research (JGR) (excerpts) gives 0.035 mGal. 0.035 mGal appears in Mittelholz 2026 citing Buck 1973. TGE instrumental uncertainty ~1.8 mGal. |
| Lewis et al. 2019, Science 363(6426) | exists, not read | - | DOI 10.1126/science.aat0738 confirmed. |
| Hamran et al. 2020, RIMFAX (full name: TBD - check), Space Science Reviews 216 | exists, not read | - | DOI 10.1007/s11214-020-00740-4 (216:128). 150-1200 MHz stated in Mittelholz 2026 (secondary). LunarLeaper ~100 MHz: Mittelholz says "significant gain around ~100 MHz"; Kolvenbach does not state a frequency. |
| Esmaeili et al. 2020, TubeX, JGR Planets 125(5) | exists, not read | - | DOI 10.1029/2019JE006138 confirmed. |

## Reference frames and time

| Item | Status | Note | Check result |
|---|---|---|---|
| Archinal et al. 2018, report 2015 of the Working Group on Cartographic Coordinates and Rotational Elements (WGCCRE), Celestial Mechanics and Dynamical Astronomy 130 | exists, body not read | archinal2018wgccre | Full text not reachable (errors on the server of the United States Geological Survey (USGS)). |
| LRO Project white paper 2008 | verified | lrolgcwg2008 | Mean Earth (ME) frame for products; angles of Development Ephemeris DE421; 1737.4 km sphere. |
| "Bourgoin et al. 2024", arXiv:2409.10043 | misattributed; number differs | fienga2024lunarframes | Authors are Fienga, Rambaux & Sośnica; title "... in the context of the ESA Programme Moonlight". Gives Lunar Coordinate Time minus Terrestrial Time (TCL-TT) 58.7 µs/day and -2.7 µs/day surface term (56 not printed). Compares DE421, DE440, INPOP; DE430 not covered. Clock rate 56.02 µs/day verified in Ashby & Patla 2024 (ashby2024clock). |
| "Christian et al. 2022", NAVIGATION 69(3) | misattributed | - | The paper "Deterministic Heading-Independent Celestial Localization Measurement Model", NAVIGATION 69(3), navi.529, is by Jovanovic & Enright. Not opened. |
| Gammell et al. 2013, IEEE Aerospace | exists, not read | - | DOI 10.1109/AERO.2013.6496953 confirmed. |

## Orbital basemaps and geodetic ties

| Item | Status | Note | Check result |
|---|---|---|---|
| Henriksen et al. 2017, Icarus 283 | exists; companion paper at the International Society for Photogrammetry and Remote Sensing (ISPRS) 2016 verified | henriksen2016nac | Icarus 283:122-137 confirmed (not opened). ISPRS version: relative vertical precision (linear error, 90 %) 0.5-2 x pixel scale - consistent with the claim "~0.5-2 m" only for digital terrain models (DTM) with 1 m pixels; claim units differ (multiples of pixel scale, not metres). |
| "Manheim et al. 2026", Remote Sensing 18(3) 525 | misattributed; numbers verified | collins2026nacmosaics | First author Collins; Manheim not an author. 5.2-31.1 m (mean, uncontrolled) and <12 m lat / <5 m lon (MEDIAN, controlled) match. |
| Haase et al. 2019, ISPRS XLII-2/W13 | exists, not read | - | Actual title: "Bundle adjustment of spaceborne double-camera push-broom imagers and its application to LROC NAC imagery", pp. 1397-1404 (LROC NAC = Lunar Reconnaissance Orbiter Camera, Narrow Angle Camera). |
| "Gläser et al. 2014", co-registration of laser altimeter tracks with DTMs | exists, year differs | - | Planetary and Space Science 89:111-117, 2013 (DOI 10.1016/j.pss.2013.09.012). Not opened. |
| "Cremons et al. 2025", LPSC abstract 1704 | misattributed; verified content | barker2025lolalra | First author Barker. Geolocation ~14 m (Apollo), some tens of metres peak-to-peak (small laser retroreflector arrays, mini-LRA). |
| Speyerer et al. 2012, LROC featured image | not yet opened | - | At most opinion (grade D) if used. |

## Odometry compared with post-processing

| Item | Status | Note | Check result |
|---|---|---|---|
| Bloesch et al. "2013", Robotics: Science and Systems (RSS) VIII | verified (year differs) | bloesch2012legged | RSS VIII is 2012. Absolute position and yaw unobservable: confirmed (quote in note). |
| Wisth, Camurri & Fallon 2022, VILENS (full name: TBD - check), IEEE Transactions on Robotics (T-RO) | exists, not read | - | T-RO 39(1):309-326, issue dated 2023. |
| Liu et al. 2014, Science China 57(2) | exists, volume differs | - | Science China Physics, Mechanics & Astronomy 58(1), 2015 (online 2014-11-15), DOI 10.1007/s11433-014-5612-0. Not opened. |
| "Li et al. 2015", Photogrammetric Engineering & Remote Sensing (PE&RS) | misattributed | - | PE&RS 77(8):781-791, 2011, by Di, Liu & Yue. Not opened. |
| Baik et al. 2025, MarsLGPR, arXiv:2503.04944 | misattributed | - | arXiv 2503.04944 exists but is by Anja Sheppard & Katherine A. Skinner (U. Michigan). Mars-analog wheeled robot, 500 MHz NOGGIN GPR; GPR displacement root mean square error (RMSE) 13-18 mm vs wheel 21-30 mm (cumulative, Table 2). Not written up as a note. 'Baik' may come from Baikovitz (CMU-GPR dataset of Carnegie Mellon University, cited reference 5). |
| Dellaert & Kaess 2017, Factor Graphs for Robot Perception | not yet opened | - | Textbook; one-line ref only. |
| Barfoot 2024, State Estimation for Robotics 2nd ed. | not yet opened | - | Textbook; one-line ref only. |
