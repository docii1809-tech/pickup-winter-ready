# Pickup Winter Ready

A complete static website built with HTML5, CSS3, and Vanilla JavaScript to help pickup truck owners prepare for freezing temperatures, snow, ice, and rural winter driving.

Live GitHub Pages target URL:
`https://docii1809-tech.github.io/pickup-winter-ready/`

---

## Directory Structure

```text
/
├── index.html                                 # Homepage, Gear Finder, Checklist preview
├── styles.css                                 # Complete responsive theme & layout styles
├── script.js                                  # Gear Finder, Checklist, Mobile Menu, Link hydration
├── affiliate-config.js                        # Central file for Amazon & eBay affiliate links
├── about.html                                 # About Us page
├── contact.html                               # Static contact form (creates email draft)
├── affiliate-disclosure.html                  # FTC Affiliate Disclosure page
├── privacy.html                               # Privacy Policy page
├── robots.txt                                 # Search crawler rules & sitemap link
├── sitemap.xml                                # XML sitemap for Google Search Console
├── .nojekyll                                  # Tells GitHub Pages to serve files as plain HTML
└── guides/
    ├── best-winter-jump-starters.html         # Winter Jump Starters guide
    ├── best-portable-tire-inflators.html      # Portable Tire Inflators guide
    ├── snow-ice-recovery-equipment.html       # Snow & Ice Recovery Equipment guide
    ├── winter-emergency-kits.html             # Winter Emergency Kits guide
    ├── winter-preparation-checklist.html      # Full 12-item printable interactive checklist
    └── winter-driving-advice.html             # Pickup Winter Driving Advice guide
```

---

## How to Add Your Affiliate Links (No HTML Edits Needed)

All Amazon Associates and eBay Partner Network links live in **one file**: `affiliate-config.js`.

1. Open `affiliate-config.js` on GitHub (even directly from the GitHub mobile website or app on your Android phone by tapping the pencil icon).
2. Also update `contactEmail` near the top of `affiliate-config.js` to your real contact email address.
3. Find any product under `products: { ... }`, for example:

```js
"jump-starter-hd-lithium": {
  category: "Winter Jump Starters",
  name: "Heavy-Duty Lithium Jump Starter (Full-Size V8 & Diesel Class)",
  amazonUrl: "",
  ebayUrl: "",
  amazonLabel: "View on Amazon",
  ebayLabel: "Check eBay"
}
```

4. Paste your full affiliate URL inside the quotes for `amazonUrl` and/or `ebayUrl`:

```js
  amazonUrl: "https://amzn.to/your-actual-link",
  ebayUrl: "https://ebay.us/your-actual-link",
```

5. Tap **Commit changes** on GitHub.

### How Placeholder Protection Works
- While `amazonUrl` or `ebayUrl` is empty (`""`), the shopping button displays `(Placeholder)` and shows an informative notice when clicked—it **never** sends visitors to broken or invented URLs.
- As soon as you paste a valid `https://...` URL, the button automatically becomes an active outbound shopping button with `target="_blank"` and `rel="nofollow sponsored noopener noreferrer"`.

---

## How to Update Page Content

- **Editing text or adding buying considerations:** Open any `.html` file in the root folder or `guides/` folder and edit the paragraph (`<p>`) or list (`<li>`) text directly.
- **Colors or spacing:** All theme colors (`--bg-canvas`, `--accent-lime`, `--text-primary`) are defined at the very top of `styles.css`.
- **Adding a new product to `affiliate-config.js`:** Add a new key in `affiliate-config.js`, then place a matching `<a data-product-id="your-new-key" data-retailer="amazon" href="#affiliate-placeholder">Amazon Link</a>` in the HTML page.

---

## How to Publish on GitHub Pages

1. Upload all website files (`index.html`, `styles.css`, `script.js`, `affiliate-config.js`, `about.html`, `contact.html`, `affiliate-disclosure.html`, `privacy.html`, `robots.txt`, `sitemap.xml`, `.nojekyll`, and the `guides/` folder) to the **root** of your GitHub repository (`pickup-winter-ready`), without deleting your existing `.gitignore`.
2. Open your repository on GitHub and go to **Settings → Pages**.
3. Under **Build and deployment**:
   - **Source:** `Deploy from a branch`
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Click **Save**.
5. Wait 1–2 minutes and visit:
   `https://docii1809-tech.github.io/pickup-winter-ready/`

### Submitting to Google Search Console
Once published:
1. Open Google Search Console and add the URL prefix `https://docii1809-tech.github.io/pickup-winter-ready/`.
2. Verify ownership (HTML tag or Google Analytics method).
3. Submit `sitemap.xml` under **Sitemaps**.
