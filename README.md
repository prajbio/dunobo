# Dunobo

Dunobo — Explore our world of knowledge.

Open educational platform with a responsive homepage, subject discovery, and Human Atlas Edition 15 with the children's Clue Club experience.

The complete static Human Atlas was imported from the Open Human Atlas Sites source, commit `18504cdaad9d552dea9ff65eb29fa41f0d27afac`. It includes 13 guided stories, 18 children's discoveries, six adventures, images, recorded narration and evidence catalogues.

## Local development

This version is a static website. Run `python3 -m http.server 8000` in the project root and open `http://localhost:8000`.

## Deployment

Publish the repository root as a static site to Cloudflare Pages, or another static host. No build command required. Connect a custom domain after DNS is configured.

## Scope

- Home and brand identity
- Responsive desktop/mobile navigation
- Browser-side search over current live sections
- Human Atlas at `/human-atlas/` and Clue Club at `/human-atlas/kids/`
- Anthropology and the Nibelungen Atlas
- Future subject placeholders (Quantum Biology and History)

## Quality safeguards

The atlas preserves evidence references, image credits, licence information and uncertainty notes. Clue Club saves progress locally in the browser. See the atlas Privacy & Sources page for details. The imported content has not received a new independent scientific or image-rights review.

## Human Atlas hosting

The atlas uses `/human-atlas/` as its asset base. Clue Club has a directory entry point, and legacy `kids.html` links redirect to it. Root `_headers` applies the atlas security policy only to atlas routes; `_redirects` preserves the children's canonical URL. Keep these files when publishing.

Cloudflare Pages is deployed manually with Wrangler; Git-connected automatic deployment is not configured. Publish the repository root, excluding Git metadata and local tool caches.

## Nibelungen Atlas

Anthropology includes the existing Nibelungen Atlas Edition 4 at `/anthropology/nibelungenhort/`, with narrated chapters, evidence, videos and historical Rhine comparisons. Only the finished website package is included; build tools and local evaluation notes are excluded. Evaluations remain in each visitor's browser.

## Shared design

All 17 HTML entry points load `assets/dunobo-theme.css` and `assets/dunobo.js`. The theme defines a shared dark canvas, typography, spacing, controls and responsive layouts. `data-design` selects page-specific layouts; existing atlas `data-page` values retain their original purpose.

The site header provides subject navigation and a keyboard-accessible search dialog (`/` opens it; Escape closes it). Search indexes the published collections and clearly labels forthcoming subjects. On mobile, the subject menu replaces the scrolling navigation strip. The atlas Resources menu retains existing control IDs and handlers; research data, narration, browser-local progress and evidence credits are preserved.

The homepage map uses Natural Earth public-domain geometry. Its connections are editorial illustrations, not migration reconstructions. The Clue Club image is AI-created; the manuscript image is from the Badische Landesbibliothek and is public domain, with fuller source records in the Nibelungen Atlas.
