# Performance Optimization — Visibility-Gated RAF Loops

**Date:** 2026-05-25
**Status:** Approved

## Problem

The portfolio runs 3 concurrent requestAnimationFrame loops simultaneously at all times:
- `BgScene` — full-screen Three.js WebGL (particles + globe)
- `SkillsGlobe` — Three.js WebGL (icon sprites on 3D globe)
- `AboutPortrait` — Canvas 2D (dot grid)

This causes general sluggishness on scroll, especially on mid-range hardware. All three loops run regardless of whether the user is looking at the relevant section.

## Approach: Visibility-Gated RAF Loops

Pause each renderer when it is not visible, and pause all renderers when the browser tab is backgrounded. No animation timing, easing, colors, or geometry is changed.

## Changes

### BgScene.tsx
- Cache `document.body.scrollHeight` on `resize` instead of reading it inside the RAF callback (~60×/sec)
- Cap `setPixelRatio` at `1.5` instead of `2` (reduces fragment shader work ~44% on HiDPI)
- Suspend loop on `visibilitychange` (hidden → cancel RAF; visible → restart)

### SkillsGlobe.tsx
- `IntersectionObserver` on the wrapper div: start RAF when section enters viewport, stop when it leaves
- `mouseMoved` flag: `updateHover()` only runs when mouse has moved since the last frame (skips full sprite projection loop ~60×/sec when mouse is still)
- Suspend loop on `visibilitychange`

### AboutPortrait.tsx
- `IntersectionObserver` on the card: pause RAF when card is off-screen, resume when it enters
- Suspend loop on `visibilitychange`

## Non-Goals
- No geometry count changes
- No CSS animation changes
- No lazy-loading of section components
- No changes to easing, timing, or visual output
