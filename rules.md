# Antigravity Rules for Minecraft Gems Store Project

## Firebase Firestore Data Structure Standards

### Document Schema Requirements

1. `users/{uid}` Collection:
   - `email` (string, required)
   - `mcUsername` (string, required - Minecraft Java/Bedrock/TLauncher IGN)
   - `gems` (number, required - minimum 0)
   - `isAdmin` (boolean, default: false)
   - `updatedAt` (timestamp)

2. `purchases/{purchaseId}` Collection:
   - `buyerUid` (string, required)
   - `buyerEmail` (string, required)
   - `targetUsername` (string, required - Target IGN)
   - `itemTitle` (string, required)
   - `costGems` (number, required)
   - `commandToRun` (string, required)
   - `createdAt` (timestamp)

## Order Processing & Webhook Rules
- When a user buys or gifts an item, ALWAYS validate that current user gems >= item price on the client side before updating Firestore.
- Deduct gems using Firestore transactions to prevent double-spending.
- Immediately dispatch a Discord Webhook request containing the EXACT console command required for DiscordSRV execution.

## Security & UI Rules
- Ensure target Minecraft usernames are sanitized (no spaces or invalid characters) before crafting console commands.
- Maintain the dark futuristic Minecraft gaming theme across all components.