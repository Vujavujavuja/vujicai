# Formspree Setup Instructions

This document explains how to set up the three Formspree forms for your Services page.

## Overview

Your Services page now has three distinct forms:
1. **AI Consulting Form** - For AI strategy and consulting inquiries
2. **Data Science Form** - For data analysis and analytics projects  
3. **AI Engineering Form** - For ML model development and deployment

## Setup Steps

### 1. Create a Formspree Account

1. Go to [formspree.io](https://formspree.io)
2. Sign up for a free account (allows 50 submissions/month)
3. Verify your email address

### 2. Create Three Forms

You need to create three separate forms in your Formspree dashboard:

#### Form 1: AI Consulting
- **Name**: "AI Consulting Inquiries"
- **Description**: "Form for AI strategy and consulting requests"

#### Form 2: Data Science  
- **Name**: "Data Science Projects"
- **Description**: "Form for data analysis and analytics projects"

#### Form 3: AI Engineering
- **Name**: "AI Engineering Services" 
- **Description**: "Form for ML model development and deployment"

### 3. Get Your Form Endpoints

After creating each form, Formspree will provide you with unique form endpoints that look like:
```
https://formspree.io/f/YOUR_FORM_ID
```

### 4. Update Your Code

Replace the placeholder form actions in `/src/app/services/page.tsx`:

```typescript
// Find these lines around line 40-60:
formAction: 'https://formspree.io/f/YOUR_AI_CONSULTING_FORM_ID'     // Replace with actual AI Consulting form ID
formAction: 'https://formspree.io/f/YOUR_DATA_SCIENCE_FORM_ID'      // Replace with actual Data Science form ID  
formAction: 'https://formspree.io/f/YOUR_AI_ENGINEERING_FORM_ID'    // Replace with actual AI Engineering form ID
```

### 5. Configure Form Settings (Optional)

In your Formspree dashboard, for each form you can:

- **Email Notifications**: Set where form submissions are sent (defaults to your account email)
- **Custom Subject Lines**: Customize email subject format
- **Auto-Reply**: Set up automatic responses to form submitters
- **Spam Protection**: Enable reCAPTCHA or honeypot protection
- **File Uploads**: Allow file attachments (if needed)

### 6. Test Your Forms

1. Run your development server: `npm run dev`
2. Navigate to `/services` 
3. Click "Get Started" on each service card
4. Fill out and submit each form
5. Check your email for submissions
6. Verify in your Formspree dashboard

## Form Data Structure

Each form submission includes:
- **name**: Submitter's name
- **email**: Submitter's email address  
- **company**: Company name (optional)
- **message**: Project description
- **service**: Which service they're inquiring about (AI Consulting, Data Science, or AI Engineering)

## Upgrading Your Plan

**Free Plan**: 50 submissions/month
**Gold Plan**: $10/month for 1,000 submissions
**Platinum Plan**: $20/month for 5,000 submissions

## Troubleshooting

- **Form not submitting**: Check that form endpoints are correct
- **Not receiving emails**: Check spam folder and verify email in Formspree settings
- **CORS errors**: Formspree automatically handles CORS for web forms
- **Spam submissions**: Enable reCAPTCHA in Formspree dashboard

## Security Notes

- Form endpoints are public but submissions are private
- Formspree automatically handles spam protection
- No sensitive data should be collected through these forms
- For sensitive projects, consider adding additional fields asking clients to use secure channels

## Next Steps

1. Create your Formspree account
2. Set up the three forms
3. Update the form IDs in your code
4. Test each form thoroughly
5. Consider setting up email templates for professional responses

Your forms are now ready to capture leads for your AI services!