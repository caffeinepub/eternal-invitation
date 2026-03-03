# Eternal Invitation

## Current State
- Designs have: id, categoryId, name, description, price (text), videoUrl (text/URL)
- Admin Designs tab has a "Video URL" text input where admin pastes a YouTube or direct URL
- Category detail page renders youtube embed or `<video>` tag based on the URL
- All designs always show price (or "Contact for Price" if empty)

## Requested Changes (Diff)

### Add
- `showPrice: Bool` field to the `Design` type in the backend
- Video file upload input in the admin Designs tab (upload directly from device/gallery), replacing the YouTube URL text field
- Uploaded video is stored via the blob-storage component and its hash URL is saved as `videoUrl`
- Upload progress indicator while the video is uploading
- Per-design price toggle switch: when OFF, price is hidden on public category pages; when ON, price is visible
- Admin can assign a design to any category from the category dropdown (already exists — no change needed)

### Modify
- Backend `Design` type: add `showPrice: Bool` field
- `createDesignWithSession` and `updateDesignWithSession`: accept `showPrice: Bool` parameter
- `createDesign` and `updateDesign` (legacy): accept `showPrice: Bool` parameter
- `backend.d.ts`: reflect new `showPrice` field and updated signatures
- Admin `DesignsTab`: replace Video URL text field with a file upload button; add showPrice toggle switch
- `CategoryDetailPage`: only show price block when `design.showPrice === true`
- `useCreateDesignSession` / `useUpdateDesignSession` hooks: pass `showPrice` through

### Remove
- Nothing removed (YouTube URL text input replaced by file upload)

## Implementation Plan
1. Update `main.mo`: add `showPrice: Bool` to `Design` type and all create/update functions
2. Update `backend.d.ts`: reflect new `showPrice` field and updated function signatures
3. Update `useQueries.ts`: pass `showPrice` through create/update session hooks
4. Update `DesignsTab.tsx`: add video file upload using StorageClient (blob-storage), progress bar, and showPrice toggle
5. Update `CategoryDetailPage.tsx`: render price block only when `design.showPrice === true`
