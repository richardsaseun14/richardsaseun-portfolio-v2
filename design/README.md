# Design snapshot

A copy of the design canvas this site was built from ("Richard Saseun — Portfolio").

Source of truth: https://claude.ai/code/artifact/f945255a-ef17-4c4d-af25-05630af098cc
Snapshot taken: 2026-10-15

## Files

| File | Page |
| --- | --- |
| `canvas/Main.dc.html` | Home (`/`) |
| `canvas/Work.dc.html` | Labs (`/labs`) |
| `canvas/CaseStudy.dc.html` | Case study template (`/labs/[slug]`) |
| `canvas/Resume.dc.html` | Changelog (`/changelog`) |
| `canvas/Personal.dc.html` | Side quests (`/side-quests`) |
| `canvas/FontLab.dc.html` | Font comparison board (reference only) |
| `canvas/canvas.json` | Board layout, titles and notes (incl. the keyboard-shortcut spec) |

These are design-component source files. They render inside the canvas editor, not on their
own in a browser (they rely on the editor's runtime, and the portrait is referenced from the
canvas's asset store). Use them as a readable reference and for diffing between snapshots.

For pictures of the pages, export PNG/PDF from the canvas: Share › Export.

## Refreshing

Ask Claude to "save a fresh design snapshot to the project". Commit before and after so
`git diff design/` shows exactly what changed in the design since the last sync.
