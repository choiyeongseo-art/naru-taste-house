# First visit, destination art, and Haeundae plaza

## Entry and result flow

A valid saved result (0–3) is the completion flag. Visitors without a completed result enter the required test; main navigation is unavailable until completion. Returning guests use the browser's saved room, and members use their private account room. An initial page load opens home for a completed visitor, including when an old fragment was left in the address bar. In-app navigation and browser back navigation remain available after completion.

Finishing the test immediately persists the guest result, displays three destinations (avatar, room, matched Busan courses), and offers a dismissible bottom login prompt. Before authentication the current test is staged locally. For a new member, the guest state is imported; for an existing member, result, theme, avatar and deduplicated test history are merged while keeping their room, nickname and collection. The pending import clears only after successful account storage. Actual account sign-in was not performed during this change; the merge and existing storage schemas are covered by tests.

## Shared beach

`app/plaza.tsx` renders an isometric sand map and the existing customized avatar sprites. Clicking/tapping the floor or using arrow keys moves the avatar with bounded speed; the shoreline bounds keep it on the sand. Enter focuses chat. All four existing poses are available.

The shared avatar renderer clips each atlas frame explicitly in user-space coordinates, after applying hair-color filters. This avoids an SVG filter/viewport interaction that otherwise displayed the whole atlas for tinted hair. Mobile avatars, name badges and speech bubbles are enlarged independently of the map so they remain legible.

`app/use-plaza.ts` uses the existing Supabase client's Realtime Presence and Broadcast. The public room is `naru-haeundae-plaza-v1`; `localhost` uses a separate QA room, `naru-haeundae-plaza-qa-v1`. No new database table, elevated credential, or database migration is required. Public-channel access must remain enabled in Supabase. The connection status is visible, and offline visitors can reconnect.

Session UUIDs distinguish concurrent browser tabs. Only nickname, avatar appearance, position and pose enter Presence; account identifiers and email addresses are not broadcast. Presence and all incoming messages/movement are validated with Zod. Movement broadcasts are throttled, chat is limited to 160 characters and one submission per 1.2 seconds, messages are deduplicated and the current session keeps at most 80. The UI renders messages as text, not HTML. These client controls are for normal interaction; this is an ephemeral public chat rather than a moderated persistent service.

Nicknames and speech bubbles use the embedded DungGeunMo font; original chrome/glass bubble frames and controls are drawn in CSS/SVG. Peer chat can be hidden by clicking a name in the participant list. Messages disappear with the session, and speech bubbles expire after 6.5 seconds. Leaving removes the channel and Presence entry.

## Generated destination assets

Six original images are in `public/art/destinations/*-v2.png`: Jeonpo, Seomyeon, Nampo, Yeongdo, Gwangalli and the Haeundae map. Built-in `image_gen` was used. The user's room screenshot was a style reference: fine blue-grey outlines, matte pastel fills, restrained shading and isometric composition. Chrome stars/orbit ornaments remain around destination scenes. Jeonpo and Yeongdo are daytime; Seomyeon, Nampo and Gwangalli use pale evening lighting. The plaza uses cream sand and aqua water in daylight.

Final prompts and source provenance are recorded in the local `outputs/busan-assets-v2.json` manifest. Earlier 3D candidates are retained only in ignored outputs, not shipped. Place artwork is imaginative illustration, not a geographic photograph. Existing destination descriptions, official links and practical travel information are unchanged.

## Verification

- TypeScript and public Vite build pass; existing bundle-size warning remains.
- 15 automated checks cover entry routing, member-test merging, map projection/bounds/speed, incoming payload validation and existing character/storage behavior.
- Separate localhost UI tests completed all eight questions, checked the result buttons/login prompt, and reloaded into home.
- Two actual browser clients joined the real Supabase QA channel, saw each other's names, exchanged chat and matched the same moved avatar coordinates.
- Desktop and narrow viewport checks and screenshots are under ignored `outputs/plaza-qa/`.
