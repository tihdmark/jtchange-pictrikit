# Requirements Document

## Introduction

This specification addresses critical SEO issues affecting PictriKit's visibility in Google Search Console. The primary problems are:
1. JSON-LD schema markup not being detected by Google Rich Results Test ("No items detected")
2. "Page with redirect" errors (22 pages) due to URL inconsistency
3. 404 errors (2 pages) from sitemap referencing non-existent URLs

The goal is to ensure all structured data is visible in the raw HTML source (View Page Source), standardize URL routing to eliminate redirects, and clean up the sitemap.

## Glossary

- **JSON-LD**: JavaScript Object Notation for Linked Data - a method of encoding structured data in HTML
- **Schema Markup**: Structured data vocabulary that helps search engines understand page content
- **Canonical URL**: The preferred URL for a page when multiple URLs could serve the same content
- **GSC**: Google Search Console - Google's tool for monitoring website search performance
- **Rich Results Test**: Google's tool for validating structured data markup
- **SSR**: Server-Side Rendering - generating HTML on the server before sending to client
- **View Page Source**: Browser feature showing raw HTML before JavaScript execution

## Requirements

### Requirement 1: Hard-coded Schema Markup in Static HTML

**User Story:** As a search engine crawler, I want to see JSON-LD schema markup in the initial HTML response, so that I can properly index rich results for the website.

#### Acceptance Criteria

1. WHEN a crawler requests any tool page, THE PictriKit_System SHALL return HTML containing a `<script type="application/ld+json">` block hard-coded directly in the `<head>` section of the static HTML file.

2. THE PictriKit_System SHALL NOT generate or inject JSON-LD schema via JavaScript at runtime; all schema markup SHALL be present in the static HTML source files.

3. WHEN a user performs "View Page Source" on any page, THE PictriKit_System SHALL display the complete JSON-LD schema markup without requiring JavaScript execution.

4. THE PictriKit_System SHALL ensure all JSON-LD blocks contain syntactically valid JSON with no trailing commas, unclosed brackets, or invalid characters.

5. WHEN Google Rich Results Test analyzes any tool page, THE PictriKit_System SHALL provide schema markup that results in at least one detected item type (WebApplication, HowTo, or FAQPage).

### Requirement 2: URL Standardization with Strict Trailing Slash Policy

**User Story:** As a website administrator, I want all URLs to follow a single consistent format with no trailing slashes, so that Google Search Console does not report redirect errors.

#### Acceptance Criteria

1. THE PictriKit_System SHALL use the URL format `https://www.pictrikit.com/page-name.html` (no trailing slash) as the canonical standard for all HTML pages except the homepage.

2. THE PictriKit_System SHALL use `https://www.pictrikit.com/` as the canonical URL for the homepage (trailing slash only for root).

3. THE PictriKit_System SHALL configure `trailingSlash: false` in vercel.json to align with Vercel's default behavior.

4. WHEN a canonical tag exists on a page, THE PictriKit_System SHALL ensure the href value exactly matches the URL in sitemap.xml for that page with no trailing slash.

5. WHEN an internal link references another page, THE PictriKit_System SHALL use the exact canonical URL format including the `.html` extension and no trailing slash.

6. THE PictriKit_System SHALL configure Vercel redirects to send requests for `/index.html` to `/` with a 301 permanent redirect.

7. THE PictriKit_System SHALL ensure sitemap.xml URLs have no trailing slashes except for the homepage root URL.

### Requirement 3: Sitemap Accuracy

**User Story:** As a search engine crawler, I want the sitemap to only contain URLs that return 200 OK responses, so that I can efficiently crawl the website without encountering errors.

#### Acceptance Criteria

1. THE PictriKit_System SHALL include only URLs in sitemap.xml that correspond to existing, accessible pages returning HTTP 200 status.

2. THE PictriKit_System SHALL remove any URLs from sitemap.xml that return 404 Not Found responses.

3. WHEN a page is removed from the website, THE PictriKit_System SHALL remove the corresponding URL from sitemap.xml within the same deployment.

4. THE PictriKit_System SHALL ensure all sitemap URLs use the `https://www.` prefix consistently.

### Requirement 4: Cross-Tool Navigation with Shared Tools Gallery

**User Story:** As a website visitor, I want all navigation links to go directly to the final URL without redirects, so that page loads are fast and consistent.

#### Acceptance Criteria

1. WHEN rendering navigation elements (header, footer, sidebar), THE PictriKit_System SHALL use absolute paths with `.html` extensions for all internal page links.

2. THE PictriKit_System SHALL include a "Tools Gallery" component in the footer of every tool page containing links to all other tool pages.

3. THE PictriKit_System SHALL ensure the Tools Gallery component uses consistent HTML structure across all pages to strengthen internal linking.

4. THE PictriKit_System SHALL ensure footer "Popular Tools" links use the format `/page-name.html`.

5. THE PictriKit_System SHALL ensure "Try Other Tools" section links use the format `/page-name.html`.

6. WHEN a link points to the homepage, THE PictriKit_System SHALL use `/` as the href value.

7. THE PictriKit_System SHALL ensure every tool page links to at least 5 other tool pages to address "Discovered - currently not indexed" issues.

### Requirement 5: Schema Content Validation

**User Story:** As a content manager, I want all schema markup to accurately reflect page content, so that search engines display correct information in rich results.

#### Acceptance Criteria

1. THE PictriKit_System SHALL ensure the `url` property in WebApplication schema matches the page's canonical URL exactly.

2. THE PictriKit_System SHALL ensure BreadcrumbList schema contains valid `item` URLs using the canonical format.

3. THE PictriKit_System SHALL ensure all schema `@type` values are valid Schema.org types.

4. WHEN a page contains FAQPage schema, THE PictriKit_System SHALL ensure visible FAQ content on the page matches the schema content exactly.
