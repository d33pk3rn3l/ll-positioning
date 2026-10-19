# Reading list (Benedikt)

**Reading guide from Benedikt, not a source. Claims unverified until a note in docs/sources/ confirms them.**

Source: Benedikt's curated list (5 sections, received 2026-10-19 in full; an earlier copy was cut off at "Bourgoin et a"). Checked 2026-10-19 by ll-scout.

Status values: **verified** (paper exists, claimed numbers match), **number differs** (paper exists, a claim does not match), **misattributed** (paper exists, author/year/venue on the list is wrong), **exists, not read** (metadata checked only), **not found**, **not yet opened**.

Priority order (ll-lead): Mittelholz 2026, Noeker & Karatekin 2022, Kolvenbach 2026, James 2020, Archinal 2018, LRO white paper 2008, GPR spec source, then the rest.

## 1. Mission baseline and ConOps

| Item | Status | Note | Check result |
|---|---|---|---|
| Mittelholz et al. 2026, Lava Tube Exploration with LunarLeaper, Adv. Geophys. | verified, with caveats | mittelholz2026ll | 256 m is the DIRECT landing-site-to-pit distance (not a "rille crossing"); 163 m pit-rim path; 10 m / 5 m gravity; 10 cm GPR; images every 20 m; <0.25 m elevation for <0.05 mGal free-air error (statistic and relative/absolute not stated); 12 actuators. Mass ≃30 kg here. |
| Kolvenbach et al. 2026, Acta Astronautica 240 | number differs | kolvenbach2026ll | Paper says "15 kg-class legged robot", not ~30 kg. Leg type (mammal vs spider) still open; leg count not stated. O1-O6 are science objectives, not WP objectives. Gravity at ~1 m intervals (conflicts with Mittelholz 10 m). |
| Mittelholz et al. 2024, LunarLeaper - Unlocking a Subsurface World (EGU/DLR) | not yet opened | - | - |
| Arm et al. 2023, Science Robotics 8(80) | exists, not read | - | DOI 10.1126/scirobotics.ade9548 confirmed. |

## 2. Payload requirements flow-down

| Item | Status | Note | Check result |
|---|---|---|---|
| Noeker et al. 2022, GRASS rotation mechanism, 46th AMS | not found | - | No record found in Crossref. Related GRASS papers exist (Noeker et al. 2024 CEAS Space J. 17:755, spring design; Ritter et al. EPSC2022-1115) - not opened. 3D vector claim: Mittelholz 2026 states GRASS reconstructs the full 3-D vector and needs no levelling (secondary). Attitude knowledge requirement: not found. |
| Noeker & Karatekin 2022, WPM, Front. Space Technol. 3 | verified (exists); claim partly unsupported | noeker2022wpm | Paper has DEM-resolution sensitivity only for Phobos with an artificial DEM. No robot-to-terrain registration error analysis, no steep pit case, no lunar case. |
| James et al. 2020, arXiv:2009.03514 | number differs | james2020artemis | Paper uses 0.18 mGal/m, not 0.187 (0.187 is in Mittelholz 2026). Recommends elevation better than 1 m. |
| Carroll 2020, LSSW abstract 5151 | exists, not read | - | Opened first page only: Canadensys, VectorGrav, "anticipated repeatability of 0.3 mGal on the Moon". Not written up. |
| Urbancic et al. 2016, NTRS (Apollo 17 TGE, 0.035 mGal sensor vs ~2 mGal) | number differs | urbancic2017a17 | 2016 item is LPSC abstract 1790; neither it nor the 2017 JGR paper (excerpts) gives 0.035 mGal. 0.035 mGal appears in Mittelholz 2026 citing Buck 1973. TGE instrumental uncertainty ~1.8 mGal. |
| Lewis et al. 2019, Science 363(6426) | exists, not read | - | DOI 10.1126/science.aat0738 confirmed. |
| Hamran et al. 2020, RIMFAX, SSR 216 | exists, not read | - | DOI 10.1007/s11214-020-00740-4 (216:128). 150-1200 MHz stated in Mittelholz 2026 (secondary). LunarLeaper ~100 MHz: Mittelholz says "significant gain around ~100 MHz"; Kolvenbach does not state a frequency. |
| Esmaeili et al. 2020, TubeX, JGR Planets 125(5) | exists, not read | - | DOI 10.1029/2019JE006138 confirmed. |

## 3. Reference frames and time

