// MOON Minecraft Web Store - Core Application Logic (Compat Mode for file:// double-click)

// Discord Webhook Config
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1537114089447493642/paeMDP7SAkrqkwsfzMw19kf32NuJ_xTMBhR7LC1k2T2kpjiUe0QWeMFoFB9MdA5-cDARE";
const WHATSAPP_PHONE_NUMBER = "YOUR_PHONE_NUMBER"; // e.g., 94771234567

// Store Catalog Dataset (Updated to match exact poster details, gem values & theme colors)
const STORE_ITEMS = [
  // ================= Category: Ranks & Permissions (from Poster 1) =================
  {
    id: "rank_vip",
    title: "VIP Rank",
    category: "ranks",
    cost: 200, // 200 Gems from Poster
    theme: "gold",
    badge: "200 GEMS",
    tagline: "EVERYTHING YOU NEED TO PLAY BETTER!",
    description: "Grants VIP Rank with 11 powerful commands & passive perks.",
    perks: [
      "🏠 Multiple Homes <code>/sethome &lt;name&gt;</code>",
      "🎁 Daily Reward <code>1x COMMON KEY</code>",
      "🔑 Epic Key <code>Every 2 Days</code>",
      "⚒️ Portable Anvil <code>/anvil</code>",
      "🎨 Rename Items with Colors <code>Color Codes</code>",
      "🟢 Free Anvil Usage <code>No XP Cost</code>",
      "📦 Portable Ender Chest <code>/ec</code>",
      "🍗 Feed Yourself <code>/feed</code>",
      "🪶 Fly in Survival Worlds <code>/fly</code>",
      "🧰 Portable Crafting Table <code>/craft</code>",
      "🟩 Fly in OneBlock World <code>/fly</code>"
    ],
    command: "ei give {target_username} vip",
    image: "assets/vip_crown.png"
  },
  {
    id: "rank_mvp",
    title: "MVP Rank",
    category: "ranks",
    cost: 300, // 300 Gems from Poster
    theme: "cyan",
    badge: "INCLUDES ALL VIP!",
    tagline: "MORE FEATURES, MORE FREEDOM!",
    description: "Grants MVP Rank including all VIP perks plus Chat Colors & XP protection.",
    perks: [
      "✨ INCLUDES ALL VIP PERMISSIONS!",
      "💬 Chat Colors <code>Use Color Codes</code>",
      "𝑩𝑰 Chat Formats <code>Bold, Italic</code>",
      "🪖 Hat <code>/hat</code>",
      "🟢 Keep XP on Death <code>Passive Ability</code>",
      "🏠 Multiple Homes <code>/sethome &lt;name&gt;</code>"
    ],
    command: "ei give {target_username} mvp",
    image: "assets/mvp_crown.png"
  },
  {
    id: "rank_elite",
    title: "ELITE Rank",
    category: "ranks",
    cost: 400, // 400 Gems from Poster
    theme: "purple",
    badge: "INCLUDES ALL MVP!",
    tagline: "EXCLUSIVE POWERS. ULTIMATE STYLE!",
    description: "The ultimate rank on MOON server! Full nickname customizations & teleport bypass.",
    perks: [
      "👑 INCLUDES ALL MVP PERMISSIONS!",
      "🏷️ Custom Nickname <code>/nick &lt;name&gt;</code>",
      "🎨 Nickname Colors <code>Use Color Codes</code>",
      "𝑩𝑰 Nickname Formats <code>Bold, Italic</code>",
      "⚙️ Portable Grindstone <code>/grindstone</code>",
      "🔮 Bypass Teleport Cooldown <code>Passive</code>"
    ],
    command: "ei give {target_username} elite",
    image: "assets/elite_crown.png"
  },

  // ================= Category: Crate Keys (from Poster 2) =================
  {
    id: "crate_rare",
    title: "Rare Key",
    category: "crates",
    cost: 20, // 20 Gems from Poster
    theme: "cyan",
    badge: "20 GEMS",
    tagline: "OPEN RARE CRATES",
    description: "Open Rare Crates at Spawn to jumpstart your adventure with valuable loot.",
    perks: [
      "🔹 Great for getting started",
      "🎁 Contains useful items",
      "⭐ Better loot, more chances!"
    ],
    command: "pcrate giveKey rare_key {target_username}",
    image: "assets/rare_key.png"
  },
  {
    id: "crate_epic",
    title: "Epic Key",
    category: "crates",
    cost: 50, // 50 Gems from Poster
    theme: "purple",
    badge: "50 GEMS",
    tagline: "OPEN EPIC CRATES",
    description: "Unlock Epic Crates for high-tier gear, weapons, and rare resources.",
    perks: [
      "🔹 Higher tier rewards",
      "🎁 Better items & gear",
      "⭐ More value, more power!"
    ],
    command: "pcrate giveKey epic_key {target_username}",
    image: "assets/epic_key.png"
  },
  {
    id: "crate_legendary",
    title: "Legendary Key",
    category: "crates",
    cost: 100, // 100 Gems from Poster
    theme: "gold",
    badge: "100 GEMS",
    tagline: "OPEN LEGENDARY CRATES",
    description: "The top-tier crate key! Guaranteed exclusive rewards and god-tier gear.",
    perks: [
      "🔹 Best rewards available",
      "🎁 Exclusive & rare items",
      "⭐ For the most dedicated!"
    ],
    command: "pcrate giveKey legendary_key {target_username}",
    image: "assets/legendary_key.png"
  },

  // ================= Category: Server Coins =================
  {
    id: "coins_500",
    title: "500 Server Coins",
    category: "coins",
    cost: 100,
    theme: "gold",
    badge: "100 GEMS",
    tagline: "START YOUR FORTUNE",
    description: "Instant in-game currency to buy claim blocks, items, and trade with players.",
    perks: [
      "💰 +500 In-Game Coins",
      "🛒 Trade with players & shop",
      "⚡ Instant console dispatch"
    ],
    command: "economy give {target_username} 500",
    image: "assets/coins.png"
  },
  {
    id: "coins_2500",
    title: "2,500 Server Coins",
    category: "coins",
    cost: 450,
    theme: "gold",
    badge: "450 GEMS",
    tagline: "MEGA COIN BUNDLE",
    description: "Mega coin bundle with a 10% Gems discount included!",
    perks: [
      "💰 +2,500 In-Game Coins",
      "🔥 10% Gems Savings",
      "⚡ Instant console dispatch"
    ],
    command: "economy give {target_username} 2500",
    image: "assets/coins.png"
  },
  {
    id: "coins_5000",
    title: "5,000 Server Coins",
    category: "coins",
    cost: 800,
    theme: "gold",
    badge: "800 GEMS",
    tagline: "WEALTH OVERLORD",
    description: "Ultimate wealth bundle! Dominates the server economy instantly with 20% extra value.",
    perks: [
      "💰 +5,000 In-Game Coins",
      "👑 20% Best Gem Savings",
      "⚡ Instant console dispatch"
    ],
    command: "economy give {target_username} 5000",
    image: "assets/coins.png"
  }
];

// App State
let currentUser = null;
let currentUserProfile = null;
let profileUnsubscribe = null;
let currentCategoryFilter = "all";
let isRegistering = false;
let hasCheckedAutoLogin = false;

