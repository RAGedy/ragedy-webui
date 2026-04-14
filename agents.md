# Agents Notes for `services/webui`

## Goal
Minimize merge conflicts by preferring files already touched in the recent redesign work by `k-lauren`.

## Known Context
- `f3ff44496` (2026-03-24): `feat: Ember visual redesign with dual-sidebar layout`
- The folder `Visual Redesign with Sidebar/` is a design/code bundle template reference (from Figma export), not the primary runtime app.
- `k-lauren` also made infra/build follow-up commits on 2026-03-25.

## Preferred Frontend Edit Surface (OpenWebUI runtime)
When changing the sidebar redesign, prioritize these existing frontend files:

- `src/app.css`
- `src/app.html`
- `tailwind.config.js`
- `src/lib/components/layout/Sidebar.svelte`
- `src/lib/components/layout/RightSidebar.svelte`
- `src/lib/components/layout/Sidebar/ChatItem.svelte`
- `src/lib/components/layout/EmberLogo.svelte`
- `src/lib/components/chat/Chat.svelte`
- `src/lib/components/chat/Navbar.svelte`
- `src/lib/components/chat/MessageInput.svelte`
- `src/lib/components/chat/ChatControls.svelte`
- `src/lib/components/chat/ModelSelector.svelte`
- `src/lib/components/chat/Placeholder.svelte`
- `src/lib/components/chat/Overview/Flow.svelte`
- `src/lib/components/chat/Messages/CodeBlock.svelte`
- `src/lib/components/chat/Messages/ResponseMessage.svelte`
- `src/lib/components/chat/Messages/UserMessage.svelte`
- `src/lib/components/channel/Channel.svelte`
- `src/lib/stores/index.ts`
- `src/routes/(app)/+layout.svelte`
- `src/routes/(app)/home/+layout.svelte`
- `src/routes/(app)/admin/+layout.svelte`
- `src/routes/(app)/workspace/+layout.svelte`
- `src/routes/(app)/playground/+layout.svelte`
- `src/routes/(app)/notes/+page.svelte`
- `src/routes/(app)/notes/[id]/+page.svelte`
- `src/routes/auth/+page.svelte`

## Template Reference Files
These were added in the redesign commit and are useful as visual/spec reference:

- `Visual Redesign with Sidebar/` (entire directory)

Prefer copying concepts/patterns into `src/` instead of wiring the template app directly into production routes.

## Other Files Touched by `k-lauren` (Use Only If Needed)
These files were changed by `k-lauren` but are mostly infra/assets, not primary UI iteration targets:

- `Dockerfile`
- `package.json`
- `package-lock.json`
- `docker-compose.yaml`
- `.env.example`
- `.gitmodules`
- `backend/requirements.txt`
- `backend/open_webui/static/*` (favicons, splash/logo, loader, webmanifest, CSV template)

## Practical Merge-Conflict Policy
- For UI work, stay inside the preferred frontend surface unless there is a clear requirement.
- Treat `Visual Redesign with Sidebar/` as a reference/template workspace.
- Before opening new files for edits, check whether one of the listed files can host the change first.
