# CHARTER: LunarLeaper Navigation Reference Frame

Status: DRAFT v0.1 (2026-10-19). Approval: Benedikt Pohl (PI), pending.
Owner: ll-lead.

## 1. Purpose

Gravimetry, GPR and geology measurements need the place and time of each
measurement. This accuracy is needed in post-processing, not during
operations. The brief expects the post-processed trajectory to be about 10x
more accurate than real-time navigation. This work package defines the frames,
requirements, geodetic sources and error budget that make this possible.

## 2. Objectives and outcomes

| ID | Objective (from brief) | Outcome (deliverable) | Gate |
|----|------------------------|-----------------------|------|
| O1 | Define a local mission frame and the estimated quantities (position, attitude, time). | `docs/frames.md`: frame definitions, state vector, the four knowledge layers, height convention, time scale. PDF handout. | G1 |
| O2 | Register the local frame to the global lunar frame via geodetic tie points, with minimum accumulated uncertainty. | `docs/registration.md`: tie-point types, transform model, observability, accumulated uncertainty per layer. PDF handout. | G2 |
| O3 | Translate gravimeter, GPR and imaging needs into requirements on real-time accuracy, relative accuracy between measurements, and post-processed geodetic accuracy. | `docs/requirements-trace.md`: trace table (science objective, instrument, physical relation, source, nav quantity, layer, time scale, RT / relative / post-processed value, "needs ~10x?"). | G1 |
| O4 | Identify post-mission geodetic information sources. | `docs/sources-assessment.md`: lander position, LRO NAC imagery, visual landmarks, rover tracks, retroreflectors/beacons; each with accuracy, layer, availability, grade. | G2 |
| O5 | Error budget that propagates each source to trajectory and science results. | `docs/error-budget.md` plus code in `src/` that regenerates every number. Allocation per layer and per instrument. | G3 |

## 3. Scope

In scope: frame and state definitions; requirements derived from payload
science; registration concept; geodetic source assessment; first-order error
budget and the code that reproduces it.

Out of scope (unless Benedikt decides otherwise): flight software; real-time
filter implementation; hardware selection; mission operations planning beyond
what the error budget needs; the platform choice itself (input, not output).

## 4. Roles

| Role | Who | Owns |
|------|-----|------|
| PI, decides | Benedikt Pohl | Go/no-go, scope, approval of charter, requirements and gates |
| Nav Lead / Systems Engineer | ll-lead | CHARTER, STATUS, DECISIONS, trace table, error-budget structure, gate packages, planning and delegation |
| Research Software Engineer | ll-engineer | `src/`, `tests/`, CI, Pages, scripts that regenerate every figure and number |
| Research Scout | ll-scout | `docs/sources/`, `refs.bib` |
| Reviewer, geodesy | prof-geodesy | Independent review of O1, O2, O4 and O5 error-budget math |
| Reviewer, payload science | prof-payload | Independent review of O3 and science side of O5 |

Reviewers never edit what they review. Nobody merges their own PR. ll-lead does
not approve its own gate.

## 5. Norms

1. Four knowledge layers stay separate: local, map-relative, cartographic,
   inertial. Never collapse them into one accuracy number.
2. Every number carries a label: **sourced** (with ref key), **derived** (with
   script or calculation), or **TBD**.
3. Biases and noise stay separate. A bias is not added into a 1-sigma value.
4. No requirement without a science trace. Missing instrument specs are TBD.
5. Every number in a doc is reproducible from a committed script and a clean clone.
6. Work is tracked as GitHub issues with done-criteria. One change per PR.
7. Team communication happens in the "Lunar Leaper Research" group chat.
8. Plan: each Monday, at most 5 items, each mapped to O1-O5.
9. Style: Simplified Technical English. Equations go in PDF handouts.
10. The pre-2026-10-19 repo content is an unreviewed baseline. Nothing in it is
    adopted without fresh review (see DECISIONS.md D-000).

## 6. Gates

General rule for every gate: both professors give at least "pass with review
items", no major review item is open, and Benedikt gives go/no-go.

### G1: Frame and requirements (O1, O3)

Entry criteria:
- `docs/frames.md` complete: local frame, state vector (position, attitude,
  time), four layers, height and time conventions.
- `docs/requirements-trace.md` complete for gravimeter, GPR and imaging. Every
  cell labelled sourced / derived / TBD.
- Frame and payload source notes in `docs/sources/`, graded.
- Baseline code bugs closed; unsourced baseline numbers labelled in code.

Exit criteria:
- prof-geodesy (O1) and prof-payload (O3): pass or pass with review items, no open majors.
- Benedikt approves requirements. Approved items logged in DECISIONS.md.

### G2: Registration and sources (O2, O4)

Entry criteria:
- G1 passed.
- `docs/registration.md` complete: tie-point types, transform model,
  observability, accumulated uncertainty per layer (back-of-envelope plus script).
- `docs/sources-assessment.md` covers all five O4 source types with accuracy,
  layer, availability and grade.

Exit criteria:
- prof-geodesy: pass or pass with review items, no open majors.
- prof-payload: confirms O4 sources support O3 requirements.
- Benedikt go.

### G3: Error budget (O5)

Entry criteria:
- G2 passed.
- `docs/error-budget.md` complete: every source propagated to trajectory (per
  layer) and to each science result; allocations versus G1 requirements.
- All budget numbers reproduced by CI from a clean clone.

Exit criteria:
- prof-geodesy (math) and prof-payload (science impact): pass or pass with
  review items, no open majors.
- Benedikt go.

## 7. Open questions for the PI

- Q1: Is the platform confirmed as a walking quadruped?
- Q2: Brief text is in docs/brief.md (original PDF with Benedikt). Closed.
- Q3: Target dates for G1, G2, G3? (TBD)