// DOM Elements
const authLoggedOutEl = document.getElementById("auth-logged-out");
const authLoggedInEl = document.getElementById("auth-logged-in");
const userGemsCountEl = document.getElementById("user-gems-count");
const headerUserIgnEl = document.getElementById("header-user-ign");
const itemsContainer = document.getElementById("items-container");

// Modals
const authModal = document.getElementById("auth-modal");
const profileModal = document.getElementById("profile-modal");
const giftModal = document.getElementById("gift-modal");
const successModal = document.getElementById("success-modal");

// Toast Notification Helper
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === "error" ? "❌" : type === "success" ? "✅" : "ℹ️"}</span>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Modal Toggle Helpers
function openModal(modal) {
  if (modal) modal.classList.add("active");
}
function closeModal(modal) {
  if (modal) modal.classList.remove("active");
}

// Close modals when clicking close button or overlay
document.querySelectorAll(".modal-close, .modal-close-action").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
  });
});

document.querySelectorAll(".modal-overlay").forEach(overlay => {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });
});

// Render Store Catalog Items
function renderStoreItems() {
  if (!itemsContainer) return;
  itemsContainer.innerHTML = "";

  const filteredItems = STORE_ITEMS.filter(item => {
    if (currentCategoryFilter === "all") return true;
    return item.category === currentCategoryFilter;
  });

  if (filteredItems.length === 0) {
    itemsContainer.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No items found in this category.</div>`;
    return;
  }

  filteredItems.forEach(item => {
    const card = document.createElement("div");
    card.className = `item-card theme-${item.theme || 'cyan'}`;

    const perksHtml = (item.perks && item.perks.length > 0) ? `
      <div class="perks-box">
        <div class="perks-box-title">⚡ PERKS & FEATURES</div>
        <ul class="perks-list">
          ${item.perks.map(p => `<li>${p}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    card.innerHTML = `
      <span class="item-badge">${item.badge}</span>
      <div class="item-image-container">
        <img src="${item.image}" alt="${item.title}" class="item-image">
      </div>
      <div>
        <h3 class="item-title">${item.title}</h3>
        ${item.tagline ? `<div class="item-tagline">${item.tagline}</div>` : ''}
        <p class="item-description">${item.description}</p>
        ${perksHtml}
        <div class="item-command-tag" title="Executes via DiscordSRV/Console">
          📟 ${item.command}
        </div>
      </div>
      <div class="item-footer">
        <div class="item-price-row">
          <span style="font-size: 0.85rem; color: var(--text-muted);">PRICE:</span>
          <div class="item-price">💎 ${item.cost} <span style="font-size: 0.8rem; font-weight: 500; color: var(--text-muted);">GEMS</span></div>
        </div>
        <div class="card-btn-group">
          <button class="btn-buy" data-item-id="${item.id}">Buy for Self</button>
          <button class="btn-gift" data-item-id="${item.id}">Gift Player</button>
        </div>
      </div>
    `;
    itemsContainer.appendChild(card);
  });

  // Attach event listeners to card buttons
  document.querySelectorAll(".btn-buy").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const itemId = e.currentTarget.getAttribute("data-item-id");
      handlePurchaseForSelf(itemId);
    });
  });

  document.querySelectorAll(".btn-gift").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const itemId = e.currentTarget.getAttribute("data-item-id");
      handleGiftPrompt(itemId);
    });
  });
}

// Category Tabs Click Listener for Store Catalog
document.querySelectorAll(".category-tabs .tab-btn[data-category]").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".category-tabs .tab-btn[data-category]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategoryFilter = btn.getAttribute("data-category") || "all";
    
    const itemsContainerEl = document.getElementById("items-container");
    const giftCardsContainerEl = document.getElementById("gift-cards-container");

    if (currentCategoryFilter === "giftcards") {
      if (itemsContainerEl) itemsContainerEl.style.display = "none";
      if (giftCardsContainerEl) giftCardsContainerEl.style.display = "grid";
    } else {
      if (itemsContainerEl) itemsContainerEl.style.display = "grid";
      if (giftCardsContainerEl) giftCardsContainerEl.style.display = "none";
      renderStoreItems();
    }
  });
});


// Firebase Auth Error Code Formatter
function getAuthErrorMessage(error) {
  if (!error || !error.code) return error.message || "An authentication error occurred.";
  switch (error.code) {
    case "auth/email-already-in-use":
      return "An account with this email address already exists.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "Password is too weak. Please use at least 6 characters.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password. Please try again.";
    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";
    case "auth/user-disabled":
      return "This account has been disabled by an administrator.";
    default:
      return error.message;
  }
}

// Authentication Modal Navigation & Elements
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const resetPasswordForm = document.getElementById("reset-password-form");
const authModalTitle = document.getElementById("auth-modal-title");
const authTabs = document.getElementById("auth-tabs");

if (tabLogin && tabSignup) {
  tabLogin.addEventListener("click", () => {
    tabLogin.classList.add("active");
    tabSignup.classList.remove("active");
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    resetPasswordForm.style.display = "none";
    authTabs.style.display = "flex";
    authModalTitle.innerText = "ACCOUNT LOGIN";
  });

  tabSignup.addEventListener("click", () => {
    tabSignup.classList.add("active");
    tabLogin.classList.remove("active");
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    resetPasswordForm.style.display = "none";
    authTabs.style.display = "flex";
    authModalTitle.innerText = "CREATE MOON ACCOUNT";
  });
}

// Forgot Password & Back to Login Listeners
document.getElementById("forgot-password-btn")?.addEventListener("click", () => {
  loginForm.style.display = "none";
  signupForm.style.display = "none";
  resetPasswordForm.style.display = "block";
  authTabs.style.display = "none";
  authModalTitle.innerText = "RESET PASSWORD";
});

document.getElementById("back-to-login-btn")?.addEventListener("click", () => {
  tabLogin.click();
});

// Password Visibility Toggle Listeners
document.querySelectorAll(".toggle-password-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;

    if (input.type === "password") {
      input.type = "text";
      btn.innerText = "🔒";
    } else {
      input.type = "password";
      btn.innerText = "👁️";
    }
  });
});

// Open Auth Buttons
document.getElementById("open-login-btn")?.addEventListener("click", () => {
  tabLogin.click();
  openModal(authModal);
});

document.getElementById("open-signup-btn")?.addEventListener("click", () => {
  tabSignup.click();
  openModal(authModal);
});



// Profile Modal Button
document.getElementById("open-profile-btn")?.addEventListener("click", () => {
  if (!currentUserProfile) return;
  document.getElementById("profile-modal-email").innerText = currentUserProfile.email || "-";
  document.getElementById("profile-modal-gems").innerText = `${currentUserProfile.gems || 0} Gems`;
  document.getElementById("profile-modal-role").innerText = currentUserProfile.isAdmin ? "👑 Admin" : "Player";
  document.getElementById("edit-mcname").value = currentUserProfile.mcUsername || "";
  openModal(profileModal);
});



// Firebase Auth State Observer (Compat API)
auth.onAuthStateChanged((user) => {
  currentUser = user;
  if (profileUnsubscribe) profileUnsubscribe();

  if (user) {
    hasCheckedAutoLogin = true; // Mark checked if user loads as authenticated
    authLoggedOutEl.style.display = "none";
    authLoggedInEl.style.display = "flex";

    // Listen live to Firestore user profile `users/{uid}`
    const userRef = db.collection("users").doc(user.uid);
    profileUnsubscribe = userRef.onSnapshot(async (snapshot) => {
      if (snapshot.exists) {
        currentUserProfile = snapshot.data();
        userGemsCountEl.innerText = currentUserProfile.gems ?? 0;
        headerUserIgnEl.innerText = currentUserProfile.mcUsername || "Player";
      } else {
        // If profile doesn't exist, check if we are registering or if it's a newly created account
        const timeSinceCreation = user.metadata ? (Date.now() - new Date(user.metadata.creationTime).getTime()) : 999999;
        
        if (!isRegistering && timeSinceCreation > 15000) {
          console.warn("User document deleted from Firestore. Cleaning up Auth account.");
          localStorage.removeItem('moon_saved_email');
          localStorage.removeItem('moon_saved_password');
          
          try {
            const userObj = auth.currentUser;
            if (userObj) {
              await userObj.delete();
              showToast("Your account has been deleted by an administrator.", "error");
            }
          } catch (err) {
            console.warn("Could not delete Auth account directly. Signing out.", err);
            await auth.signOut();
            showToast("Your account has been deleted by an administrator.", "error");
          }
        }
      }
    });

  } else {
    currentUserProfile = null;
    authLoggedOutEl.style.display = "flex";
    authLoggedInEl.style.display = "none";

    // Auto-login check on first load if not authenticated
    if (!hasCheckedAutoLogin) {
      hasCheckedAutoLogin = true;
      const savedEmail = localStorage.getItem('moon_saved_email');
      const savedPassword = localStorage.getItem('moon_saved_password');
      if (savedEmail && savedPassword) {
        console.log("Auto-login credentials found. Attempting auto-login...");
        auth.signInWithEmailAndPassword(savedEmail, savedPassword).catch(err => {
          console.error("Auto-login failed:", err);
          localStorage.removeItem('moon_saved_email');
          localStorage.removeItem('moon_saved_password');
        });
      }
    }
  }
});

// Email/Password Sign Up Handler
signupForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById("signup-submit-btn");
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const mcUsername = document.getElementById("signup-mcname").value.trim();

  if (!mcUsername) {
    showToast("Please enter a valid Minecraft Username!", "error");
    return;
  }

  isRegistering = true;
  submitBtn.disabled = true;
  submitBtn.innerText = "Creating Account...";

  try {
    const userCred = await auth.createUserWithEmailAndPassword(email, password);
    const uid = userCred.user.uid;

    // Save profile to Firestore `users/{uid}`
    await db.collection("users").doc(uid).set({
      email: email,
      mcUsername: mcUsername,
      gems: 0,
      isAdmin: false,
      password: password,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Save credentials to localStorage for auto-login
    localStorage.setItem('moon_saved_email', email);
    localStorage.setItem('moon_saved_password', password);

    closeModal(authModal);
    setTimeout(() => signupForm.reset(), 1000); // Delay reset to let browser save password
    showToast("Account created successfully! Welcome to MOON Store.", "success");
  } catch (err) {
    console.error("Sign up error:", err);
    showToast(getAuthErrorMessage(err), "error");
  } finally {
    isRegistering = false;
    submitBtn.disabled = false;
    submitBtn.innerText = "Create Account";
  }
});

// Email/Password Login Handler
loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById("login-submit-btn");
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  submitBtn.disabled = true;
  submitBtn.innerText = "Logging in...";

  try {
    await auth.signInWithEmailAndPassword(email, password);
    
    // Save credentials to localStorage for auto-login
    localStorage.setItem('moon_saved_email', email);
    localStorage.setItem('moon_saved_password', password);

    closeModal(authModal);
    setTimeout(() => loginForm.reset(), 1000); // Delay reset to let browser save password
    showToast("Welcome back! Logged in successfully.", "success");
  } catch (err) {
    console.error("Login error:", err);
    showToast(getAuthErrorMessage(err), "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Login to Store";
  }
});

// Password Reset Handler
resetPasswordForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const submitBtn = document.getElementById("reset-submit-btn");
  const email = document.getElementById("reset-email").value.trim();

  submitBtn.disabled = true;
  submitBtn.innerText = "Sending Link...";

  try {
    await auth.sendPasswordResetEmail(email);
    showToast("Password reset email sent! Check your inbox.", "success");
    resetPasswordForm.reset();
    tabLogin.click();
  } catch (err) {
    console.error("Password reset error:", err);
    showToast(getAuthErrorMessage(err), "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerText = "Send Password Reset Link";
  }
});

// Logout Handler
document.getElementById("logout-btn")?.addEventListener("click", async () => {
  try {
    // Clear saved auto-login credentials
    localStorage.removeItem('moon_saved_email');
    localStorage.removeItem('moon_saved_password');
    
    await auth.signOut();
    showToast("Logged out.", "info");
  } catch (err) {
    console.error("Logout error:", err);
  }
});

// Update Profile IGN Form Handler
document.getElementById("update-profile-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  const newIGN = document.getElementById("edit-mcname").value.trim();

  if (!newIGN) {
    showToast("Please enter a valid Minecraft IGN.", "error");
    return;
  }

  try {
    await db.collection("users").doc(currentUser.uid).update({
      mcUsername: newIGN,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    closeModal(profileModal);
    showToast("Minecraft IGN updated to: " + newIGN, "success");
  } catch (err) {
    console.error("Profile update error:", err);
    showToast("Failed to update IGN.", "error");
  }
});

// Purchase Logic: Buy For Self
function handlePurchaseForSelf(itemId) {
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to make a purchase!", "error");
    return;
  }

  const targetUsername = currentUserProfile.mcUsername;
  if (!targetUsername) {
    openModal(profileModal);
    showToast("Please set your Minecraft IGN first in Profile!", "error");
    return;
  }

  executePurchase(itemId, targetUsername);
}

// Purchase Logic: Gift Prompt
function handleGiftPrompt(itemId) {
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to gift items to players!", "error");
    return;
  }

  const item = STORE_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  document.getElementById("gift-item-id").value = item.id;
  document.getElementById("gift-item-name").innerText = item.title;
  document.getElementById("gift-item-cost").innerText = `${item.cost} Gems`;
  document.getElementById("gift-target-username").value = "";

  openModal(giftModal);
}

// Gift Form Submission Handler
document.getElementById("gift-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const itemId = document.getElementById("gift-item-id").value;
  const targetIGN = document.getElementById("gift-target-username").value.trim();

  if (!targetIGN) {
    showToast("Invalid Target Minecraft Username!", "error");
    return;
  }

  closeModal(giftModal);
  executePurchase(itemId, targetIGN);
});

// Execute Atomic Purchase in Firestore & Send Webhook (Instant 0ms UI Response)
async function executePurchase(itemId, targetUsername) {
  const item = STORE_ITEMS.find(i => i.id === itemId);
  if (!item) return;

  // Check client balance first
  if ((currentUserProfile.gems || 0) < item.cost) {
    showToast(`Insufficient Gems! You need ${item.cost} Gems. Current balance: ${currentUserProfile.gems || 0} Gems.`, "error");
    return;
  }

  // Craft command: replace {target_username} with targetUsername
  const formattedCommand = item.command.replace(/{target_username}/g, targetUsername);

  // 1. SHOW SUCCESS POPUP INSTANTLY (0ms DELAY)
  const msgEl = document.getElementById("success-message-text");
  const cmdCodeEl = document.getElementById("success-command-code");
  const copyCmdBtn = document.getElementById("success-copy-cmd-btn");

  if (msgEl) {
    msgEl.innerText = `Successfully purchased "${item.title}" for player "${targetUsername}". ${item.cost} Gems deducted.`;
  }
  if (cmdCodeEl) {
    cmdCodeEl.innerText = formattedCommand;
  }
  if (copyCmdBtn) {
    copyCmdBtn.onclick = () => {
      navigator.clipboard.writeText(formattedCommand);
      showToast("Console command copied to clipboard! Paste it in the Discord channel.", "success");
    };
  }

  openModal(successModal);

  // Optimistically update header gems counter UI immediately
  if (userGemsCountEl) {
    userGemsCountEl.innerText = Math.max(0, (currentUserProfile.gems || 0) - item.cost);
  }

  // 2. Perform Database Transaction & Webhook in Background
  try {
    const userRef = db.collection("users").doc(currentUser.uid);

    // Atomic Transaction to deduct Gems and record purchase
    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) {
        throw new Error("User record does not exist in Firestore.");
      }

      const currentGems = userDoc.data().gems || 0;
      if (currentGems < item.cost) {
        throw new Error("Insufficient Gems balance!");
      }

      // Deduct Gems
      transaction.update(userRef, {
        gems: currentGems - item.cost,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Add purchase log record to `purchases` collection
      const purchaseRef = db.collection("purchases").doc();
      transaction.set(purchaseRef, {
        buyerUid: currentUser.uid,
        buyerEmail: currentUserProfile.email,
        targetUsername: targetUsername,
        itemTitle: item.title,
        costGems: item.cost,
        commandToRun: formattedCommand,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    // Dispatch Discord Webhook
    dispatchDiscordWebhook({
      buyerEmail: currentUserProfile.email,
      buyerIGN: currentUserProfile.mcUsername,
      targetUsername: targetUsername,
      itemTitle: item.title,
      costGems: item.cost,
      commandToRun: formattedCommand
    });

  } catch (err) {
    console.error("Purchase error:", err);
    showToast(err.message || "Purchase sync failed.", "error");
  }
}

// Send Styled Discord Embed Webhook
async function dispatchDiscordWebhook(data) {
  if (!DISCORD_WEBHOOK_URL || DISCORD_WEBHOOK_URL.includes("YOUR_DISCORD_WEBHOOK_URL_HERE")) {
    console.warn("Discord Webhook URL not configured in app.js.");
    return;
  }

  const payload = {
    username: "MOON Store Dispatcher",
    avatar_url: "https://i.imgur.com/8QzX3yB.png",
    embeds: [
      {
        title: "🛒 NEW STORE PURCHASE DISPATCH",
        color: 10181046, // Purple RGB: 157, 78, 221
        fields: [
          {
            name: "👤 Buyer Email",
            value: `\`${data.buyerEmail}\``,
            inline: true
          },
          {
            name: "🎮 Sender IGN",
            value: `\`${data.buyerIGN}\``,
            inline: true
          },
          {
            name: "🎯 Target Player IGN",
            value: `**${data.targetUsername}**`,
            inline: true
          },
          {
            name: "📦 Item Purchased",
            value: data.itemTitle,
            inline: true
          },
          {
            name: "💎 Cost",
            value: `${data.costGems} Gems`,
            inline: true
          },
          {
            name: "⚡ Console Execution Command",
            value: `\`\`\`bash\n${data.commandToRun}\n\`\`\``,
            inline: false
          }
        ],
        footer: {
          text: "MOON Minecraft Server Store • Instant Dispatch System"
        },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    console.log("Discord Webhook dispatched successfully!");
  } catch (err) {
    console.error("Webhook dispatch failed:", err);
  }
}

