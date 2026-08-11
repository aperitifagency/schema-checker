// Chrome API stub + demo schemas for generating store screenshots.
// Loaded before ../panel.js by demo.html (built by generate.sh) so the real
// panel renders exactly as it does in DevTools, but with curated data.
'use strict';

window.__DEMO_SCHEMAS__ = [
  {
    source: 'JSON-LD',
    error: null,
    data: {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: 'Classic Sourdough Loaf',
      author: { '@type': 'Person', name: 'Elena Marsh' },
      datePublished: '2026-05-14',
      description: 'A crusty, open-crumb sourdough made with a mature starter and an overnight cold proof.',
      prepTime: 'PT45M',
      cookTime: 'PT50M',
      recipeYield: '1 loaf',
      recipeCategory: 'Bread',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: 4.8,
        ratingCount: 214
      }
    }
  },
  {
    source: 'JSON-LD',
    error: null,
    data: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: 'Rattan Proofing Basket - 23 cm',
      sku: 'BK-PRF-09',
      brand: { '@type': 'Brand', name: 'Crumb & Crust' },
      offers: {
        '@type': 'Offer',
        price: 34.95,
        priceCurrency: 'AUD',
        availability: 'https://schema.org/InStock'
      }
    }
  },
  {
    source: 'JSON-LD',
    error: null,
    data: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://example.com/' },
        { '@type': 'ListItem', position: 2, name: 'Recipes', item: 'https://example.com/recipes/' },
        { '@type': 'ListItem', position: 3, name: 'Sourdough' }
      ]
    }
  },
  {
    source: 'JSON-LD',
    error: null,
    data: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': 'https://example.com/#org',
      name: 'Crumb & Crust Bakery',
      url: 'https://example.com/',
      logo: 'https://example.com/logo.png',
      sameAs: [
        'https://www.instagram.com/crumbandcrust',
        'https://www.facebook.com/crumbandcrust'
      ]
    }
  },
  {
    source: 'Microdata',
    error: null,
    data: {
      '@type': 'Person',
      name: 'Elena Marsh',
      jobTitle: 'Head Baker',
      url: 'https://example.com/about/elena'
    }
  }
];

window.chrome = {
  devtools: {
    inspectedWindow: {
      eval: function (script, cb) { cb(window.__DEMO_SCHEMAS__, null); }
    },
    network: {
      onNavigated: { addListener: function () {} }
    }
  }
};
