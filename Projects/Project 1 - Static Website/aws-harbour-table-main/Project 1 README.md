# AWS Harbour Table

A complete, modern, premium-quality static website for **Harbour Table**, a fictional high-end seafood and grill restaurant located at the V&A Waterfront in Cape Town, South Africa.

This project is built from scratch with pure frontend technologies (**HTML5**, **CSS3**, **Vanilla JavaScript**) and is optimized for direct deployment to **Amazon S3 Static Website Hosting**.

---

## 🌊 Project Description

**Harbour Table** offers a modern dining experience with fresh Atlantic seafood, premium local steaks, artisan gourmet burgers, and handcrafted cocktails. The website showcases a high-end luxury dark navy and gold aesthetic, glassmorphism UI accents, full responsiveness, scroll-triggered animations, interactive forms, a client-side user authentication system powered by browser Local Storage, and an integrated Dark Mode toggle.

---

## ⭐ Features

*   **Responsive Luxury Design**: Fluid layouts optimized for Desktop, Tablet, and Mobile devices with a sticky glassmorphic navigation header.
*   **Dark Mode Toggle**: Persistent dark/light theme switcher using browser Local Storage to remember user preference.
*   **Why Choose Us & AWS Sections**: Informational cards illustrating the value proposition of the restaurant and highlighting the S3 hosting architecture.
*   **Interactive Menu**: Categorized dishes with descriptions, prices, real local image assets, and "Add to Order" quick action hooks.
*   **Relative QR Code**: High-fidelity vector QR code that links directly to the menu page, working seamlessly on local servers and AWS S3 endpoints.
*   **Simulated Authentication System**: Fully local client-side registration, login, logout, and persistent session logic using browser Local Storage (no server-side backend required).
*   **Personal Customer Dashboard**: Displays personalized welcome states and dynamically loads booking history and previous orders from Local Storage.
*   **Table Booking & Online Ordering Forms**: Interactive forms with clean client-side validation that write records to history and redirect to confirmation templates.
*   **Image Gallery & Lightbox Viewer**: Category-filtered image grid showing food, drinks, and dining spaces with a custom-built zoom lightbox.
*   **SEO Optimized**: Semantic HTML5 tags, unique titles, description/keyword metadata, and Open Graph parameters for all pages.
*   **Accessibility**: Standardized contrast, keyboard navigation friendliness, and screen-reader accessible alt text.

---

## 🛠️ Technologies Used

*   **HTML5**: Structurally semantic layout (header, nav, main, section, footer, time, address).
*   **CSS3**: Custom properties (CSS variables), grid/flexbox models, animations, media queries, and dark theme support.
*   **Vanilla JavaScript**: ES6 modules/functions, DOM manipulation, Local Storage operations, forms validation, Intersection Observer API.

---

## 📂 Folder Structure

```
AWS Harbour Table/
├── index.html            # Landing / Home Page
├── about.html            # About Us & History Timeline
├── menu.html             # Digital Menu Card Grid
├── gallery.html          # Filterable Food & Venue Gallery
├── booking.html          # Table Reservation Form
├── order.html            # Takeout / Delivery Ordering Form
├── login.html            # Simulated User Login
├── register.html         # Simulated User Registration
├── profile.html          # Customer History Dashboard
├── contact.html          # Operating Hours & Contact Form
├── confirmation.html     # Success Booking/Order page
├── privacy.html          # Legal Privacy Policy Placeholder
├── terms.html            # Legal Terms & Conditions Placeholder
├── styles.css            # Centralized Theme & Styling
├── script.js             # Client-side Interactions & Authentication
├── favicon.svg           # Website Navigation Icon
├── README.md             # Project Documentation
├── images/
│   ├── logo.svg          # Brand Vector Logo
│   ├── qrcode.svg        # Digital Menu QR Code
│   ├── hero_bg.png       # Waterfront Sunset Backdrop
│   ├── seafood_platter.png # Luxury Seafood Platter
│   ├── wagyu_steak.png   # Premium Grilled Steak
│   ├── gourmet_burger.png  # High-end Hamburger
│   ├── cocktail.png      # Gold Gilded Cocktail
│   ├── dessert.png       # Warm Chocolate Fondant
│   ├── interior.png      # Restaurant Interior View
│   ├── exterior.png      # Outdoor Sunset Deck View
│   └── chef.png          # Kitchen Preparations Photo
├── icons/                # Folder for supplementary SVG icons
└── assets/               # Folder for generic theme elements
```