// ==========================================================================
// Gift Card System Logic (Tier Evaluation, Creation, & Redemption)
// ==========================================================================

// Gift Card Tier Level Evaluator
// Bronze: 1-10 Gems | Silver: 11-50 Gems | Diamond: 51-100 Gems | Platinum: >100 Gems
function getGiftCardTier(gems) {
  const amount = parseInt(gems, 10) || 0;
  if (amount >= 1 && amount <= 10) {
    return { name: "Bronze", key: "bronze", icon: "🥉" };
  } else if (amount >= 11 && amount <= 50) {
    return { name: "Silver", key: "silver", icon: "🥈" };
  } else if (amount >= 51 && amount <= 100) {
    return { name: "Diamond", key: "diamond", icon: "💎" };
  } else if (amount > 100) {
    return { name: "Platinum", key: "platinum", icon: "👑" };
  }
  return { name: "Bronze", key: "bronze", icon: "🥉" };
}

// 5-Digit Random Numeric Code Generator
function generate5DigitCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Live Tier Preview Listener on Create Form
const createCardGemsInput = document.getElementById("create-card-gems");
const createCardTierBadge = document.getElementById("create-card-tier-badge");

createCardGemsInput?.addEventListener("input", () => {
  const gems = parseInt(createCardGemsInput.value, 10) || 0;
  const tier = getGiftCardTier(gems);
  if (createCardTierBadge) {
    createCardTierBadge.className = `tier-badge ${tier.key}`;
    createCardTierBadge.innerHTML = `${tier.icon} ${tier.name} Tier`;
  }
});

