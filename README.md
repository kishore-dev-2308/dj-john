# DJ John | Live & Local 🎧⚡

High-voltage responsive web application and event inquiry portal for **DJ John — Live & Local**.

Designed with neon aesthetics (Cyber Yellow `#FFE500`, Neon Pink `#FF2E93`, Electric Cyan `#00F0FF`) inspired by club lighting, professional stage equipment, and modern glassmorphism.

---

## 📇 Visiting Card Specifications Included

| Field | Detail |
| :--- | :--- |
| **Artist Name** | **DJ JOHN** |
| **Motto / Tagline** | *Live & Local* |
| **Primary WhatsApp / Phone** | `+91 73588 30098` |
| **Secondary Phone Line** | `+91 63821 78394` |
| **Official Email** | `djohn28@gmail.com` |
| **Core Occasions** | Wedding Reception, Birthday Parties, Club Gigs & Parties, Mega Celebrations |

---

## 🌟 Key Features & Updates

### 1. 🎨 High-Voltage UI & Animations
- **Floating Ambient Glow Orbs**: Smooth CSS keyframe floating effects in the background.
- **Infinite Genre Ticker Marquee**: Continuous marquee banner celebrating Tamil Kuthu, Bollywood blockbusters, Commercial EDM, Punjabi beats, and Club Hits.
- **Dynamic Equalizer Wave**: CSS animated dancing audio bars in the Hero section and About section.
- **Button Shimmer & 3D Glassmorphism**: Hover elevations with glow borders.

### 2. 📱 Flawless Mobile Responsiveness
- **Mobile Bottom Quick-Action Dock**: Sticky 1-tap call & WhatsApp buttons at the bottom of the screen on all mobile devices.
- **Zero Number Wrapping Issues**: All phone numbers (`+91 73588 30098`, `+91 63821 78394`), email (`djohn28@gmail.com`), and call buttons use strict `whitespace-nowrap` and responsive flex layouts so they never break mid-number across lines.
- **Drawer Menu**: Smooth slide-down navigation drawer with direct quick-call buttons.

### 3. 📋 Instant Event Planner & WhatsApp Booking Generator
- **No Price Display**: As requested, price estimation has been replaced with a real-time **Custom Event Setup Summary** (Occasion, Performance Duration, Crowd Capacity, Preferred Date, City, and Equipment selection).
- **Clean WhatsApp Message Formatting**: Resolves all emoji display issues by using universal text formatting, clear section dividers (`---------------------------------------`), and bold markdown (`*...*`) that renders 100% cleanly on all iOS, Android, and desktop WhatsApp clients.

---

## 📁 Project Directory Structure

```text
d:/Tasks/dj-john/
├── index.html               # Main modular production landing page
├── standalone.html          # Self-contained zero-dependency single-file version
├── package.json             # NPM package scripts & configuration
├── vite.config.js           # Vite development server configuration
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── public/
│   └── favicon.svg          # Neon headphones vector icon
└── assets/
    ├── css/
    │   └── style.css        # Custom keyframe animations, marquee, glassmorphism & mobile styles
    ├── js/
    │   ├── calculator.js    # Event planner & WhatsApp URL builder
    │   ├── gallery.js       # Dynamic filterable photo & video gallery engine
    │   └── main.js          # Navigation, sticky header elevation & UI listeners
    └── media/
        ├── gallery-manifest.js # Event media registry
        ├── photos/          # Folder for local uploaded event photos
        └── videos/          # Folder for local uploaded event videos
```

---

## 🛠️ How to Open & Run

### Method 1: Instant Direct Launch (No Installation Required)
Simply double-click `index.html` or `standalone.html` in Windows Explorer to open it directly in Chrome, Edge, Safari, or Firefox.

### Method 2: Development Server (Optional)
```powershell
cd d:\Tasks\dj-john
npx vite
```
Open `http://localhost:3000` in your browser.
