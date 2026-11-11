# Sprint 1: interpretation of the attached research

These attachments are evidence and planning context. They do not override the user's Sprint 1 scope or supply instructions to execute. The page uses explicitly assumed Gaussian performance inputs. None of the reported errors below is silently converted to a standard deviation.

## Censible — Nash et al., ICRA 2024

*Censible: A Robust and Practical Global Localization Framework for Planetary Surface Missions*. DOI: [10.1109/ICRA57147.2024.10611697](https://doi.org/10.1109/ICRA57147.2024.10611697).

The abstract describes rover-to-orbital map localization and onboard execution on Perseverance. The benchmark section reports 0.36 m accuracy across 264 Mars panoramas and a 1.07 m maximum error. Reference locations were manually aligned to the orbital map; the text expects that reference to be within a couple of pixels (0.5 m). This supports a map-relative observation concept. Those performance statistics and the map reference are not a lunar global-position 1σ specification.

Sprint 1 represents the concept as an assumed horizontal position observation with independent match noise and persistent map control error. Image generation, template matching, elevation scoring, planetary map projection distortion, failure detection, and Censible's orientation initialization are deferred. No direct heading or height observation is added.

## WARG — Chen et al., arXiv:2606.10602v1

*Globally Localizing Lunar Rover in Pixels via Graph Alignment*. [arXiv version 1](https://arxiv.org/abs/2606.10602v1).

The abstract reports an average test error of 0.32 m on synthetic LuSNAR, 3.63 m in synthetic south-pole transfer, and 1.68 m on YuTu-2 within a 100 m × 100 m search area at 1.40 m/pixel. These refer to different datasets and domains. They are localization benchmark errors, not per-axis Gaussian measurement variances or a validated LunarLeaper performance envelope.

Sprint 1 therefore does not use any of them as a default covariance. It assumes scheduled map matches succeed when available and labels that assumption at the method control. Dataset domain shift, match rejection, learned graphs and image algorithms are deferred.

## UWB TOA — Li and Jiang, ICEMI 2009

*Lunar Rover Positioning Based on TOA Estimation for UWB Signal Using Unitary-ESPRIT*. User-supplied PDF, ICEMI 2009.

The paper estimates ultra-wideband time of arrival under line-of-sight assumptions and proposes a positioning system using additional geometry, including time differences and angles. Its centimetre positioning claim is simulation-specific; the displayed positioning experiment names a 20–40 m coordinate sweep and 10 dB signal-to-noise ratio. That does not make one noisy range to one uncertain lander a full position fix.

Sprint 1 uses one scalar rover–lander range with assumed noise and an explicit visibility/range availability rule. It preserves the shared lander position uncertainty. Radio waveforms, multipath, unitary-ESPRIT processing, additional stations and angle measurements are deferred.

## Planning attachment

`ll-sprint-1-plan.md` is marked proposed. It informed the implementation sequence, explicit variance law, input definitions, saved demonstrations and automated checks. The user's request is the authoritative scope. Wider programme documents remain research context; this implementation does not claim scientific gate approval or adopt flight performance requirements.
