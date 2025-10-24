## Overview

Spani Plug provides:

- **Trust:** Ratings and reviews prevent scams.  
- **Accessibility:** Free, mobile-first, low-data, multilingual (English, isiZulu, Afrikaans, Xhosa), color-blind friendly.  
- **Reach:** Geolocation-based discovery increases customers for service providers.

The MVP focuses on:

- Service provider and customer profiles  
- Provider discovery by skill and location  
- Basic review system and ratings  
- Multilingual support  
- Offline/low-data optimization via PWA

---

## Features

### Service Providers

- Profile management (name, photo, skills, location, rate)  
- Skill listing and rate updates  
- Geolocation (manual or GPS)  
- Customer reviews  
- Language toggle  
- Offline access (PWA)  
- Image compression  
- Notifications (web push)

### Customers

- Profile setup (name, contact, location)  
- Provider search and discovery  
- Distance display using geolocation  
- Ratings & reviews  
- Multilingual toggle  
- Offline mode (cached searches)  
- Lazy loading for media

### Admin

- User management (view, edit, suspend accounts)  
- Content moderation (photos, reviews)  
- Analytics and insights  
- PWA control  
- Security and audit logs

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, PWA support  
- **Backend:** Node.js, Express  
- **Database & Auth:** Supabase (PostgreSQL, Storage, Auth)  
- **Optional Integrations:** Twilio (SMS verification), LibreTranslate API (translation management)

---

## Installation

### Clone the repository

```bash
git clone <repo-url>
cd spani-plug
npm install
npm run dev