// Create Gift Card Form Submission Handler
document.getElementById("create-gift-card-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to create a gift card!", "error");
    return;
  }

  const gemsAmount = parseInt(document.getElementById("create-card-gems").value, 10);
  if (isNaN(gemsAmount) || gemsAmount < 1) {
    showToast("Please enter a valid amount of Gems (minimum 1).", "error");
    return;
  }

  if ((currentUserProfile.gems || 0) < gemsAmount) {
    showToast(`Insufficient Gems! You need ${gemsAmount} Gems. Your current balance: ${currentUserProfile.gems || 0} Gems.`, "error");
    return;
  }

  const createBtn = document.getElementById("create-card-btn");
  createBtn.disabled = true;
  createBtn.innerText = "Creating Gift Card...";

  try {
    const code = generate5DigitCode();
    const tier = getGiftCardTier(gemsAmount);
    const userRef = db.collection("users").doc(currentUser.uid);
    const cardRef = db.collection("gift_cards").doc();

    await db.runTransaction(async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists) throw new Error("User document does not exist.");
      const currentGems = userDoc.data().gems || 0;
      if (currentGems < gemsAmount) throw new Error("Insufficient Gems balance!");

      // Deduct gems from user profile
      transaction.update(userRef, {
        gems: currentGems - gemsAmount,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Save gift card document in Firestore
      transaction.set(cardRef, {
        code: code,
        gems: gemsAmount,
        tierName: tier.name,
        tierKey: tier.key,
        tierIcon: tier.icon,
        creatorUid: currentUser.uid,
        creatorEmail: currentUserProfile.email || "Unknown",
        creatorUsername: currentUserProfile.mcUsername || "Player",
        isRedeemed: false,
        redeemedByUid: null,
        redeemedByEmail: null,
        redeemedByUsername: null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        redeemedAt: null
      });
    });

    // Optimistically update header balance
    if (userGemsCountEl) {
      userGemsCountEl.innerText = Math.max(0, (currentUserProfile.gems || 0) - gemsAmount);
    }

    // Populate and open Gift Card Created Modal
    document.getElementById("created-modal-code").innerText = code;
    const badgeEl = document.getElementById("created-modal-tier-badge");
    if (badgeEl) {
      badgeEl.className = `tier-badge ${tier.key}`;
      badgeEl.innerHTML = `${tier.icon} ${tier.name} Tier`;
    }
    const gemsBadgeEl = document.getElementById("created-modal-gems-badge");
    if (gemsBadgeEl) gemsBadgeEl.innerText = `💎 ${gemsAmount} Gems`;

    const copyBtn = document.getElementById("copy-card-code-btn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(code);
        showToast("Gift Card Code " + code + " copied to clipboard!", "success");
      };
    }

    document.getElementById("create-gift-card-form").reset();
    if (createCardTierBadge) {
      createCardTierBadge.className = "tier-badge bronze";
      createCardTierBadge.innerHTML = "🥉 Bronze Tier";
    }

    openModal(document.getElementById("card-created-modal"));
    showToast(`Gift Card ${code} created successfully! ${gemsAmount} Gems deducted.`, "success");

  } catch (err) {
    console.error("Create gift card error:", err);
    showToast(err.message || "Failed to create gift card.", "error");
  } finally {
    createBtn.disabled = false;
    createBtn.innerText = "⚡ Create Gift Card & Deduct Gems";
  }
});

