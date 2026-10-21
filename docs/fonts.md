# Embedded typography

User-supplied TTFs are copied verbatim into app/fonts and bundled via CSS URLs for both public Vite and framework builds.

- DungGeunMo: all interface text, form controls, pseudo elements, SVG text, and PNG export captions.
- Mona12ColorEmoji: default emoji fallback and the home teaser sparkle.
- Mona12Emoji: monochrome save-status clouds and the character direction pad star.
- Mona12Emoji-Bold: weight 700 monochrome message envelope.

Emoji-only families remain fallbacks for text. Explicit emoji spans select color/monochrome variants, avoiding OS-dependent substitution for supported characters. Decorative spans are hidden from accessibility APIs. Existing artwork wordmark remains an image.

The prior Ongleip font file is retained as a source asset but is no longer declared or used. Compact inventory tabs and teaser text were resized for wider square glyphs.
