# buck1973tge: Design, error budget and flight result of the Apollo 17 traverse gravimeter (Buck 1973, MIT Draper Laboratory report R-739, NASA contractor report CR-128948)
Abbreviations in the title: NASA = National Aeronautics and Space Administration; MIT = Massachusetts Institute of Technology.

## Claim
Design, error budget and flight result of the Apollo 17 Traverse Gravimeter Experiment (TGE): a single-axis vibrating-string accelerometer (VSA) in a temperature-controlled oven on a self-levelling gimbal. Pre-flight 1-sigma budget is about 0.2 mGal on the Moon; flight results give "an instrument accuracy of better than 2 mgal".

## Numbers (with units and conditions)
Format: value | product | frame realization | statistic type. "not stated" = the source does not say.
- Abstract: "This instrument is capable of resolving gravity differences as small as 0.035 milligal ... on the moon" | TGE resolution | n/a | resolution, not noise.
- Abstract: "The flight results indicate an instrument accuracy of better than 2 mgal." | TGE flight | n/a | bound (author statement). Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Abstract: "the VSA temperature never varied more than 0.005 C" (22 lunar measurements) | TGE flight | n/a | bound.
- Quantization: "A quantization in excess of 0.035 mgal per digit ... with an overall accuracy better than 2.0 mgal" | TGE | n/a | bound. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Timing table, Moon-Normal mode: quantization 0.0315 mgal; gravity measurement time 54.5 s; total time after level 126.5 s | TGE | n/a | design values.
- Timing table, Moon-Bias mode: quantization 0.0317 mgal; measurement time 27.2 s; total time after level 63.0 s | TGE | n/a | design values.
- Levelling: "The pendulums level the gimbal assembly to within ± 3 arc minutes of their null." Measurement starts when "within 7 arc minutes"; the system must stay level "for at least 10 to 15 seconds" (settling) and "for approximately 30 seconds" | TGE | local vertical | bound (deadband). Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Levelling error: "With the typical pendulum-VSA angle of 1 arc minute and a typical pendulum deadband of ± 3 arc minutes, the standard deviation of the gravity measured will be: g= 0.04 mgal (moon)" | TGE | n/a | 1-sigma. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Table 9-1 Summary of errors (Moon, 1-sigma terms, mGal): ABias 0.1; ABias f(T) 0.03; G A SF 0.01; G A SF f(T) 0.035; Leveling 0.04; Jitter 0.10; Environment 0.10; Loop Bias 0.10; VSA Amp f(PS) 0.04; VSA Amp f(T) 0.012; total variance 0.0457 mGal^2 (table terms as printed: ABias = random part of bias; SF = scale factor; f(T) = function of temperature; PS = power supply; Amp = amplifier) | TGE pre-flight budget | n/a | 1-sigma, terms assumed independent. Square root of 0.0457 = 0.21 mGal [derived]. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Environment: "We conservatively pick 0.1 mgal as a 1σ error due to Rover vibration (or equivalent surface motion)" | TGE | n/a | 1-sigma (author judgement). Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Shock: "Post-flight analysis implied, however, that Rover-deployment shifts were the greatest error sources although no exact cause could be found." | TGE flight | n/a | qualitative. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.
- Flight vs budget: flight accuracy "better than 2 mgal" vs budget ~0.2 mGal [derived] -> flight is about 10x worse than the budget. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.

## Height reference
Not applicable (instrument report).

## Application to a walking quadruped on the Moon (LunarLeaper)
Only flown lunar traverse gravimeter. Two lessons for the nav budget: (1) a levelled single-axis gravimeter needs tilt below ~3 arcmin (~0.9 mrad [derived]) for a 0.04 mGal levelling error; (2) the flown result was limited by handling/deployment shifts, not by levelling. A walking robot that kneels or stands at each station has the same handling risk. Station time per reading on the Moon: ~1-2 min after levelling. Levelling residual 0.2 mrad (team assumption): NOT supported by this source; the source gives a ±3 arcmin (~0.87 mrad [derived]) deadband. Label: history, different instrument (levelled vertical-component gravimeter); not a LunarLeaper default.

## Grade
A (flight instrument, flight results) for the 2 mGal result; C (model) for the pre-flight Table 9-1 budget.

## URL or DOI
https://ntrs.nasa.gov/citations/19730015763 (PDF 19730015763.pdf, opened). The Apollo 17 Preliminary Science Report (PSR) chapter 13 (Talwani et al. 1973) did NOT download (transport layer security (TLS) error / partial file); its "rms value of 1.8 mgal" is seen only in a search snippet.

## Date opened
2026-10-19
