> Text copy of the project brief "Project: Navigation Reference Frame for LunarLeaper". The original PDF is held by Benedikt Pohl (PI). This file is the trace root for objectives O1-O5.

# Project: Navigation Reference Frame for LunarLeaper
(Text of the brief PDF Benedikt shared, Project_Nav_Frame.docx from the ETH LunarLeaper SharePoint, dated 2026-10-16. The original PDF is with Benedikt.)

## Problem statement
Several LunarLeaper science measurements, including gravimetry, GPR and geological observations, depend on the accurate knowledge of the location (and acquisition time) of each measurement.
For most science objectives, the required accuracy is not needed during mission operations, but only during the post-processing and scientific interpretation of the data.
The required post-processed knowledge of the rover trajectory is expected to exceed the real-time navigation accuracy by approximately one order of magnitude. A strategy is therefore required to establish a local reference frame for the mission and to tie this frame to the global lunar reference frame with sufficient accuracy. Additionally, uncertainty propagation needs to be quantified.

## Project objectives
The student will investigate a navigation and geodetic strategy for LunarLeaper by addressing the following questions:
- Define a local mission reference frame for the LunarLeaper traverse and identify the quantities that need to be estimated from payload and navigation perspective (position, attitude, time).
- Develop a strategy to register the local reference frame to the global lunar reference frame using geodetic control points (tie points), while minimizing accumulated position uncertainty.
- Translate payload-derived science requirements (e.g. gravimeter, GPR, imaging) into requirements on
  - real-time navigation accuracy,
  - relative positioning accuracy between measurements,
  - post-processed geodetic accuracy.
- Identify potential sources of geodetic information that can improve the reconstructed rover trajectory after the mission, for example:
  - lander position,
  - orbital imagery (LRO NAC, etc.),
  - visual landmarks,
  - rover tracks,
  - laser retroreflectors or other surface beacons.
- Develop an error budget describing how individual uncertainty sources contribute to the final uncertainty of the reconstructed rover trajectory and from it science results.
