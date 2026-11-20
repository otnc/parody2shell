# parody2shell

parody2shell (served at 2shell.cc) is a parody security advisory generator built with Astro SSR on Cloudflare Workers. It turns a subdomain into a localized advisory, complete with a presentation theme, a generated CVE identifier, and a social preview.

## Product constraints

- Keep generation database-free. Normalize the subdomain before computing the advisory so production, `<name>.localhost:4321`, Unicode, and Punycode resolve to the same record. The English and `/ja` routes render the same selection in different languages.
- Keep the generated `CVE-2026-…` identifiers stable, the visible `<name>2shell lol` headline, and the subject name in the summary. Keep the existing top badge as the sole Parody / パロディ label on home and advisory pages. Write advisory details as invented observations and outcomes. Keep examples inert and omit real product exploits, payloads, and reproducible attack steps.
- Preserve the black shadcn homepage, its input and dice, the curated 36 examples, `www`, `parody`, `everything` and `パロディ` redirects to the apex, localized 404s, and the shared footer. Keep share and copy controls on home and advisory pages and omit them from 404s. The X share text is the page title (`<name>2shell | parody2shell`), the page URL and `#parody2shell`, with no second URL. Keep the examples sorted with Japanese entries at the end. The headline and dice can draw from a larger pool of DNS-valid names, with additions in English.
- Keep the localized Open Graph and X metadata, the per-host PNGs, and the `/ogp` and `/ja/ogp` previews. Use the same advisory and localized publication label for the page and its preview.

## Next expansion

When asked to continue the expansion, research and implement a substantial batch of new layouts and writing. Use double-digit new layout families and roughly twice the fully authored scenario count as starting targets. Update the targets against the current catalog and prioritize meaningful variety. Take the work through rendering and verification so every addition is actually reachable.

### Research and integrate UI libraries

- Survey several categories of UI projects across the web. Include full CSS frameworks, classless stylesheets, design systems, niche UI kits, and focused libraries for charts, media, or unusual interactions. Use the [style-framework list](https://github.com/stars/otnc/lists/style-framework) as one lead and search beyond it.
- Open upstream demos, documentation, and repositories for promising candidates. Compare each library with the current catalog in `package.json` and `src/styles/library-sheets.ts`. Check its license, installable assets, Astro/Workers compatibility, and distinctive components. Record the upstream link and what each adopted library contributes in the handoff.
- Adopt libraries that enable a distinctly different layout or interaction and use their actual components or styling. Load the stylesheet, font assets, and browser code only for the themes that need them. Verify that library styles stay out of the homepage and other themes.
- Vary page hierarchy, navigation, section order, evidence placement, and interactions. Give themes a distinct type pairing, icon treatment, and visual idiom. Try uncommon formats such as a broadcast interruption with a rolling transcript, a blueprint foldout with annotations, a fax spool with paginated reports, or a bestiary with indexed field cards. Keep visible labels in the language of vulnerability disclosures.
- Expand evidence alongside layouts. Add forms such as version matrices, comparison traces, annotated timelines, or accessible diagrams where the scenario supplies data that fits them. Derive labels and values from the same record as the body copy. Provide a readable fallback for interactive evidence.

### Write more detailed advisories

- Expand both complete case templates and the reusable slots for summaries, triggers, causes, effects, affected scope, mitigations, follow-ups, and evidence notes. Give each substantial scenario its own premise, observable behavior, and consequence.
- Write both deadpan, plausible-sounding advisories and overtly absurd cases. Include some longer investigations that describe the expected behavior, what was observed, the affected conditions, and how a follow-up comparison differed. Invent all measurements and release details, and keep them consistent with the same record's tables and charts.
- Use coherent scenario families or compatibility metadata so generated text, evidence, and severity support one another. Keep short, self-contained summaries for social metadata. Author natural Japanese and English together and check that the meaning and named subject survive substitution.

### Keep catalogs extensible and assignments stable

- The current generation entry point is `src/advisories/generate.ts`. Read the existing selection logic before editing `src/advisories/designs.ts` and the versioned wording catalogs under `src/advisories/`. Preserve pinned example assignments and CVE IDs. Use a new deterministic selection bucket or a versioned catalog to introduce changes to existing mappings deliberately.
- Keep catalog entries in focused modules grouped by scenario family or presentation. Use stable IDs, typed registries, and shared rendering primitives for recurring elements. Keep assigned choices independent where they are compatible and model real dependencies explicitly.
- Avoid changing an existing modulus merely by appending to a registry. Layout selection in `src/advisories/generate.ts` uses frozen bucket sizes (29 for the third edition, 41 for the fourth), the original five icon sets stay the digest-selected ones in `src/advisories/visuals.ts`, and wording uses mixed-radix decoding in `src/advisories/v3/wording.ts` and `src/advisories/v4/wording.ts`. Names on the homepage and in the pre-fourth-edition headline pool are frozen to their earlier selections. Freeze the prior selection rules where old mappings must hold and check the change against existing fixtures before registering new choices.
- Count distinct authored scenarios, structural layout families, evidence formats, fonts, icon sets, and reachable wording combinations. Count only compatible choices and keep the calculation exact as the space grows. The v3 decoder uses a 64-bit seed and converts to `Number`; the v4 decoder uses a 128-bit seed with BigInt arithmetic. Review these limits before increasing either space. Sample a fixed, diverse set of labels to measure reachability, distribution, and duplicate outputs in each locale.

## Integration and verification

- Register themes in `src/advisories/designs.ts` and `src/components/advisory/layouts.ts`. Put theme markup in `src/components/advisory/themes/` and styles in `src/styles/designs/`. Wire typography and icons through `src/advisories/visuals.ts` and `src/components/ui/icons.ts`. Use `src/styles/library-sheets.ts` for library CSS and `src/pages/client/[library].js.ts` for browser modules when needed.
- Give each theme a unique, reachable example. Update the home preview metadata and the social card in `src/og/card.tsx`. Verify new layouts on their example subdomains and preserve consistency among HTML, metadata, and PNG previews.
- Run `pnpm check`, `pnpm test`, and `pnpm build`. With `pnpm dev` running, run `pnpm test:local`. Set `TWOSHELL_TEST_PORT` when using a different port. Extend the existing catalog and HTTP coverage where a new choice or behavior needs an assertion.
- Inspect new layouts in a browser in both locales at desktop and 320px widths. Include a long label and a Japanese subdomain. Check the headline under the header, readable evidence, keyboard access, reduced motion where applicable, and working share controls. Open the localized PNG preview to check its actual composition.
- In the handoff, give before-and-after counts for the expanded dimensions, the observed variety in the fixed sample, adopted libraries with upstream links, and representative local URLs.
