# Elimeni AI frontend integration — OpenAI + Claude connector

Changed files:
- `src/lib/api.js`: shared connector inspection/capabilities/approved-action API clients; image data sent with chats.
- `src/app/chat/page.js`: read-only inspection UI, explicit high-impact action review button, image file to base64 request integration.
- `src/components/AddWebsiteModal.js`: refreshed manual token onboarding language without removing legacy connection.
- `src/app/download/page.js`: download metadata/branding updated to connector v1.2.0.
- `public/elimeni-ai-connector.zip`: updated WordPress plugin package for download.

Existing routes and Supabase database unchanged. Uploading a screenshot uses base64 JSON and accepts JPG, PNG, WebP and GIF up to 8 MB. Existing image previews are transient in the browser and are not uploaded to Supabase Storage.

Compatibility: requires the corresponding backend `/api/sites/:id/inspect`, `/api/sites/:id/connector-action` and `/api/chat/message` image support deployed. Existing token connection remains the working onboarding method. Application Password authorization is NOT implemented by that backend.

SECURITY: Current `confirm:true` backend action API does not establish server-recorded human approval. Its allowlist and WordPress plugin authorization should be hardened before high-impact operations on production sites. In addition the WordPress plugin's embedded chat iframe has a legacy token-in-URL issue; avoid embedded chat until resolved.

TESTING: Frontend production build was not run because node_modules were not installed. Run `npm ci && npm run build` and test on staging before deployment.
