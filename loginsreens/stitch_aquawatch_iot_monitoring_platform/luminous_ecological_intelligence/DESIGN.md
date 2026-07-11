---
name: Luminous Ecological Intelligence
colors:
  surface: '#0c1322'
  surface-dim: '#0c1322'
  surface-bright: '#323949'
  surface-container-lowest: '#070e1d'
  surface-container-low: '#141b2b'
  surface-container: '#191f2f'
  surface-container-high: '#232a3a'
  surface-container-highest: '#2e3545'
  on-surface: '#dce2f7'
  on-surface-variant: '#c3c6d7'
  inverse-surface: '#dce2f7'
  inverse-on-surface: '#293040'
  outline: '#8d90a0'
  outline-variant: '#434655'
  surface-tint: '#b4c5ff'
  primary: '#b4c5ff'
  on-primary: '#002a78'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#0053db'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#ffb3ad'
  on-tertiary: '#68000a'
  tertiary-container: '#cf2c30'
  on-tertiary-container: '#ffecea'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#930013'
  background: '#0c1322'
  on-background: '#dce2f7'
  surface-variant: '#2e3545'
typography:
  display-lg:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  mono-data:
    fontFamily: monospace
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  card-gap: 20px
  section-margin: 48px
  desktop-max-width: 1600px
---

## Brand & Style
The design system is engineered for high-stakes environmental monitoring, where data density must coexist with rapid legibility. The brand personality is authoritative, technical, and vigilant. It evokes a "command center" atmosphere—sophisticated and calm under pressure.

The visual style is **Ultra-Modern Dark-Mode** with a heavy influence from **Glassmorphism** and **Tonal Layering**. Instead of traditional borders, hierarchy is established through surface luminance and subtle glow effects. The interface feels immersive and data-forward, utilizing deep spatial depth to separate global navigation from real-time monitoring streams.

## Colors
This design system utilizes a tiered dark-mode palette to manage visual noise in complex IoT dashboards.

*   **Primary (#2563eb):** Electric Blue. Used for active states, data peaks, and primary actions. It should be accompanied by a subtle outer glow to simulate an illuminated hardware display.
*   **Warning (#f59e0b):** Amber Yellow. Reserved for non-critical alerts and cautionary data thresholds.
*   **Risk (#ef4444):** Vibrant Red. Used exclusively for critical failures, environmental breaches, and emergency stop actions.
*   **Base (#111827):** The foundation layer, providing a deep, low-fatigue background.
*   **Surface (#1f2937):** The elevated card layer, designed to sit slightly "above" the base through tonal shift rather than stroke.

## Typography
The system uses a dual-font strategy. **Outfit** is used for headlines and display metrics to provide a modern, geometric feel that reflects technological precision. **Inter** is used for all body text, labels, and UI controls to ensure maximum legibility at small sizes.

For telemetry data and sensor readings, a monospace fallback should be used to ensure numerical alignment in rapidly changing data streams. Upper-case labels with slight letter-spacing are preferred for metadata and "over-line" titles.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a maximum container width to prevent line-length issues on ultra-wide monitoring displays. 

*   **Desktop:** 12-column grid with 24px gutters. Use wide 32px margins to create a "letterboxed" cinematic feel.
*   **Tablet:** 8-column grid with 16px gutters.
*   **Mobile:** 4-column grid with 16px gutters.

Spacing follows a 4px base unit. Component internal padding should be generous (typically 16px or 24px) to maintain the airy, modern aesthetic and prevent the density of IoT data from feeling overwhelming.

## Elevation & Depth
This design system avoids harsh 1px borders. Instead, depth is communicated through **Tonal Layering** and **Luminous Accents**:

1.  **Level 0 (Base):** #111827.
2.  **Level 1 (Cards):** #1f2937. Surfaces are defined by their contrast against the base.
3.  **Level 2 (Active/Hover):** When an element is interacted with, it should receive a 0 0 20px #2563eb (at 10-15% opacity) outer glow rather than a stroke change.
4.  **Glass Effects:** Modals and sidebars use a backdrop-blur (20px) with a semi-transparent #1f2937 fill (80% opacity) to maintain context of the underlying data.

## Shapes
A consistent **12px (0.75rem)** radius is applied to all primary containers, including cards, buttons, and input fields. This moderate roundedness softens the technical nature of the application, making it feel approachable and modern. 

Iconography should follow a "linear-round" style with 2px stroke weights to match the softened geometry of the UI components.

## Components
### Buttons
Buttons use the 12px radius. Primary buttons are solid Electric Blue with white text. Secondary buttons use a tonal background (#2d3748) with no border. In "Risk" scenarios, the button becomes a solid Red gradient.

### Cards
Cards are the primary container for IoT telemetry. They feature #1f2937 backgrounds. Header areas within cards should be subtly separated by a slight luminance shift rather than a line.

### Input Fields
Inputs are dark-filled with a focus state that triggers a 2px Electric Blue glow (box-shadow) rather than a hard border. The cursor and label should remain high-contrast.

### Data Visualization
Charts should use the Primary, Warning, and Risk colors. Area charts should utilize semi-transparent gradients that "bleed" into the card surface, reinforcing the luminous theme.

### Status Indicators
Small circular "Pills" with a CSS pulse animation should be used to indicate "Live" connectivity. Use the primary blue for active sensors, amber for intermittent signal, and red for offline status.