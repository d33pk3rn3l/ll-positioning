# Sprint 1 issue reconciliation

The user's Sprint 1 request replaces the active navigation × science application with one causal global-position workflow. Earlier code remains in Git history at `5a494c0fb301f5517d83dda2f953d9a760777176`. Research documents, source notes, bibliography and source-table checks remain in the repository.

## Replacement work items

| Issue | Delivered work |
| --- | --- |
| [#32](https://github.com/d33pk3rn3l/ll-positioning/issues/32) | Versioned inputs, metadata, validation, 150 m approach and ascending ravine |
| [#33](https://github.com/d33pk3rn3l/ll-positioning/issues/33) | Joint covariance core, separate source contributions, distance-based variance, numerical checks |
| [#34](https://github.com/d33pk3rn3l/ll-positioning/issues/34) | Causal UWB and horizontal map observations, geometry and shared errors |
| [#35](https://github.com/d33pk3rn3l/ll-positioning/issues/35) | Linked 3D viewport, cursor, plots, comparison, source attribution and examples |
| [#36](https://github.com/d33pk3rn3l/ll-positioning/issues/36) | Removal of old code, saved reproduction, browser checks, production build and issue reconciliation |

## Superseded or replaced issues

| Issue | Reason and replacement |
| --- | --- |
| [#4](https://github.com/d33pk3rn3l/ll-positioning/issues/4) | Old science ranking, spectrometer and datum-observability paths are removed. Replaced by [#33](https://github.com/d33pk3rn3l/ll-positioning/issues/33) and [#36](https://github.com/d33pk3rn3l/ll-positioning/issues/36). Missing starting-reference knowledge now yields an incomplete assessment rather than an assumed fix. |
| [#6](https://github.com/d33pk3rn3l/ll-positioning/issues/6) | Tube density and depth controls/calculations are removed from Sprint 1. Replaced by the explicit deferred-science boundary in [#36](https://github.com/d33pk3rn3l/ll-positioning/issues/36). Reassess physical validation before reintroducing science models. |
| [#7](https://github.com/d33pk3rn3l/ll-positioning/issues/7) | The legacy gravimetry page and its orphan numerical claims are removed. New outputs derive from the core; committed demonstrations and their results regenerate and are checked in CI. Replaced by [#36](https://github.com/d33pk3rn3l/ll-positioning/issues/36). Historical source statements remain research notes, not active results. |
| [#10](https://github.com/d33pk3rn3l/ll-positioning/issues/10) | Replacement core passes an active test that zero-information/infinite-noise observations do not improve the estimate, plus subdivision invariance. Resolved by [#33](https://github.com/d33pk3rn3l/ll-positioning/issues/33). No expected-failure mark remains. |

These closures remove obsolete implementation tasks; they do not assert that deferred science validation has been completed.

## Preserved unresolved work

- [#26](https://github.com/d33pk3rn3l/ll-positioning/issues/26): source-table transform direction and height-reference vocabulary remain unresolved. No transform rows are consumed by Sprint 1. The validator and source notes are preserved.
- [#19](https://github.com/d33pk3rn3l/ll-positioning/issues/19): the science gradient defect remains documented for a future science model. No gravity gradient or science result enters this page.
- [#8](https://github.com/d33pk3rn3l/ll-positioning/issues/8): this change limits the artifact to `dist/` and separates deploy concurrency. Leave open until the merged deployed site has been checked, as the issue requires.

Previously closed issues (#5, #16, #22, #24) are not reopened. The motion audit, frame research and values-format work remain useful reference material.
