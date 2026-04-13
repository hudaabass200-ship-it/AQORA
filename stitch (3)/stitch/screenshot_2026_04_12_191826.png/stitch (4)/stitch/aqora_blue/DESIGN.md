# Design System Strategy: The Aquatic Editorial

## 1. Overview & Creative North Star
**Creative North Star: "The Fluid Curator"**

This design system moves away from the rigid, boxy constraints of traditional management software. Instead, it draws inspiration from the fluidity of water and the precision of modern editorial design. By utilizing a "High-End Editorial" approach, we transform complex aquaculture data into a serene, professional experience. 

The system breaks the "template" look through **intentional asymmetry** (e.g., asymmetrical padding in hero sections), **overlapping elements** (cards that subtly bleed over container edges), and a **high-contrast typography scale** that treats Arabic script with the dignity of a premium publication. The goal is to make the user feel like they are navigating a digital command center that is as organic as the ecosystems they manage.

---

## 2. Colors & Surface Philosophy
The palette utilizes deep, oceanic blues for authority and vibrant, algae-inspired greens for growth and health.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to define sections or containers. Modern luxury is defined by volume and tone, not outlines. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` (#f2f4f6) card should sit on a `surface` (#f7f9fb) background to create a visible but soft separation.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of frosted glass or fine heavy-stock paper.
- **Layer 1 (The Bed):** `background` (#f7f9fb) or `surface`.
- **Layer 2 (The Content Block):** `surface-container-low` (#f2f4f6).
- **Layer 3 (The Interactive Element):** `surface-container-lowest` (#ffffff).
- **Layer 4 (The Floating Action):** Glassmorphism (using `surface-variant` at 60% opacity with a 20px backdrop-blur).

### The "Glass & Gradient" Rule
To elevate CTAs beyond standard buttons, use a subtle "Liquid Gradient."
- **Primary CTA:** Transition from `primary` (#005bbf) to `primary_container` (#1a73e8) at a 135-degree angle. This provides a tactile "glow" that flat colors cannot replicate.

---

## 3. Typography
The system uses a pairing of **Plus Jakarta Sans** for Latin numerals/headings and a highly legible, professional Arabic typeface (integrated into the **Inter** and **Plus Jakarta** weights).

- **Display (display-lg to sm):** Large, airy, and bold. Used for high-level metrics like total expenditure or harvest weight.
- **Headlines (headline-lg to sm):** Used for section titles. These should have increased letter-spacing (for Latin) and generous leading (for Arabic) to allow the script to breathe.
- **Body (body-lg to sm):** Optimized for 16px (`body-lg`) to ensure readability in humid or outdoor farming environments.
- **Labels (label-md to sm):** Used for metadata. Always set in `tertiary` (#525f71) to maintain a clear hierarchy between data and its description.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than structural shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-high` section to create "natural lift."
- **Ambient Shadows:** When an element must float (like a modal or a floating action button), use an extra-diffused shadow: `box-shadow: 0 12px 32px rgba(25, 28, 30, 0.06);`. The shadow is a tinted version of `on-surface` at a very low opacity.
- **The "Ghost Border" Fallback:** If a divider is functionally required for accessibility, use the `outline_variant` (#c1c6d6) at **15% opacity**. Never use a 100% opaque border.
- **Glassmorphism:** For top navigation or chat headers, use `surface` with 70% opacity and `backdrop-filter: blur(12px)`. This allows the vibrant greens and blues of the content to bleed through, softening the interface.

---

## 5. Components

### Cards & Lists
- **Rule:** Forbid divider lines between list items. 
- **Implementation:** Use a 12px vertical gap (`spacing-md`). Use a `surface-container-lowest` (#ffffff) background for the active card and `transparent` for inactive items, relying on typography to guide the eye.
- **Corners:** Use the `lg` (1rem) or `xl` (1.5rem) roundedness scale for a soft, friendly touch.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `xl` roundedness, white text.
- **Secondary:** `secondary_container` (#68fadd) background with `on_secondary_container` (#007261) text. This vibrant green serves as a "Success" or "Growth" indicator.

### Input Fields
- **Style:** Soft-filled. Use `surface_container_high` (#e6e8ea) as the background with no border.
- **States:** On focus, transition the background to `surface_container_lowest` (#ffffff) and add a "Ghost Border" of `primary` at 20% opacity.

### Chat Bubbles (AI Assistant)
- **User:** `primary` background with `on_primary` text. `xl` roundedness, with the bottom-right corner slightly more acute to indicate direction.
- **Assistant:** `surface_container_high` background. Use a subtle `tertiary_fixed` (#d6e4f9) accent on the leading edge to differentiate the AI voice.

### Aquatic Specific Components
- **Oxygen/Temp Gauges:** Use a "Frosted Ring" component—a semi-transparent `secondary_fixed` (#68fadd) stroke that glows when levels are optimal.
- **Pond Status Chips:** Use `secondary_container` for healthy ponds and `error_container` for alerts, with text in their respective `on-` colors.

---

## 6. Do's and Don'ts

### Do
- **DO** use white space as a structural element. If an element feels crowded, increase the padding rather than adding a line.
- **DO** use `surface-dim` (#d8dadc) for backgrounds in high-glare outdoor environments to reduce eye strain.
- **DO** ensure the Arabic typography has sufficient line height (1.6 - 1.8) to prevent "clipping" of descenders.

### Don't
- **DON'T** use pure black (#000000) for text. Use `on_surface` (#191c1e) to maintain a premium, softer contrast.
- **DON'T** use standard Material Design drop shadows. They are too "heavy" for this aquatic, airy aesthetic. Use the Ambient Shadow spec defined in Section 4.
- **DON'T** use 90-degree sharp corners. Everything in the "Fluid Curator" system should feel eroded and smoothed by water (minimum `sm` rounding).