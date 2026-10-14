<div align="center">

# 🚀 AI HUB SUMMARY

**The Ultimate Student Study Reader & Notes PWA**  
*Fast, clean, mobile-first web app designed for reading lectures, summaries, and sheets directly in a seamless dark theme.*

[✨ Live Demo / Website](https://ai-summary-woad-tau.vercel.app)

</div>

---

## 🌟 Features & Highlights
* **📱 Progressive Web App (PWA):** Fully installable on Android and iOS with native offline reading support.
* **⚡ Zero-Latency CDN Architecture:** Bypasses GitHub API rate limits using pre-built dynamic catalogs (`index.json`).
* **🌙 Permanent Dark Theme:** Eye-friendly interface optimized for late-night study sessions.
* **🔍 Instant Client-Side Search:** Quickly search across all lecture summaries and problem sets.
* **⭐ Starred Notes & Folders:** Pin important subjects and save key notes for quick exam revision.
* **⚙️ Advanced Reader Controls:** Built-in direct zoom, download tools, copy-link utilities, and smooth offset-aware scrolling.
* **🤖 Fully Automated Catalog:** GitHub Actions automatically re-indexes new content whenever lecture files are updated.

---

## 📂 Project Structure
```text
AI-SUMMARIES/
├── content/           # Organized subject folders containing HTML study materials
├── public/            # Static PWA assets, manifest, service worker & index.json
├── scripts/           # Automation scripts for dynamic catalog generation
└── index.html         # Single-page standalone reader core engine
