# DECISIONS

Log of decisions. Status values: proposed / approved (by PI) / superseded.
Newest at the bottom. Do not edit an approved entry; supersede it.

| ID | Date | Decision | Why | Status | By |
|----|------|----------|-----|--------|----|
| D-000 | 2026-10-19 | Pre-2026-10-19 repo content is an unreviewed baseline. No decision, number or requirement in it is adopted without fresh review. | Clean start; content came from an earlier side experiment. | approved (brief / role setup) | Benedikt |
| D-001 | 2026-10-19 | Keep four knowledge layers separate: local, map-relative, cartographic, inertial. | Different error sources and uses; one number hides what science needs. | proposed | ll-lead |
| D-002 | 2026-10-19 | Every number is labelled sourced / derived / TBD. | Traceability for gates. | proposed | ll-lead |
| D-003 | 2026-10-19 | "50 µGal requirement" and 0.10 m vertical allocation from baseline are not adopted. Gravimetry requirement is TBD until a payload source exists. | No science basis (agreed by prof-payload). | proposed | ll-lead |
| D-004 | 2026-10-19 | The brief's "~10x" is an expectation, not a requirement. The trace table shows per instrument whether science needs it. | prof-payload comment, 2026-10-19. | proposed | ll-lead |
| D-005 | 2026-10-19 | Baseline navigation core (`src/assessment.mjs`) will be replaced, not tuned. No new nav model before G1. | Audit findings (see STATUS.md). | proposed | ll-lead |

## Baseline assertions pending review (not decisions)

These appear in the old repo. They have no status until reviewed:
- Platform is a quadruped.
- Default frame DE440 with DE421-aligned ME.
- Heights as center-of-mass radius, h = r - 1,737,400 m.
- Rover tracks rejected as a geodetic source.
- Assumptions A1, A3-A6 in `src/mission-model.mjs` marked "baseline".
