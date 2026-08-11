# Chrome Web Store listing copy

Reference copy for the Web Store listing. The Title and Summary come from
manifest.json (name / description) and update when a new package is uploaded.

## Description (paste into Store listing > Description)

Schema Checker adds a Schema panel to Chrome DevTools that finds, extracts and pretty-prints every piece of Schema.org structured data on the page you're inspecting - JSON-LD and Microdata - so you can check schema markup as you browse, without pasting URLs into a separate structured data testing tool.

WHY SCHEMA CHECKER

Search is increasingly answered by entities, not pages. Google AI Overviews, rich results, and AI assistants like ChatGPT, Claude and Perplexity all lean on structured data to understand what a page is about - and whether your brand is the one worth citing in an answer. Checking that markup usually means viewing source, hunting for script tags, and pasting each block into a validator, template by template. Schema Checker removes that loop.

WHAT IT DOES

- Extracts every JSON-LD script block, including top-level arrays and nested @graph documents. Each entity inside a @graph becomes its own labelled, collapsible card and inherits the parent @context, per the JSON-LD spec.
- Walks Microdata (itemscope/itemprop) markup, including nested items, and resolves values from meta, link, a, img and time elements.
- Formatted view with syntax highlighting, or raw JSON - one card per entity, labelled with its @type and source.
- Surfaces parse errors loudly: malformed JSON-LD renders as an error card with the parser message and the raw markup, instead of silently failing in a crawler.
- Rescans automatically on every navigation, including single-page-app (history API) navigations - click through your site and audit every template.
- Sees what crawlers see after JavaScript runs: JSON-LD injected client-side is extracted too, which URL-based schema validators can miss.

HOW IT COMPARES TO OTHER SCHEMA TESTING TOOLS

Google's Rich Results Test and the Schema Markup Validator (validator.schema.org) are the right tools for vocabulary-level validation - confirming a Product or Recipe carries every property rich results require. Schema Checker complements them: it lives inside DevTools, checks every page as you click through a site, and shows extracted entities instantly. Use this panel to find, read and debug structured data fast; run the page through a validator when you need a compliance verdict.

HOW TO USE

1. Open DevTools (F12, or Cmd+Opt+I on Mac) on any page.
2. Select the Schema panel.
3. Structured data is scanned automatically - click Refresh to rescan at any time.

PRIVACY

Zero permissions. No data collection, no network requests, no analytics, no background scripts. Everything runs locally in your DevTools against the page you're inspecting.

ABOUT

Schema Checker is free and open source: github.com/aperitifagency/schema-checker

Written by Spencer Potts. Built and maintained by Aperitif Agency, a Melbourne digital marketing agency specialising in LLM & AI Optimisation - structuring content and schema so Google AI Overviews and AI assistants cite and recommend your brand. Learn more: aperitifagency.com.au/seo/llm-ai-optimisation

## Field values

- Category: Developer Tools
- Language: English
- Store icon: icons/icon128.png
- Screenshot: store-assets/screenshot-1280x800.jpg
- Small promo tile: store-assets/promo-small-440x280.jpg
- Marquee promo tile: store-assets/promo-marquee-1400x560.jpg
- Official URL: aperitifagency.com.au (select if offered; requires Search Console ownership)
- Homepage URL: https://aperitifagency.com.au/seo/llm-ai-optimisation/
- Support URL: https://github.com/aperitifagency/schema-checker/issues
- Mature content: No

## Privacy tab

- Single purpose description:
  "Schema Checker displays the Schema.org structured data (JSON-LD and
  Microdata) present on the page being inspected, in a Chrome DevTools
  panel, so developers and SEOs can review it. It has no other function."

- Permission justifications: the extension requests no permissions. If asked
  to justify the devtools_page entry: "devtools_page is required to add the
  Schema panel to DevTools. The panel uses chrome.devtools.inspectedWindow.eval
  to read structured data from the inspected page, only while DevTools is open."

- Remote code: No - all code is packaged with the extension.

- Data usage: does not collect or transmit any user data. Tick the
  certification; no privacy policy URL is required when no data is collected,
  but https://github.com/aperitifagency/schema-checker#privacy can be used if
  the form insists.