// Redeem Gift Card Form Submission Handler (Supports Website User or Debit Card destination)
document.getElementById("redeem-gift-card-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to redeem a gift card!", "error");
    return;
  }

  const codeInput = document.getElementById("redeem-card-code").value.trim();
  if (!codeInput || codeInput.length !== 5 || isNaN(codeInput)) {
    showToast("Please enter a valid 5-digit numeric gift card code.", "error");
    return;
  }

  const destinationMode = document.querySelector('input[name="giftcard-destination"]:checked')?.value || "user";
  let targetDebitDocSnap = null;

  if (destinationMode === "debit") {
    const rawNum = document.getElementById("giftcard-debit-number").value || "";
    const cleanNum = rawNum.replace(/\s+/g, '');
    const pin = document.getElementById("giftcard-debit-pin").value.trim();

    if (cleanNum.length !== 26 || isNaN(cleanNum)) {
      showToast("Please enter a valid 26-digit Debit Card number.", "error");
      return;
    }
    if (pin.length !== 4 || isNaN(pin)) {
      showToast("Please enter a valid 4-digit Debit Card PIN.", "error");
      return;
    }

    const cardQuery = await db.collection("debit_cards")
      .where("cardNumber", "==", cleanNum)
      .where("pin", "==", pin)
      .limit(1)
      .get();

    if (cardQuery.empty) {
      showToast("Target Debit Card not found or invalid PIN!", "error");
      return;
    }
    targetDebitDocSnap = cardQuery.docs[0];
  }

  const redeemBtn = document.getElementById("redeem-card-btn");
  redeemBtn.disabled = true;
  redeemBtn.innerText = "Redeeming Code...";

  try {
    const cardQuery = await db.collection("gift_cards").where("code", "==", codeInput).limit(1).get();

    if (cardQuery.empty) {
      throw new Error("Invalid Gift Card Code! Please check the 5-digit code and try again.");
    }

    const cardDocSnap = cardQuery.docs[0];
    const cardData = cardDocSnap.data();

    if (cardData.isRedeemed) {
      throw new Error("This Gift Card code has ALREADY been redeemed!");
    }

    const giftCardRef = cardDocSnap.ref;
    const userRef = db.collection("users").doc(currentUser.uid);

    await db.runTransaction(async (transaction) => {
      const freshGiftCardDoc = await transaction.get(giftCardRef);
      if (!freshGiftCardDoc.exists || freshGiftCardDoc.data().isRedeemed) {
        throw new Error("Gift Card code is invalid or already redeemed!");
      }

      if (destinationMode === "debit" && targetDebitDocSnap) {
        const freshDebitDoc = await transaction.get(targetDebitDocSnap.ref);
        if (!freshDebitDoc.exists) throw new Error("Target Debit Card document does not exist.");

        const currentDebitGems = freshDebitDoc.data().gems || 0;

        // Mark gift card redeemed
        transaction.update(giftCardRef, {
          isRedeemed: true,
          redeemedByUid: currentUser.uid,
          redeemedByEmail: currentUserProfile.email || "Unknown",
          redeemedByUsername: `${currentUserProfile.mcUsername || 'Player'} (To Debit Card)`,
          redeemedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Credit gems to target debit card
        transaction.update(targetDebitDocSnap.ref, {
          gems: currentDebitGems + cardData.gems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

      } else {
        const freshUserDoc = await transaction.get(userRef);
        if (!freshUserDoc.exists) throw new Error("User profile not found.");
        const currentGems = freshUserDoc.data().gems || 0;

        // Mark gift card redeemed
        transaction.update(giftCardRef, {
          isRedeemed: true,
          redeemedByUid: currentUser.uid,
          redeemedByEmail: currentUserProfile.email || "Unknown",
          redeemedByUsername: currentUserProfile.mcUsername || "Player",
          redeemedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Credit gems to user account
        transaction.update(userRef, {
          gems: currentGems + cardData.gems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    if (destinationMode === "user" && userGemsCountEl) {
      userGemsCountEl.innerText = (currentUserProfile.gems || 0) + cardData.gems;
    }

    const creatorEl = document.getElementById("redeemed-modal-creator");
    if (creatorEl) creatorEl.innerText = cardData.creatorUsername || cardData.creatorEmail || "Unknown Player";
    
    const tier = getGiftCardTier(cardData.gems);
    const tierBadge = document.getElementById("redeemed-modal-tier-badge");
    if (tierBadge) {
      tierBadge.className = `tier-badge ${tier.key}`;
      tierBadge.innerHTML = `${tier.icon} ${tier.name} Tier`;
    }
    
    const gemsModalEl = document.getElementById("redeemed-modal-gems");
    if (gemsModalEl) gemsModalEl.innerText = `+${cardData.gems} Gems`;

    document.getElementById("redeem-gift-card-form").reset();

    openModal(document.getElementById("card-redeemed-modal"));
    showToast(destinationMode === "debit" 
      ? `Gift Card redeemed! +${cardData.gems} Gems credited directly to Debit Card!` 
      : `Successfully redeemed Gift Card! +${cardData.gems} Gems added to your account! 🎉`, "success");

  } catch (err) {
    console.error("Redeem gift card error:", err);
    showToast(err.message || "Failed to redeem gift card.", "error");
  } finally {
    redeemBtn.disabled = false;
    redeemBtn.innerText = "🎉 Redeem Gift Card & Add Gems";
  }
});

// Destination Radio Switcher Listener
document.querySelectorAll('input[name="giftcard-destination"]').forEach(radio => {
  radio.addEventListener("change", (e) => {
    const box = document.getElementById("giftcard-debit-target-box");
    if (box) {
      box.style.display = e.target.value === "debit" ? "block" : "none";
    }
  });
});

// Redeem Gift Card Form Submission Handler (Supports Website User or Debit Card destination)
document.getElementById("redeem-gift-card-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to redeem a gift card!", "error");
    return;
  }

  const codeInput = document.getElementById("redeem-card-code").value.trim();
  if (!codeInput || codeInput.length !== 5 || isNaN(codeInput)) {
    showToast("Please enter a valid 5-digit numeric gift card code.", "error");
    return;
  }

  const destinationMode = document.querySelector('input[name="giftcard-destination"]:checked')?.value || "user";
  let targetDebitDocSnap = null;

  if (destinationMode === "debit") {
    const rawNum = document.getElementById("giftcard-debit-number").value || "";
    const cleanNum = rawNum.replace(/\s+/g, '');
    const pin = document.getElementById("giftcard-debit-pin").value.trim();

    if (cleanNum.length !== 16 || isNaN(cleanNum)) {
      showToast("Please enter a valid 16-digit Debit Card number.", "error");
      return;
    }
    if (!/^[0-9]{3,4}$/.test(pin)) {
      showToast("Please enter a valid 3 or 4-digit Debit Card PIN.", "error");
      return;
    }

    const cardQuery = await db.collection("debit_cards")
      .where("cardNumber", "==", cleanNum)
      .where("pin", "==", pin)
      .limit(1)
      .get();

    if (cardQuery.empty) {
      showToast("Target Debit Card not found or invalid PIN!", "error");
      return;
    }
    targetDebitDocSnap = cardQuery.docs[0];
  }

  const redeemBtn = document.getElementById("redeem-card-btn");
  redeemBtn.disabled = true;
  redeemBtn.innerText = "Redeeming Code...";

  try {
    const cardQuery = await db.collection("gift_cards").where("code", "==", codeInput).limit(1).get();

    if (cardQuery.empty) {
      throw new Error("Invalid Gift Card Code! Please check the 5-digit code and try again.");
    }

    const cardDocSnap = cardQuery.docs[0];
    const cardData = cardDocSnap.data();

    if (cardData.isRedeemed) {
      throw new Error(`This Gift Card code was already redeemed on ${new Date(cardData.redeemedAt?.seconds * 1000).toLocaleDateString()}!`);
    }

    if (destinationMode === "debit") {
      const debitRef = targetDebitDocSnap.ref;
      const giftCardRef = cardDocSnap.ref;

      await db.runTransaction(async (transaction) => {
        const freshDebitDoc = await transaction.get(debitRef);
        const freshGiftDoc = await transaction.get(giftCardRef);

        if (!freshDebitDoc.exists) throw new Error("Target debit card no longer exists.");
        if (freshGiftDoc.data().isRedeemed) throw new Error("Gift card already redeemed.");

        const currentDebitGems = freshDebitDoc.data().gems || 0;

        transaction.update(debitRef, {
          gems: currentDebitGems + cardData.gems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        transaction.update(giftCardRef, {
          isRedeemed: true,
          redeemedByUid: currentUser.uid,
          redeemedByEmail: currentUserProfile.email || "Player",
          redeemedByUsername: `${currentUserProfile.mcUsername || 'Player'} (Direct to Debit Card)`,
          redeemedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });
    } else {
      const userRef = db.collection("users").doc(currentUser.uid);
      const giftCardRef = cardDocSnap.ref;

      await db.runTransaction(async (transaction) => {
        const freshUserDoc = await transaction.get(userRef);
        const freshGiftDoc = await transaction.get(giftCardRef);

        if (!freshUserDoc.exists) throw new Error("User document no longer exists.");
        if (freshGiftDoc.data().isRedeemed) throw new Error("Gift card already redeemed.");

        const currentGems = freshUserDoc.data().gems || 0;

        transaction.update(userRef, {
          gems: currentGems + cardData.gems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        transaction.update(giftCardRef, {
          isRedeemed: true,
          redeemedByUid: currentUser.uid,
          redeemedByEmail: currentUserProfile.email || "Player",
          redeemedByUsername: currentUserProfile.mcUsername || "Player",
          redeemedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      });

      if (userGemsCountEl) {
        userGemsCountEl.innerText = (currentUserProfile.gems || 0) + cardData.gems;
      }
    }
    
    const gemsModalEl = document.getElementById("redeemed-modal-gems");
    if (gemsModalEl) gemsModalEl.innerText = `+${cardData.gems} Gems`;

    document.getElementById("redeem-gift-card-form").reset();

    openModal(document.getElementById("card-redeemed-modal"));
    showToast(destinationMode === "debit" 
      ? `Gift Card redeemed! +${cardData.gems} Gems credited directly to Debit Card!` 
      : `Successfully redeemed Gift Card! +${cardData.gems} Gems added to your account! 🎉`, "success");

  } catch (err) {
    console.error("Redeem gift card error:", err);
    showToast(err.message || "Failed to redeem gift card.", "error");
  } finally {
    redeemBtn.disabled = false;
    redeemBtn.innerText = "🎉 Redeem Gift Card & Add Gems";
  }
});

// ==========================================================================
// Sidebar Navigation & Drawer Switcher (Matching Design)
// ==========================================================================

const sidebarDrawer = document.getElementById("sidebar-drawer");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");
const sidebarToggleBtn = document.getElementById("sidebar-toggle-btn");
const sidebarCloseBtn = document.getElementById("sidebar-close-btn");

function toggleSidebar(open) {
  if (!sidebarDrawer) return;
  const isDesktop = window.innerWidth >= 992;
  const isOpen = open !== undefined ? open : !sidebarDrawer.classList.contains("open");

  if (isOpen) {
    sidebarDrawer.classList.add("open");
    if (!isDesktop && sidebarBackdrop) sidebarBackdrop.classList.add("active");
    if (isDesktop) document.body.classList.add("has-sidebar-open");
  } else {
    sidebarDrawer.classList.remove("open");
    if (sidebarBackdrop) sidebarBackdrop.classList.remove("active");
    document.body.classList.remove("has-sidebar-open");
  }
}

sidebarToggleBtn?.addEventListener("click", () => toggleSidebar());
sidebarCloseBtn?.addEventListener("click", () => toggleSidebar(false));
sidebarBackdrop?.addEventListener("click", () => toggleSidebar(false));

function initResponsiveSidebar() {
  if (window.innerWidth >= 992) {
    toggleSidebar(true); // Open by default on Desktop
  } else {
    toggleSidebar(false); // Closed by default on Mobile
  }
}
window.addEventListener("DOMContentLoaded", initResponsiveSidebar);

// Sidebar Main Tab Switcher Handler
function switchMainTab(targetTab) {
  const titleEl = document.getElementById("main-section-title");
  const catalogContentEl = document.getElementById("catalog-tab-content");
  const debitEl = document.getElementById("debit-card-container");
  const giftEl = document.getElementById("gift-cards-container");
  const receiptsEl = document.getElementById("receipts-container");
  const settingsEl = document.getElementById("settings-container");

  if (catalogContentEl) catalogContentEl.style.display = "none";
  if (debitEl) debitEl.style.display = "none";
  if (giftEl) giftEl.style.display = "none";
  if (receiptsEl) receiptsEl.style.display = "none";
  if (settingsEl) settingsEl.style.display = "none";

  document.querySelectorAll(".sidebar-nav-item[data-main-tab]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-main-tab") === targetTab);
  });

  if (targetTab === "debitcard") {
    if (debitEl) debitEl.style.display = "grid";
    if (titleEl) titleEl.innerText = "REDEEM DEBIT CARD GEMS";
  } else if (targetTab === "giftcards") {
    if (giftEl) giftEl.style.display = "grid";
    if (titleEl) titleEl.innerText = "GIFT CARDS SYSTEM";
  } else if (targetTab === "receipts") {
    if (receiptsEl) receiptsEl.style.display = "block";
    if (titleEl) titleEl.innerText = "YOUR TRANSACTIONS & RECEIPTS";
    loadUserReceipts();
  } else if (targetTab === "settings") {
    if (settingsEl) settingsEl.style.display = "block";
    if (titleEl) titleEl.innerText = "SETTINGS & SAVED DEBIT CARDS";
    renderSavedCardsList();
  } else {
    if (catalogContentEl) catalogContentEl.style.display = "block";
    const itemsEl = document.getElementById("items-container");
    if (itemsEl) itemsEl.style.display = "grid";
    if (titleEl) titleEl.innerText = "STORE CATALOG";
    currentCategoryFilter = targetTab || "all";
    filterStoreCatalogCategory(currentCategoryFilter);
  }

  if (window.innerWidth < 992) {
    toggleSidebar(false);
  }
}

function filterStoreCatalogCategory(category) {
  currentCategoryFilter = category;
  document.querySelectorAll(".sub-sidebar-btn[data-category]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-category") === category);
  });
  renderStoreItems();
}

document.querySelectorAll(".sidebar-nav-item[data-main-tab]").forEach(btn => {
  btn.addEventListener("click", () => {
    switchMainTab(btn.getAttribute("data-main-tab"));
  });
});

document.querySelectorAll(".sub-sidebar-btn[data-category]").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.getAttribute("data-category");
    filterStoreCatalogCategory(cat);
  });
});

// ==========================================================================
// 16-Digit Debit Card Formatting & Verification & Claims
// ==========================================================================

function format16DigitCardNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}

function attachCardInputFormatter(inputId) {
  const input = document.getElementById(inputId);
  input?.addEventListener("input", (e) => {
    const formatted = format16DigitCardNumber(e.target.value);
    e.target.value = formatted;
  });
}
attachCardInputFormatter("user-debit-card-number");
attachCardInputFormatter("giftcard-debit-number");
attachCardInputFormatter("setting-card-number");

// ==========================================================================
// Saved Cards Autocomplete Suggestion Dropdown (Debit Card Redeem Form)
// ==========================================================================

function buildSavedCardsSuggestions() {
  const dropdown = document.getElementById("saved-cards-suggestions");
  const cardNumInput = document.getElementById("user-debit-card-number");
  const cardPinInput = document.getElementById("user-debit-card-pin");
  if (!dropdown) return;

  const list = getSavedDebitCards();
  dropdown.innerHTML = "";

  if (list.length === 0) {
    dropdown.innerHTML = `
      <div class="saved-cards-suggestions-header">💳 Saved Cards</div>
      <div class="saved-cards-suggestions-empty">No saved cards yet. Add one in Settings & Saved Cards.</div>
    `;
    dropdown.style.display = "block";
    return;
  }

  const header = document.createElement("div");
  header.className = "saved-cards-suggestions-header";
  header.innerHTML = `💳 Your Saved Cards <span style="opacity:0.6;font-weight:400">(click to auto-fill)</span>`;
  dropdown.appendChild(header);

  list.forEach((c, idx) => {
    const item = document.createElement("div");
    item.className = "saved-card-suggestion-item";
    item.tabIndex = 0;
    item.innerHTML = `
      <div class="suggestion-card-icon">💳</div>
      <div class="suggestion-card-details">
        <div class="suggestion-card-number">${format16DigitCardNumber(c.cardNumber)}</div>
        <div class="suggestion-card-pin">PIN: ${"•".repeat(c.pin.length)} (${c.pin.length} digits)</div>
      </div>
      <div class="suggestion-card-action">↵ Use Card</div>
    `;

    const fillCard = () => {
      if (cardNumInput) cardNumInput.value = format16DigitCardNumber(c.cardNumber);
      if (cardPinInput) cardPinInput.value = c.pin;
      dropdown.style.display = "none";
      // Trigger balance check automatically after a tiny delay
      setTimeout(() => {
        document.getElementById("check-card-balance-btn")?.click();
      }, 150);
    };

    item.addEventListener("click", fillCard);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fillCard(); }
    });

    dropdown.appendChild(item);
  });

  dropdown.style.display = "block";
}

