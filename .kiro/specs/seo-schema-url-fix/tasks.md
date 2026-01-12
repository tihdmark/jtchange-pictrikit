# Implementation Plan

- [x] 1. Audit and fix JSON-LD schema syntax across all pages
  - [x] 1.1 Validate JSON-LD syntax in all 10 tool pages
    - Parse each JSON-LD block to check for trailing commas, unclosed brackets, invalid escapes
    - Fix any syntax errors found
    - Ensure @context, @type, and url properties are present and valid
    - _Requirements: 1.1, 1.2, 1.3, 1.4_




  - [x] 1.2 Validate JSON-LD syntax in info and legal pages






    - Check faq.html, contact.html, tutorials.html, templates.html, changelog.html, feedback.html, privacy.html, terms.html
    - Fix any syntax errors found
    - _Requirements: 1.1, 1.2, 1.3_
  - [x] 1.3 Validate JSON-LD in index.html and app.html


    - Verify homepage and app page schema are syntactically valid
    - _Requirements: 1.1, 1.2, 1.3_







- [x] 2. Synchronize canonical URLs with sitemap.xml
  - [x] 2.1 Update sitemap.xml to enforce strict URL format
    - Ensure homepage uses `https://www.pictrikit.com/` (with trailing slash)
    - Ensure all other pages use `https://www.pictrikit.com/page-name.html` (no trailing slash)
    - Remove any URLs that return 404


    - Update lastmod dates to current date
    - _Requirements: 2.1, 2.2, 2.4, 2.7, 3.1, 3.2, 3.4_
  - [x] 2.2 Audit and fix canonical tags in all HTML files
    - Verify each page's canonical href exactly matches its sitemap URL
    - Fix any mismatches (trailing slashes, missing .html, http vs https)
    - _Requirements: 2.1, 2.2, 2.4_
  - [x] 2.3 Update JSON-LD url properties to match canonical URLs
    - Ensure WebApplication url, BreadcrumbList item URLs all use canonical format
    - _Requirements: 5.1, 5.2_

- [x] 3. Verify and update vercel.json configuration
  - [x] 3.1 Confirm trailingSlash and redirect settings
    - Verify `trailingSlash: false` is set
    - Verify non-www to www redirect exists with permanent: true
    - Verify /index.html to / redirect exists
    - _Requirements: 2.3, 2.6_

- [x] 4. Add Tools Gallery component to all tool pages
  - [x] 4.1 Create and add Tools Gallery to compare-screenshots.html
    - Replace existing "Try Other Tools" section with full Tools Gallery (10 tools)
    - Ensure all links use `/page-name.html` format
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.2 Add Tools Gallery to combine-chat-screenshots.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.3 Add Tools Gallery to put-two-screenshots-together.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.4 Add Tools Gallery to stack-screenshots-vertically.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.5 Add Tools Gallery to arrange-screenshots-for-presentation.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.6 Add Tools Gallery to before-after-screenshot.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.7 Add Tools Gallery to clean-screenshot-layout.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.8 Add Tools Gallery to align-screenshots-centered.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.9 Add Tools Gallery to screenshot-grid-layout.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_
  - [x] 4.10 Add Tools Gallery to compare-ui-screenshots.html
    - Replace existing "Try Other Tools" section with full Tools Gallery
    - _Requirements: 4.2, 4.3, 4.5, 4.7_

- [x] 5. Audit and fix internal links across all pages
  - [x] 5.1 Fix internal links in navigation and footer of all pages
    - Ensure all nav links use `/page-name.html` format
    - Ensure homepage links use `/` format
    - Check header, footer, and any sidebar navigation
    - _Requirements: 4.1, 4.4, 4.6_

- [x] 6. Final validation
  - [x] 6.1 Perform View Page Source validation on all tool pages
    - Verify JSON-LD is visible in raw HTML source (not JS-injected)
    - Verify canonical URL matches sitemap entry
    - Document any issues found
    - _Requirements: 1.2, 1.3, 2.4_
