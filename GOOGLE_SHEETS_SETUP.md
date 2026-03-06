# Iron Beast Fitness – Contact & Interaction Setup

This guide covers the contact form (Google Sheets), success modal, and WhatsApp floating button.

---

## Step 1: Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **Blank** to create a new spreadsheet
3. Name it something like **Iron Beast Enquiries** (top-left title)
4. In **row 1**, add these column headers:

   | A | B | C | D | E |
   |---|---|----|----|-----|
   | Timestamp | Name | Email | Phone | Message |

   *(The script will also add these headers automatically if the sheet is empty.)*

---

## Step 2: Add the Google Apps Script

1. In your Google Sheet, go to **Extensions → Apps Script**
2. A new tab opens with the Apps Script editor
3. Delete any code in `Code.gs` (the default file)
4. Copy the full contents of `google-apps-script/Code.gs` from this project
5. Paste it into the Apps Script editor
6. Click **Save** (or Ctrl+S)
7. Name the project (e.g. **Iron Beast Contact Form**)

---

## Step 3: Authorize the Script

1. In the Apps Script editor, select the function **setup** from the dropdown (top toolbar)
2. Click **Run**
3. A popup will ask for authorization:
   - Click **Review permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
4. In the **Execution log** (bottom), you should see: `Setup complete! Sheet "Enquiries" is ready.`

---

## Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy → New deployment**
2. Click the gear icon next to **Select type** → choose **Web app**
3. Set:
   - **Description:** Contact form backend
   - **Execute as:** Me (your email)
   - **Who has access:** Anyone
4. Click **Deploy**
5. Copy the **Web app URL** (it will look like:  
   `https://script.google.com/macros/s/AKfycb.../exec`)

---

## Step 5: Add the URL to Your Website

1. Open `script.js` in your project
2. Find this line near the top:

   ```javascript
   const GOOGLE_SCRIPT_URL = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```

3. Replace `PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web app URL:

   ```javascript
   const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```

4. Save the file

---

## Step 6: Test the Form

1. Open your website (locally or on Netlify)
2. Fill in the contact form and click **Send Message**
3. You should see a **success modal**: "Message sent successfully! We will contact you soon." (auto-closes in 3 seconds)
4. The form clears automatically
5. Open your Google Sheet and confirm a new row with the data

---

## Troubleshooting

| Problem | Solution |
|--------|----------|
| **"Form is not configured yet"** | You haven’t replaced the placeholder URL in `script.js`. Do Step 5. |
| **"Something went wrong"** | Check the browser console (F12 → Console) for errors. Confirm the Web app URL is correct and that the script is deployed with “Anyone” access. |
| **CORS error** | Ensure the Apps Script is deployed as a Web app with **Who has access: Anyone**. Redeploy if needed. |
| **No new rows in Sheet** | Make sure you authorized the script (Step 3) and ran `setup` once. Check Apps Script **Executions** for errors. |

---

## WhatsApp Floating Button

1. Open `script.js`
2. Find `WHATSAPP_NUMBER` and replace with your WhatsApp number (no spaces or +):
   - Example: `919876543210` for +91 98765 43210
   - For other countries: `1234567890` for US, `441234567890` for UK, etc.
3. Optionally edit `WHATSAPP_MESSAGE` to change the predefined chat message

---

## Data Stored

Each submission adds a row with:

- **Timestamp** – When the form was submitted  
- **Name** – Visitor’s name  
- **Email** – Visitor’s email  
- **Phone** – Phone number (optional field)  
- **Message** – The enquiry text  

You can sort, filter, and export the sheet like any other spreadsheet.