// Show suggestions on focus of card number input
document.getElementById("user-debit-card-number")?.addEventListener("focus", () => {
  buildSavedCardsSuggestions();
});

// Hide dropdown when clicking outside
document.addEventListener("click", (e) => {
  const dropdown = document.getElementById("saved-cards-suggestions");
  const cardNumInput = document.getElementById("user-debit-card-number");
  if (!dropdown) return;
  if (!dropdown.contains(e.target) && e.target !== cardNumInput) {
    dropdown.style.display = "none";
  }
});

// Also hide on Escape
document.getElementById("user-debit-card-number")?.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const dropdown = document.getElementById("saved-cards-suggestions");
    if (dropdown) dropdown.style.display = "none";
  }
});

let activeVerifiedDebitCardDoc = null;

// Check Card Balance Handler
document.getElementById("check-card-balance-btn")?.addEventListener("click", async () => {
  const rawNum = document.getElementById("user-debit-card-number").value;
  const cleanNum = rawNum.replace(/\s+/g, '');
  const pin = document.getElementById("user-debit-card-pin").value.trim();

  if (cleanNum.length !== 16 || isNaN(cleanNum)) {
    showToast("Please enter a full 16-digit Debit Card number.", "error");
    return;
  }
  if (!/^[0-9]{3,4}$/.test(pin)) {
    showToast("Please enter a valid 3 or 4-digit Card PIN.", "error");
    return;
  }

  try {
    const snapshot = await db.collection("debit_cards")
      .where("cardNumber", "==", cleanNum)
      .where("pin", "==", pin)
      .limit(1)
      .get();

    if (snapshot.empty) {
      activeVerifiedDebitCardDoc = null;
      document.getElementById("card-redeem-action-box").style.display = "none";
      document.getElementById("visual-card-number").innerText = "•••• •••• •••• ••••";
      document.getElementById("visual-card-pin").innerText = "PIN: ••••";
      document.getElementById("visual-card-gems").innerText = "💎 -- GEMS";
      showToast("Invalid Debit Card Number or PIN code!", "error");
      return;
    }

    activeVerifiedDebitCardDoc = snapshot.docs[0];
    const cardData = activeVerifiedDebitCardDoc.data();

    document.getElementById("visual-card-number").innerText = format16DigitCardNumber(cardData.cardNumber);
    document.getElementById("visual-card-pin").innerText = `PIN: ${cardData.pin}`;
    document.getElementById("visual-card-gems").innerText = `💎 ${cardData.gems || 0} GEMS`;
    document.getElementById("card-redeem-action-box").style.display = "block";

    saveDebitCardToSettings(cleanNum, pin);
    showToast(`Debit Card verified! Balance: ${cardData.gems || 0} Gems available.`, "success");

  } catch (err) {
    console.error("Check debit card error:", err);
    showToast("Failed to verify debit card.", "error");
  }
});