---

## 🚀 How to Run Locally

Since this is a fully static website, you do not need to install node packages or database servers.

1.  **Clone / Download** this repository.
2.  Open the folder in your preferred code editor (e.g., VS Code).
3.  Serve the files using a local development server to test JavaScript Local Storage and pathing accurately.
    *   *Option A (VS Code Live Server)*: Install the **Live Server** extension, right-click `index.html`, and select **Open with Live Server**.
    *   *Option B (Python)*: Run `python3 -m http.server 8000` in the terminal from the root folder, and visit `http://localhost:8000`.
    *   *Option C (NPM / Serve)*: Run `npx serve` in the project directory.

---

## ☁️ AWS S3 Deployment Instructions

This website is designed for **Amazon S3 Static Website Hosting** with zero modification.

### Step 1: Create an S3 Bucket
1.  Open the **AWS Management Console** and navigate to **S3**.
2.  Click **Create bucket**.
3.  Provide a unique **Bucket name** (e.g., `harbour-table-waterfront`).
4.  Choose the **AWS Region** closest to your audience (e.g., `af-south-1` Cape Town).
5.  Under **Object Ownership**, keep **ACLs disabled**.
6.  Under **Block Public Access settings for this bucket**:
    *   **Uncheck** "Block *all* public access" (required so public visitors can view the HTML files).
    *   Acknowledge the warning checkbox at the bottom.
7.  Click **Create bucket**.

### Step 2: Enable Static Website Hosting
1.  Click on your newly created bucket and navigate to the **Properties** tab.
2.  Scroll down to the bottom to find **Static website hosting** and click **Edit**.
3.  Choose **Enable**.
4.  Under **Hosting type**, select **Host a static website**.
5.  Set the **Index document** to `index.html`.
6.  Set the **Error document** to `index.html` (or a dedicated 404 page if added).
7.  Click **Save changes**.
8.  S3 will generate a **Bucket website endpoint** at the bottom of the properties tab (e.g., `http://harbour-table-waterfront.s3-website.af-south-1.amazonaws.com`). Note this URL.

### Step 3: Configure Bucket Policy (Public Read)
To allow anyone on the internet to read your static pages, add a bucket policy.
1.  Go to the **Permissions** tab of the bucket.
2.  Under **Bucket policy**, click **Edit**.
3.  Paste the following JSON policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):
    ```json
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Sid": "PublicReadGetObject",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
            }
        ]
    }
    ```
4.  Click **Save changes**.

### Step 4: Upload Your Files
1.  Navigate to the **Objects** tab of your bucket.
2.  Click **Upload**.
3.  Drag and drop the contents of this folder (including `index.html`, all other HTML pages, `styles.css`, `script.js`, `favicon.svg`, and the `images/` directory). *Make sure you upload the files directly, not the parent folder container.*
4.  Click **Upload** at the bottom.
5.  Once the upload finishes, open the **Bucket website endpoint** in your browser to view your live cloud-hosted website!

---

## 📸 Screenshots

*(Screenshots of desktop, tablet, and mobile views will be placed here after styling is finalized)*

---

## 👥 Development Team

*   **Cloud Infrastructure Engineer**: *[Name / Role]*
*   **UI/UX Designer & Lead Developer**: *Antigravity (Google DeepMind Team)*

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
