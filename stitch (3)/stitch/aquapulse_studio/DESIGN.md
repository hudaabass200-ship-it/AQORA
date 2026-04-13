# Design System Document: Aquatic Precision & Editorial Depth

## 1. Overview & Creative North Star
The management of life within a pond is an exercise in balance, patience, and professional stewardship. This design system moves away from the cluttered "dashboard" look of typical agricultural software, embracing a Creative North Star we call **"The Aquatic Curator."** 

This vision treats data as a high-end editorial experience. We eschew the rigid, boxed-in grids for a layout that feels fluid yet authoritative. By utilizing intentional asymmetry, overlapping card elements, and a sophisticated typographic scale, the system transforms complex biological data (pH levels, growth rates, and feed metrics) into a serene, legible, and premium interface. It is designed to guide a beginner with the confidence of an expert.

---

## 2. Colors
Our palette is rooted in the tonal depth of the ocean and the vibrancy of freshwater ecosystems. We use color not just for decoration, but to define the very architecture of the application.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section off content. In this system, boundaries are defined exclusively through:
1.  **Background Color Shifts:** A `surface-container-low` section sitting against a `surface` background.
2.  **Tonal Transitions:** Using subtle shifts in the Material Design surface tiers to signify a change in context.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of semi-translucent materials.
*   **Base:** `surface` (#f6fafa) serves as the "water" on which everything floats.
*   **Middle Layer:** `surface-container` (#ebefef) for primary content regions.
*   **Top Layer:** `surface-container-lowest` (#ffffff) for high-priority interactive cards.
By nesting a `surface-container-highest` element inside a `surface-container-low` parent, you create immediate visual hierarchy without a single structural line.

### The "Glass & Gradient" Rule
To elevate CTAs and monitoring headers beyond the "standard," apply Glassmorphism. Floating elements (like an active fish-type selector) should use semi-transparent surface colors with a `backdrop-blur` of 12px–20px. 
*   **Signature Textures:** Use subtle linear gradients for main action buttons, transitioning from `primary` (#005767) to `primary-container` (#007185). This adds "soul" and a sense of liquid movement.

---

## 3. Typography
The typography system uses **Manrope** for its modern, geometric clarity, paired with specialized Arabic typesetting to ensure high legibility for regional fish farmers.

*   **Display (lg/md/sm):** Reserved for high-impact editorial moments, such as the total biomass of a pond. These should feel expansive and authoritative.
*   **Headline (lg/md/sm):** Used for section titles (e.g., "Pond Monitoring"). These set the tone of the page.
*   **Title (lg/md/sm):** Used within cards to categorize data points.
*   **Body (lg/md/sm):** Optimized for long-form educational content regarding fish health.
*   **Label (md/sm):** Strictly for micro-data, such as timestamps on sensor readings.

**Editorial Strategy:** Use a high contrast in scale. A `display-sm` value next to a `label-md` value creates an "editorial" hierarchy that feels more like a premium magazine than a spreadsheet.

---

## 4. Elevation & Depth
In this system, elevation is a property of light and atmosphere, not just "dropshadows."

*   **Tonal Layering:** Depth is primarily achieved by stacking surface tokens. A `surface-container-lowest` card on a `surface-container-low` background creates a soft, natural lift.
*   **Ambient Shadows:** If a card must "float" (e.g., a critical alert for Tilapia growth), use extra-diffused shadows. 
    *   *Blur:* 24px–40px. 
    *   *Opacity:* 4%–6%. 
    *   *Tint:* Use a tinted version of `on-surface` (#181c1d) to ensure the shadow feels like part of the environment.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use the `outline-variant` token at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism:** Use `surface-tint` (#00687a) at low opacities for overlays to allow pond data visualization to "bleed" through the navigation or modals, creating an integrated, modern feel.

---

## 5. Components
### Cards & Data Modules
Cards must never have dividers. Separate "Weight," "Count," and "Temperature" metrics through generous vertical white space. Use `surface-container-lowest` for the card body to make it "pop" against the `surface-container` background.

### Buttons
*   **Primary:** Gradient of `primary` to `primary-container`, rounded at `xl` (1.5rem) to mimic the smooth edges of river stones.
*   **Secondary:** `secondary-container` (#aeeecb) background with `on-secondary-container` (#316e52) text. No border.

### Progress Bars (Fish Growth)
Avoid the "loading bar" look. Use a thick track with `secondary-fixed-dim` (#95d4b3) and a "glow" effect on the progress indicator using a subtle outer shadow of the same color.

### Individual Brand Icons
Icons for **Tilapia, Sea Bream, and Sea Bass** should be styled as "Illustrative Marks." 
*   Use a dual-tone approach: `primary` for the main silhouette and `primary-fixed` for highlights.
*   Place these icons within `surface-bright` circles to indicate "status" or "selection."

### Input Fields
Inputs should use `surface-container-highest` as a background with a `none` border. On focus, transition the background to `surface-container-lowest` and apply a "Ghost Border" of `primary` at 20% opacity.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place pond health charts slightly off-center to create a dynamic, modern editorial feel.
*   **Embrace White Space:** Use the "xl" spacing tokens between cards to allow the "aquatic" aesthetic to breathe.
*   **Prioritize Arabic Legibility:** Ensure line-heights for Arabic text are 1.5x–1.7x the font size to prevent character crowding.

### Don't:
*   **Don't use 1px solid lines:** Lines create "cages" for data. Use tonal shifts instead.
*   **Don't use pure black shadows:** They feel "dirty" in a clean, water-inspired UI. Always tint shadows with the surface color.
*   **Don't crowd the dashboard:** If a beginner sees 20 metrics at once, they will feel overwhelmed. Use progressive disclosure via "Glass" modals.
*   **Don't use "Default" Blue:** Stick strictly to the `primary` (#005767) and `tertiary` (#005769) tones which have a specific deep-sea/teal sophistication.