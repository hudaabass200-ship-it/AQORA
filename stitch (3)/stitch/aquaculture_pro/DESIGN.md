# Design System Specification: High-End Aquatic Editorial

## 1. Overview & Creative North Star: "The Fluid Mentor"
This design system moves away from the rigid, utility-first aesthetics typical of agricultural software and embraces an editorial, high-end digital experience. The "Creative North Star" is **The Fluid Mentor**. 

Just as water is both powerful and life-giving, the UI must feel authoritative yet breathable. We achieve this through **Organic Asymmetry**: intentional white space, overlapping card elements, and a typography scale that favors dramatic contrast. The goal is to make the beginner fish farmer feel like they are reading a premium digital magazine rather than managing a spreadsheet. We break the "template" look by utilizing glassmorphism, deep tonal layering, and an absolute rejection of traditional divider lines.

---

## 2. Colors: Depth Through Fluidity
The palette is rooted in professional blues and growth-oriented greens, but their application is governed by sophisticated layering rather than flat fills.

### Core Palette (Material Tokens)
*   **Primary (`#0061a4`):** Deep Ocean. Used for key actions and brand presence.
*   **Secondary (`#1b6d24`):** Algae Green. Symbolizes health, growth, and "Go" states.
*   **Tertiary (`#006876`):** Teal Water. Used for educational callouts and specialized data.
*   **Surface-Container-Lowest (`#ffffff`):** Pure White. Reserved for the "top-most" floating cards.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to section content. Boundaries must be defined solely through:
1.  **Background Color Shifts:** A `surface-container-lowest` card sitting on a `surface-container-low` background.
2.  **Tonal Transitions:** Using subtle value changes to imply a break in content.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—stacked sheets of frosted glass.
*   **Background (`#f8f9fa`):** The base canvas.
*   **Surface-Container-Low:** For large structural areas or secondary content groupings.
*   **Surface-Container-Highest:** For interactive elements like input fields or toggle backgrounds.

### The "Glass & Gradient" Rule
To elevate the "out-of-the-box" feel:
*   **Glassmorphism:** Use semi-transparent surface colors (60-80% opacity) with a `20px` backdrop-blur for floating navigation bars or modal headers.
*   **Signature Textures:** Main CTAs should use a linear gradient from `primary` to `primary-container` (at a 135-degree angle) to provide a "liquid" depth that feels custom and premium.

---

## 3. Typography: Editorial Authority
We utilize a dual-font system to balance modern technicality with warm readability.

*   **Display & Headlines (Manrope):** Bold, wide, and authoritative. Use `display-lg` for hero metrics (like tank temperature) to create an "Editorial Dashboard" feel.
*   **Titles & Body (Plus Jakarta Sans):** Highly legible with a friendly geometric touch. This font handles the "Educational" heavy lifting.
*   **Arabic Support:** Use **Cairo** as the primary typeface for its modern, architectural terminals. Ensure line height is increased by 1.2x for Arabic text to prevent "crowding" of calligraphic marks.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." In this system, we achieve lift through light and color.

*   **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift without a single pixel of shadow.
*   **Ambient Shadows:** For "Active" states or floating action buttons, use an extra-diffused shadow: `Y: 8px, Blur: 24px, Color: primary (8% opacity)`. This mimics natural light passing through water.
*   **The "Ghost Border" Fallback:** If a container needs more definition (e.g., in Dark Mode), use the `outline-variant` at **15% opacity**. Never use 100% opaque borders.
*   **Glassmorphism & Depth:** By letting background greens and blues "bleed" through semi-transparent cards, the layout feels like a cohesive ecosystem rather than separate boxes.

---

## 5. Components: Fluid Elements

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary-container`), `xl` (1.5rem) rounded corners. High-end editorial feel.
*   **Secondary:** `surface-container-highest` background with `primary` text. No border.
*   **Tertiary:** Text-only with a subtle `secondary-container` underline (2px) for a "Hand-annotated" look.

### Input Fields & Selectors
*   **The Integrated Input:** Instead of a boxed field, use a `surface-container-low` background with a `xl` corner radius. 
*   **Focus State:** Instead of a border change, use a subtle 4% glow of the `primary` color.

### Cards & Lists (The "No-Divider" Mandate)
*   **Cards:** Use `xl` (1.5rem) corners. Forbid the use of divider lines inside cards. 
*   **Spacing:** Use vertical white space (from the `lg` or `xl` scale) to separate list items. 
*   **Visual Separators:** Use a 4px wide vertical "Accent Bar" of `secondary` (green) on the leading edge of a card to indicate "Healthy" status, rather than a full-box border.

### Signature Component: The "Growth Wave" Chart
*   Instead of standard line charts, use area charts with a gradient fill (`secondary` to transparent) and a "frosted" glass overlay for the data tooltips.

---

## 6. Do's and Don'ts

### Do:
*   **DO** use extreme scale for numbers. A fish count or pH level should be `display-md` to emphasize importance.
*   **DO** overlap elements. A fish icon should slightly "break" the container of the card to create 3D depth.
*   **DO** use `surface-tint` for subtle background washes in dark mode to keep the "watery" feel alive.

### Don't:
*   **DON'T** use black (#000000) for text. Use `on-surface` or `on-surface-variant` for a softer, premium look.
*   **DON'T** use 1px dividers. If you feel you need one, use a 16px gap of empty space instead.
*   **DON'T** use sharp corners. Everything in this system must feel "water-worn" and smooth, adhering to the `xl` and `full` roundedness scale.
*   **DON'T** use standard system icons. Use custom, thin-stroke (1.5pt) icons with rounded terminals to match the typography.