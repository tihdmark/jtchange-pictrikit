# Supabase Setup Guide for Feedback System

## Problem
The feedback page shows "Failed to load" because Supabase environment variables are not configured in Vercel.

## Solution

### 1. Get Supabase Credentials

If you already have a Supabase project:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL (SUPABASE_URL)
   - anon/public key (SUPABASE_ANON_KEY)

If you don't have a Supabase project yet:
1. Go to https://supabase.com
2. Sign up/Login
3. Create a new project
4. Wait for setup to complete
5. Follow the steps above to get credentials

### 2. Configure Vercel Environment Variables

#### Option A: Via Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Select your project (pictrikit)
3. Go to Settings → Environment Variables
4. Add these variables:
   - Name: `SUPABASE_URL`
     Value: `https://your-project.supabase.co`
   - Name: `SUPABASE_ANON_KEY`
     Value: `your-anon-key-here`
   - Name: `FEEDBACK_ADMIN_TOKEN` (optional, for admin features)
     Value: `your-secret-token`
5. Click "Save"
6. Redeploy your project

#### Option B: Via Vercel CLI
```bash
vercel env add SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add SUPABASE_ANON_KEY
# Paste your anon key when prompted

vercel env add FEEDBACK_ADMIN_TOKEN
# Create a secure random token
```

### 3. Database Schema

The feedback table should already exist. If not, run this SQL in Supabase SQL Editor:

```sql
-- See supabase-schema.sql for the complete schema
```

### 4. Verify Setup

After configuring environment variables:
1. Redeploy on Vercel (or wait for auto-deploy)
2. Visit https://www.pictrikit.com/feedback.html
3. The page should now load feedback messages
4. Try submitting a test message

## Troubleshooting

### Still showing "Failed to load"
- Check Vercel deployment logs for errors
- Verify environment variables are set correctly
- Make sure Supabase project is active (not paused)

### "Database not configured" error
- Environment variables are missing or incorrect
- Redeploy after adding variables

### Network errors
- Check Supabase project status
- Verify API endpoint is accessible
- Check browser console for CORS errors

## Current Status

✅ Code updated with better error handling
✅ Friendly error messages added
⚠️ Environment variables need to be configured in Vercel
⚠️ Supabase project needs to be set up (if not already)

## Next Steps

1. Configure Supabase credentials in Vercel
2. Redeploy the project
3. Test the feedback system