| Item | Status | Note | Check result |
|---|---|---|---|
| Archinal et al. 2018, WGCCRE 2015, CMDA 130 | exists, body not read | archinal2018wgccre | Full text not reachable (USGS TLS errors). |
| LRO Project white paper 2008 | verified | lrolgcwg2008 | ME for products; DE421 angles; 1737.4 km sphere. |
| "Bourgoin et al. 2024", arXiv:2409.10043 | misattributed; number differs | fienga2024lunarframes | Authors are Fienga, Rambaux & Sośnica; title "... in the context of the ESA Programme Moonlight". Gives TCL-TT 58.7 µs/day and -2.7 µs/day surface term (56 not printed). Compares DE421, DE440, INPOP; DE430 not covered. Clock rate 56.02 µs/day verified in Ashby & Patla 2024 (ashby2024clock). |
| "Christian et al. 2022", NAVIGATION 69(3) | misattributed | - | The paper "Deterministic Heading-Independent Celestial Localization Measurement Model", NAVIGATION 69(3), navi.529, is by Jovanovic & Enright. Not opened. |
| Gammell et al. 2013, IEEE Aerospace | exists, not read | - | DOI 10.1109/AERO.2013.6496953 confirmed. |

## 4. Orbital basemaps and geodetic ties

| Item | Status | Note | Check result |
|---|---|---|---|
| Henriksen et al. 2017, Icarus 283 | exists; ISPRS 2016 companion verified | henriksen2016nac | Icarus 283:122-137 confirmed (not opened). ISPRS version: relative vertical precision (linear error, 90 %) 0.5-2 x pixel scale - consistent with the claim "~0.5-2 m" only for 1 m-pixel DTMs; claim units differ (multiples of pixel scale, not metres). |
| "Manheim et al. 2026", Remote Sensing 18(3) 525 | misattributed; numbers verified | collins2026nacmosaics | First author Collins; Manheim not an author. 5.2-31.1 m (mean, uncontrolled) and <12 m lat / <5 m lon (MEDIAN, controlled) match. |
| Haase et al. 2019, ISPRS XLII-2/W13 | exists, not read | - | Actual title: "Bundle adjustment of spaceborne double-camera push-broom imagers and its application to LROC NAC imagery", pp. 1397-1404. |
| "Gläser et al. 2014", co-registration of laser altimeter tracks with DTMs | exists, year differs | - | Planet. Space Sci. 89:111-117, 2013 (DOI 10.1016/j.pss.2013.09.012). Not opened. |
| "Cremons et al. 2025", LPSC 1704 | misattributed; verified content | barker2025lolalra | First author Barker. Geolocation ~14 m (Apollo), 10s of m p-p (mini-LRAs). |
| Speyerer et al. 2012, LROC featured image | not yet opened | - | Grade D at most if used. |

## 5. Odometry vs post-processing

| Item | Status | Note | Check result |
|---|---|---|---|
| Bloesch et al. "2013", RSS VIII | verified (year differs) | bloesch2012legged | RSS VIII is 2012. Absolute position and yaw unobservable: confirmed (quote in note). |
| Wisth, Camurri & Fallon 2022, VILENS, IEEE T-RO | exists, not read | - | T-RO 39(1):309-326, issue dated 2023. |
| Liu et al. 2014, Science China 57(2) | exists, volume differs | - | Sci. China Phys. Mech. Astron. 58(1), 2015 (online 2014-11-15), DOI 10.1007/s11433-014-5612-0. Not opened. |
| "Li et al. 2015", PE&RS | misattributed | - | PE&RS 77(8):781-791, 2011, by Di, Liu & Yue. Not opened. |
| Baik et al. 2025, MarsLGPR, arXiv:2503.04944 | misattributed | - | arXiv 2503.04944 exists but is by Anja Sheppard & Katherine A. Skinner (U. Michigan). Mars-analog wheeled robot, 500 MHz NOGGIN GPR; GPR displacement RMSE 13-18 mm vs wheel 21-30 mm (cumulative, Table 2). Not written up as a note. 'Baik' may come from Baikovitz (CMU-GPR dataset, cited ref 5). |
| Dellaert & Kaess 2017, Factor Graphs for Robot Perception | not yet opened | - | Textbook; one-line ref only. |
| Barfoot 2024, State Estimation for Robotics 2nd ed. | not yet opened | - | Textbook; one-line ref only. |
