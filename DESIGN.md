---
name: MIT Readiness Atlas
description: An evidence-first desktop field guide to exceptional student development
---

# Design System: MIT Readiness Atlas

The app wears the GT Anywhere brand. Values below are the ones actually in
`desktop/src/index.css`, taken from the GT brand portal.

## 1. Overview

**Creative North Star: "The Evidence Field Guide"**

The app should feel like a precise field instrument shared by a student and counselor at a well-lit table: calm, legible, and inviting close inspection. Warm paper stock, an editorial serif for display, and a monospace for utility marks give it the character of a printed reference rather than a dashboard.

The interface is light, restrained, and progressively disclosed. It uses responsive state transitions rather than decorative choreography. It explicitly rejects the density of a spreadsheet, the suspense of a chance calculator, and the interchangeable cards of a generic productivity dashboard.

**Key Characteristics:**
- Evidence is adjacent to the judgment it supports.
- Hierarchy comes from typography, spacing, and tonal surfaces rather than decoration.
- Detail appears on demand without hiding uncertainty.
- Standard desktop controls remain familiar and keyboard-operable.

## 2. Colors

Warm off-white paper carries the content. Navy does the structural work, and Gold is the accent.

### Brand
- **Gold** `#e48b53`: The brand accent. Tier 1 fill, emphasis surfaces.
- **Gold Deep** `#ab683e`: Warm text where Gold itself is too light.
- **Gold Light / Lighter / Lightest** `#ebba9b` / `#f5ddcd` / `#f8e8de`: Selected states, grouped regions, tinted panels.
- **Navy** `#002a3a`: Primary actions, current navigation, links.
- **Blue Dark** `#003b5c` and **Blue** `#004f71`: Secondary structure and the focus ring.
- **Dark Navy** `#001117`: Body text.
- **Off White** `#fcf4ef`: The reading surface.
- **White** `#ffffff`: Sidebar panel and cards that need to lift off the paper.
- **Grey** `#cac6c4`: Strong borders and quiet outlines.

### Named Rules

**The Gold Is Not Ink Rule.** Gold never carries text on the paper background; the pair measures 2.4:1. Gold appears as a surface, and any text on it is Dark Navy at 7.4:1. This is a deliberate departure from the portal, which sets white on Gold at 2.6:1.

**The Restrained Signal Rule.** Brand accent occupies less than ten percent of a typical working screen and always communicates action, selection, evidence, or status.

**The No Color-Only Tier Rule.** Every tier includes a plain-language name and ordinal marker. Tiers also descend in fill weight (gold fill, warm tint, outlined, quiet) so the ordering survives without hue.

## 3. Typography

**Display:** Literata Variable, weight 300, for headings at 1.1rem and above.
**Body:** Inter Tight Variable, for prose, controls, and compact headings.
**Utility:** Inconsolata Variable, weight 600, uppercase, for button labels, tier codes, and tags.

All three ship as local `@fontsource` packages so the desktop app renders identically offline.

### Hierarchy
- **Display:** Screen titles and model-student names, 2.15rem Literata 300.
- **Section:** 1.5rem Literata 300.
- **Compact heading:** 0.9–1.05rem Inter Tight 620.
- **Body:** Explanations and recommendations, capped near 70 characters per line.
- **Utility:** Uppercase Inconsolata for tags, tier badges, and the primary call to action.

### Named Rules

**The Serif Stops At Small Sizes Rule.** Literata 300 is a display face here. Below about 1.1rem it stops being legible, so compact headings use Inter Tight instead. A light serif never labels a data row.

**The Utility Face Is For Marks Rule.** Inconsolata carries codes, tags, and button labels. It never sets prose.

## 4. Elevation and shape

Flat by default. Tonal layers and one-pixel borders establish structure; soft elevation appears only for temporary desktop surfaces such as menus and dialogs. Corner radius is 8px (`--radius-md`), with 4px for compact tags.

### Named Rules

**The Notch Is The Signature Rule.** The primary call to action carries a 14px cut on the bottom-right corner, matching the portal's `is-cut-br`. It is applied to a pseudo-element rather than the button itself so the focus outline is not clipped. One notched element per screen.

**The State Earns Depth Rule.** A shadow is permitted only when an element moves above the working plane or responds to direct interaction.

## 5. Do's and Don'ts

### Do:
- **Do** place a short reason and confidence cue beside every match or tier judgment.
- **Do** use familiar buttons, fields, tabs, and disclosure controls with complete interaction states.
- **Do** keep the primary task visible while deeper methodology opens inline or in a side panel.
- **Do** use responsive transitions in the 150–250ms range and honor reduced motion.
- **Do** check any new colour pair against 4.5:1 before shipping it as text.

### Don't:
- **Don't** expose a dense spreadsheet or database interface instead of answering the user's question.
- **Don't** imitate gamified admissions-chance calculators, acceptance meters, or score theatrics.
- **Don't** use a luxury admissions-consulting aesthetic to manufacture authority.
- **Don't** introduce competitive leaderboards or social comparison mechanics.
- **Don't** build generic productivity dashboards from interchangeable cards and decorative metrics.
- **Don't** use side-stripe accents, gradient text, decorative glassmorphism, or color as the only tier signal.
- **Don't** put a small muted label above every section heading. Fold the information into the heading instead.