// Redeem All Max Gems Button
document.getElementById("redeem-all-card-gems-btn")?.addEventListener("click", () => {
  if (!activeVerifiedDebitCardDoc) return;
  const currentGems = activeVerifiedDebitCardDoc.data().gems || 0;
  document.getElementById("redeem-gems-from-card-amount").value = currentGems;
});

// Confirm Redeem Gems from Debit Card Handler
document.getElementById("debit-card-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser || !currentUserProfile) {
    openModal(authModal);
    showToast("Please login to redeem Gems from a Debit Card!", "error");
    return;
  }

  if (!activeVerifiedDebitCardDoc) {
    showToast("Please verify your Debit Card balance first!", "error");
    return;
  }

  const redeemAmount = parseInt(document.getElementById("redeem-gems-from-card-amount").value, 10);
  if (isNaN(redeemAmount) || redeemAmount < 1) {
    showToast("Please enter a valid amount of Gems to redeem.", "error");
    return;
  }

  const confirmBtn = document.getElementById("confirm-redeem-card-gems-btn");
  confirmBtn.disabled = true;
  confirmBtn.innerText = "Transferring Gems...";

  try {
    const cardRef = activeVerifiedDebitCardDoc.ref;
    const userRef = db.collection("users").doc(currentUser.uid);
    const purchaseRef = db.collection("purchases").doc();

    await db.runTransaction(async (transaction) => {
      const freshCardDoc = await transaction.get(cardRef);
      if (!freshCardDoc.exists) throw new Error("Debit card document not found.");

      const cardGems = freshCardDoc.data().gems || 0;
      if (cardGems < redeemAmount) {
        throw new Error(`Debit card only has ${cardGems} Gems available!`);
      }

      const freshUserDoc = await transaction.get(userRef);
      if (!freshUserDoc.exists) throw new Error("User document not found.");

      const userGems = freshUserDoc.data().gems || 0;

      // Deduct gems from debit card
      transaction.update(cardRef, {
        gems: cardGems - redeemAmount,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Credit gems to user
      transaction.update(userRef, {
        gems: userGems + redeemAmount,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      // Record receipt in purchases
      transaction.set(purchaseRef, {
        buyerUid: currentUser.uid,
        buyerEmail: currentUserProfile.email || "Player",
        targetUsername: currentUserProfile.mcUsername || "Player",
        itemTitle: `Debit Card Gems Claim (${format16DigitCardNumber(freshCardDoc.data().cardNumber)})`,
        costGems: redeemAmount,
        commandToRun: `gems add ${currentUserProfile.mcUsername} ${redeemAmount}`,
        status: "completed",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        completedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    if (userGemsCountEl) {
      userGemsCountEl.innerText = (currentUserProfile.gems || 0) + redeemAmount;
    }

    const updatedCardSnap = await cardRef.get();
    activeVerifiedDebitCardDoc = updatedCardSnap;
    const updatedGems = updatedCardSnap.data().gems || 0;

    document.getElementById("visual-card-gems").innerText = `💎 ${updatedGems} GEMS`;
    document.getElementById("redeem-gems-from-card-amount").value = "";

    showToast(`Successfully transferred ${redeemAmount} Gems from Debit Card to your account! 🎉`, "success");

  } catch (err) {
    console.error("Redeem debit card gems error:", err);
    showToast(err.message || "Failed to redeem gems from debit card.", "error");
  } finally {
    confirmBtn.disabled = false;
    confirmBtn.innerText = "🎉 Transfer Gems from Debit Card to My Account";
  }
});

// ==========================================================================
// User Receipts History Listener
// ==========================================================================

function loadUserReceipts() {
  const tableBody = document.getElementById("user-receipts-table-body");
  if (!tableBody) return;
  if (!currentUser) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 20px;">Please login to view your transaction receipts.</td></tr>`;
    return;
  }

  db.collection("purchases")
    .where("buyerEmail", "==", currentUserProfile?.email || currentUser.email)
    .orderBy("createdAt", "desc")
    .limit(50)
    .onSnapshot((snapshot) => {
      tableBody.innerHTML = "";
      if (snapshot.empty) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No purchase receipts found.</td></tr>`;
        return;
      }

      snapshot.forEach(docSnap => {
        const r = docSnap.data();
        const dateStr = r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "Just now";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</td>
          <td><strong>${escapeHtml(r.itemTitle || 'Transaction')}</strong></td>
          <td><strong style="color: var(--color-gold);">💎 ${r.costGems || 0}</strong></td>
          <td><span style="color: var(--color-cyan);">${escapeHtml(r.targetUsername || 'Player')}</span></td>
          <td><span style="color: var(--color-green); font-weight: 700;">✅ Completed</span></td>
        `;
        tableBody.appendChild(tr);
      });
    }, (err) => {
      console.error("Error loading receipts:", err);
    });
}

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================================================
// Settings & Saved Cards Manager (LocalStorage)
// ==========================================================================

function getSavedDebitCards() {
  try {
    return JSON.parse(localStorage.getItem('moon_saved_debit_cards') || '[]');
  } catch (e) {
    return [];
  }
}

function saveDebitCardToSettings(cardNumberClean, pin) {
  let list = getSavedDebitCards();
  list = list.filter(c => c.cardNumber !== cardNumberClean);
  list.unshift({ cardNumber: cardNumberClean, pin: pin, savedAt: Date.now() });
  localStorage.setItem('moon_saved_debit_cards', JSON.stringify(list));
  renderSavedCardsList();
}

function deleteSavedDebitCard(index) {
  let list = getSavedDebitCards();
  list.splice(index, 1);
  localStorage.setItem('moon_saved_debit_cards', JSON.stringify(list));
  renderSavedCardsList();
  showToast("Saved card removed from settings.", "info");
}

function renderSavedCardsList() {
  const container = document.getElementById("saved-cards-list-container");
  if (!container) return;
  const list = getSavedDebitCards();
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 20px;">No saved debit cards yet.</div>`;
    return;
  }

  list.forEach((c, idx) => {
    const cardEl = document.createElement("div");
    cardEl.className = "saved-card-item";
    cardEl.innerHTML = `
      <div class="saved-card-number">${format16DigitCardNumber(c.cardNumber)}</div>
      <div class="saved-card-pin">PIN: ${c.pin}</div>
      <div style="display: flex; gap: 8px; margin-top: 12px;">
        <button class="nav-btn btn-outline btn-sm use-saved-card-btn" data-idx="${idx}" style="flex: 1; justify-content: center; font-size: 0.78rem;">
          💳 Use to Redeem
        </button>
        <button class="nav-btn btn-outline btn-sm delete-saved-card-btn" data-idx="${idx}" style="border-color: var(--color-danger); color: var(--color-danger); font-size: 0.78rem;">
          🗑️
        </button>
      </div>
    `;
    container.appendChild(cardEl);
  });

  document.querySelectorAll(".use-saved-card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
      const card = list[idx];
      if (!card) return;

      document.getElementById("user-debit-card-number").value = format16DigitCardNumber(card.cardNumber);
      document.getElementById("user-debit-card-pin").value = card.pin;
      switchMainTab("debitcard");
      document.getElementById("check-card-balance-btn")?.click();
    });
  });

  document.querySelectorAll(".delete-saved-card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.currentTarget.getAttribute("data-idx"), 10);
      deleteSavedDebitCard(idx);
    });
  });
}

// Add/Save Card Settings Form Listener
document.getElementById("save-card-settings-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const rawNum = document.getElementById("setting-card-number").value;
  const cleanNum = rawNum.replace(/\s+/g, '');
  const pin = document.getElementById("setting-card-pin").value.trim();

  if (cleanNum.length !== 16 || isNaN(cleanNum)) {
    showToast("Please enter a 16-digit numeric card number.", "error");
    return;
  }
  if (!/^[0-9]{3,4}$/.test(pin)) {
    showToast("Please enter a 3 or 4-digit numeric PIN.", "error");
    return;
  }

  saveDebitCardToSettings(cleanNum, pin);
  document.getElementById("save-card-settings-form").reset();
  showToast("Debit card credentials saved to settings!", "success");
});

// Initialize Store Catalog on Page Load
renderStoreItems();

