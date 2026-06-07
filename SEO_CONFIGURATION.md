# SEO Configuration Guide for Sidha Reporting

## Overview
This document outlines the complete SEO implementation for the Sidha Reporting news platform.

## 1. Meta Tags & Open Graph

### Location: `/frontend/index.html`

All pages include:
- **Title Tag**: SEO-optimized with keywords
- **Meta Description**: Compelling 150-160 character description
- **Canonical URL**: Prevents duplicate content issues
- **Open Graph Tags**: For better social media sharing
- **Twitter Card Tags**: For Twitter-specific sharing
- **Robots Meta**: Controls search engine indexing

### Dynamic Meta Tags
Update in article detail pages with:
```html
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Article Summary">
<meta property="og:image" content="Article Image">
<meta name="twitter:card" content="summary_large_image">
```

## 2. Sitemap & Robots

### Robots.txt
- **Location**: `/frontend/public/robots.txt`
- **Rules**:
  - Allows crawling of public pages
  - Disallows admin routes, auth routes, and API endpoints
  - Sets crawl delay to reduce server load
  - Faster crawling for Googlebot

### Sitemap
- **Static Sitemap**: `/frontend/public/sitemap.xml`
- **Dynamic Sitemap**: `/api/seo/sitemap.xml` (includes all articles)
- **Frequency**: 
  - Homepage: Daily
  - Articles: Hourly
  - Category pages: Daily
  - Individual articles: Weekly

### Submit Sitemaps To:
1. Google Search Console
2. Bing Webmaster Tools
3. Yandex Webmaster Tools

## 3. URL Structure (SEO-Friendly)

### Implemented URLs:
```
Homepage: https://sdhareporting.com/
Articles: https://sdhareporting.com/articles
Article Detail: https://sdhareporting.com/articles/:articleId
Categories: https://sdhareporting.com/articles?category=politics
Payment: https://sdhareporting.com/payment
```

### Best Practices:
- ✅ Short, descriptive URLs
- ✅ Hyphens in URLs (not underscores)
- ✅ HTTPS protocol
- ✅ Mobile-friendly structure
- ✅ No parameters in canonicals

## 4. Structured Data (JSON-LD)

### Article Schema
Add to article detail pages:
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Article Title",
  "description": "Article Summary",
  "image": "Article Image URL",
  "datePublished": "2024-01-01T12:00:00Z",
  "dateModified": "2024-01-02T12:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Sidha Reporting",
    "logo": {
      "@type": "ImageObject",
      "url": "Logo URL"
    }
  }
}
```

### Organization Schema
Add to homepage:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Sidha Reporting",
  "url": "https://sdhareporting.com",
  "logo": "Logo URL",
  "sameAs": [
    "https://facebook.com/sidha-reporting",
    "https://twitter.com/sidha_reporting",
    "https://instagram.com/sidha_reporting"
  ]
}
```

## 5. Performance Optimization

### Frontend Optimization:
- ✅ Image lazy loading
- ✅ Code splitting
- ✅ CSS/JS minification
- ✅ HTTP/2 server push
- ✅ DNS prefetching

### Backend Optimization:
- ✅ GZIP compression (.htaccess)
- ✅ Browser caching headers (.htaccess)
- ✅ API response caching
- ✅ Database indexing

## 6. Mobile Optimization

### Mobile-Friendly Features:
- ✅ Responsive design (implemented)
- ✅ Mobile-friendly meta tags
- ✅ Viewport configuration
- ✅ Touch-friendly buttons
- ✅ Fast loading on mobile

### Mobile Testing:
- Use Google Mobile-Friendly Test
- Test on various screen sizes
- Check page speed with PageSpeed Insights

## 7. Content Optimization

### Title Tags:
- Length: 50-60 characters
- Include primary keyword
- Brand name at the end
- Example: "Breaking News: Political Updates | Sidha Reporting"

### Meta Descriptions:
- Length: 150-160 characters
- Include primary keyword
- Include call-to-action
- Unique for each page

### Heading Hierarchy:
- H1: Page title (only one per page)
- H2: Section headings
- H3: Subsections
- Use keywords naturally

### Image Alt Text:
- Descriptive alt text for all images
- Include keywords where relevant
- Format: "Article subject - brief description"

## 8. Internal Linking Strategy

### Linking Best Practices:
1. Link from homepage to main category pages
2. Link recent articles to related articles
3. Use descriptive anchor text
4. Avoid keyword stuffing in anchor text
5. Ensure logical site hierarchy

### Breadcrumb Navigation:
- Implement breadcrumbs for better navigation
- Use schema.org markup for breadcrumbs
- Helps with click-through rate from search results

## 9. Search Engine Submissions

### Submit To:
1. **Google Search Console**
   - URL: https://search.google.com/search-console
   - Add property with your domain
   - Upload sitemap

2. **Bing Webmaster Tools**
   - URL: https://www.bing.com/webmasters
   - Add site and sitemap

3. **Yandex Webmaster Tools**
   - URL: https://webmaster.yandex.com
   - For Russian/regional traffic

## 10. Security Headers (Implemented in .htaccess)

```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: Restricts browser features
```

## 11. SSL/HTTPS

- ✅ Use HTTPS on all pages (enforced in .htaccess)
- ✅ Valid SSL certificate
- ✅ Redirect HTTP to HTTPS

## 12. Google Analytics Setup

### Add to index.html:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_GA_ID');
</script>
```

### Track Events:
- Article views
- Clicks on external links
- Social shares
- Ad clicks
- User engagement

## 13. Monitoring & Optimization

### Tools to Use:
1. **Google Search Console**: Monitor search performance
2. **Google Analytics**: Track user behavior
3. **Page Speed Insights**: Monitor loading performance
4. **Schema.org Validator**: Validate structured data
5. **Screaming Frog**: Audit site structure

### Monthly Tasks:
- Review search console data
- Check Core Web Vitals
- Monitor rankings for target keywords
- Analyze competitor strategies
- Update underperforming content

## 14. Deployment Checklist

Before deployment:
- [ ] All meta tags are accurate
- [ ] Robots.txt is properly configured
- [ ] Sitemap.xml is accessible
- [ ] Structured data is validated
- [ ] .htaccess is in place
- [ ] HTTPS is enabled
- [ ] Google Analytics is configured
- [ ] Sitemap is submitted to Google
- [ ] Mobile design is tested
- [ ] Page speed is optimized

## 15. Common SEO Mistakes to Avoid

1. ❌ Duplicate meta descriptions
2. ❌ Keyword stuffing
3. ❌ Broken internal links
4. ❌ Poor mobile experience
5. ❌ Slow page loading
6. ❌ Non-descriptive URLs
7. ❌ Missing alt text on images
8. ❌ Outdated content
9. ❌ Weak internal linking
10. ❌ Not monitoring analytics

## 16. Next Steps

1. **Immediate**: 
   - Replace placeholders in index.html (GA ID, verification code)
   - Test all meta tags
   - Validate structured data

2. **Short-term** (1-2 weeks):
   - Submit sitemap to Google Search Console
   - Submit sitemap to Bing Webmaster Tools
   - Monitor initial search results

3. **Medium-term** (1-3 months):
   - Analyze search console data
   - Optimize underperforming pages
   - Build quality backlinks

4. **Long-term**:
   - Create SEO content strategy
   - Regular content updates
   - Continuous monitoring and optimization

---

For questions or SEO issues, consult with an SEO specialist or refer to Google's official SEO guidelines:
https://developers.google.com/search/docs
