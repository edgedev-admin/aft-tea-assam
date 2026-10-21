# Wholesale Page Verification

## Sources reviewed

- `AFT TECHNO TRADE DETAILS .docx`, supplied by the project owner.
- Existing `/wholesale`, `/teas`, `/craft`, `/about` and `/contact` content.
- Current enquiry-form implementation and project configuration.
- Wholesale 2.0 implementation brief.

## Buyer-facing claims retained

- AFT Techno Trade operates in Dikom and Lahowal near Dibrugarh in Upper Assam.
- The business was established in 2018.
- Commercial discussions can cover Assam CTC grades including BP, PF and PD, specialty and orthodox selections, custom blending, private-label work and bulk supply.
- Grading and sensory cupping are described as part of the manufacturing approach.
- Buyers can discuss tea characteristics, packaging, documentation and commercial requirements directly with the team.

## Claims deliberately qualified or omitted

- No fixed MOQ, price, capacity, lead time, sampling policy or quantity guarantee is published.
- No estate ownership, acreage, certification, export licence or delivery coverage is claimed.
- Private-label, blending, packaging and dispatch arrangements are presented as discussions subject to project confirmation.
- No buyer logos, testimonials, inventory status or margin claims are used.

## Enquiry delivery audit

- No approved server-side email provider, API route, database submission or provider credentials were found.
- The form therefore validates the buyer's details and opens a prepopulated email draft addressed to `hmtea2019@gmail.com`.
- The interface explicitly states that the buyer must review and send the draft from their email application.
- A copy-details action is provided as a fallback.
- The interface never displays an "enquiry sent" state.

## Browser checks completed

- Tested at 1920 x 1080, 1440 x 900, 1024 x 768, 768 x 1024, 430 x 932, 390 x 844 and 360 x 800.
- Document width matched the mobile viewport at 360, 390 and 430 pixels; no horizontal scrolling was introduced.
- The desktop supply stage remained sticky and updated in both forward and reverse navigation.
- Tablet and mobile layouts removed the sticky visual and presented all four disciplines in normal vertical reading order.
- Reduced-motion emulation hid the decorative sticky stage, removed transitions and exposed every supply chapter at full opacity.
- The Custom Blending CTA scrolled to the form and preselected `Custom Blending`.
- Empty submission produced field-level errors for name, email and message, then focused the first invalid field.
- Reserved validation rows produced a measured zero-pixel field shift when those errors appeared.
- Invalid email input produced a specific email error and focus state.
- Quantity ranges, destination and a long requirements message remained usable at mobile width.
- The copy-details fallback produced a complete enquiry brief and displayed an accurate status message.
- The shared `/contact` form was regression-checked after the field and validation changes.
- No browser console errors were present during the final wholesale and contact checks.

Email delivery itself was not claimed or tested because no backend delivery service is configured. The final action remains an accurately labelled email-draft flow.

## Technical validation

- `npx tsc --noEmit`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with `/wholesale` statically generated.
