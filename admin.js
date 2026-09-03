// MOON Minecraft Web Store - Admin Panel JavaScript Logic (Compat Mode for file:// double-click)

// DOM Elements
const accessDeniedEl = document.getElementById("access-denied");
const pinProtectionEl = document.getElementById("pin-protection");
const adminDashboardEl = document.getElementById("admin-dashboard");
const adminUserBadge = document.getElementById("admin-user-badge");
const adminUserEmail = document.getElementById("admin-user-email");
const lockAdminBtn = document.getElementById("lock-admin-btn");

const adminPinForm = document.getElementById("admin-pin-form");
const adminPinInput = document.getElementById("admin-pin-input");
const adminSearchUsers = document.getElementById("admin-search-users");
const adminSearchCompleted = document.getElementById("admin-search-completed");
const exportCompletedCsvBtn = document.getElementById("export-completed-csv-btn");

const adminSelectUser = document.getElementById("admin-select-user");
const adminGemsForm = document.getElementById("admin-gems-form");
const adminGemsAction = document.getElementById("admin-gems-action");
const adminGemsAmount = document.getElementById("admin-gems-amount");

const usersTableBody = document.getElementById("users-table-body");
const purchasesTableBody = document.getElementById("purchases-table-body");
const completedTableBody = document.getElementById("completed-table-body");

const statTotalUsers = document.getElementById("stat-total-users");
const statTotalPurchases = document.getElementById("stat-total-purchases");
const statCompletedPurchases = document.getElementById("stat-completed-purchases");
const pendingCountBadge = document.getElementById("pending-count-badge");

let allUsersCache = [];
let allPendingPurchases = [];
let allCompletedPurchases = [];
let allGiftCardsCache = [];
let allDebitCardsCache = [];

// Real-time listener unsubscribers
let usersUnsubscribe = null;
let purchasesUnsubscribe = null;
let giftCardsUnsubscribe = null;
let debitCardsUnsubscribe = null;

// Toast Helper
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

// Security & PIN Authorization Handler
function checkAdminPinAuth() {
  const isPinAuthorized = sessionStorage.getItem('admin_authenticated') === 'true';

  if (isPinAuthorized) {
    showAdminDashboard();
  } else {
    showPinProtectionScreen();
  }
}

// Observe auth state for background token availability
auth.onAuthStateChanged((user) => {
  if (sessionStorage.getItem('admin_authenticated') === 'true') {
    showAdminDashboard();
  }
});

function showPinProtectionScreen() {
  if (pinProtectionEl) pinProtectionEl.style.display = "block";
  if (accessDeniedEl) accessDeniedEl.style.display = "none";
  if (adminDashboardEl) adminDashboardEl.style.display = "none";
  if (adminUserBadge) adminUserBadge.style.display = "none";
}

function showAccessDenied(message = "") {
  if (accessDeniedEl) {
    accessDeniedEl.style.display = "block";
    const sub = accessDeniedEl.querySelector(".hero-subtitle");
    if (sub) {
      sub.innerText = message || "You do not have administrator permissions to access this page.";
    }
  }
  if (pinProtectionEl) pinProtectionEl.style.display = "none";
  if (adminDashboardEl) adminDashboardEl.style.display = "none";
  if (adminUserBadge) adminUserBadge.style.display = "none";
}

async function showAdminDashboard() {
  if (!auth.currentUser) {
    try {
      await auth.signInAnonymously();
    } catch (err) {
      console.warn("Anonymous auth fallback notice:", err);
    }
  }

  if (pinProtectionEl) pinProtectionEl.style.display = "none";
  if (accessDeniedEl) accessDeniedEl.style.display = "none";
  if (adminDashboardEl) adminDashboardEl.style.display = "block";
  if (adminUserBadge) adminUserBadge.style.display = "flex";

  loadAdminDashboardData();
}

// Lock Admin Panel Action
lockAdminBtn?.addEventListener("click", () => {
  sessionStorage.removeItem('admin_authenticated');
  showToast("Admin session locked.", "info");
  showPinProtectionScreen();
});

// PIN Form Verification Listener (Default PIN: 1111)
adminPinForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const pin = adminPinInput.value.trim();
  if (pin === "1111") {
    sessionStorage.setItem('admin_authenticated', 'true');
    showToast("Authorization successful! Welcome Admin.", "success");
    adminPinInput.value = "";
    showAdminDashboard();
  } else {
    showToast("Invalid security PIN code.", "error");
    adminPinInput.value = "";
  }
});

// Start all real-time listeners
function loadAdminDashboardData() {
  startUsersRealtimeListener();
  startPurchasesRealtimeListener();
  startGiftCardsRealtimeListener();
  startDebitCardsRealtimeListener();
  initDebitCardInterestSettings();
}

// ==========================================================================
// Sidebar Drawer Navigation Controls
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

// Admin Navigation Tabs Switching Handler (Sidebar-only)
function switchAdminTab(targetTab) {
  // Highlight active sidebar item
  document.querySelectorAll(".sidebar-nav-item[data-admin-tab]").forEach(item => {
    item.classList.toggle("active", item.getAttribute("data-admin-tab") === targetTab);
  });

  // Show matching tab content, hide others
  document.querySelectorAll(".admin-tab-content").forEach(content => {
    content.style.display = content.id === `admin-tab-${targetTab}` ? "block" : "none";
  });

  // Close sidebar on mobile after navigating
  if (window.innerWidth < 992) toggleSidebar(false);
}

// Sidebar nav items — only source of navigation now
document.querySelectorAll(".sidebar-nav-item[data-admin-tab]").forEach(item => {
  item.addEventListener("click", () => {
    switchAdminTab(item.getAttribute("data-admin-tab"));
  });
});


// Refresh Data Button
document.getElementById("refresh-admin-data")?.addEventListener("click", () => {
  if (usersUnsubscribe) usersUnsubscribe();
  if (purchasesUnsubscribe) purchasesUnsubscribe();
  if (giftCardsUnsubscribe) giftCardsUnsubscribe();
  if (debitCardsUnsubscribe) debitCardsUnsubscribe();
  loadAdminDashboardData();
  showToast("Live sync active — dashboard refreshed!", "info");
});


// Real-time Listener: Registered Users (auto-updates on add/delete from any source)
function startUsersRealtimeListener() {
  if (usersUnsubscribe) usersUnsubscribe(); // clean up old listener

  usersUnsubscribe = db.collection("users").onSnapshot((snapshot) => {
    allUsersCache = [];
    if (adminSelectUser) {
      adminSelectUser.innerHTML = `<option value="">-- Select a User --</option>`;
    }

    snapshot.forEach(docSnap => {
      const u = { uid: docSnap.id, ...docSnap.data() };
      allUsersCache.push(u);

      if (adminSelectUser) {
        const opt = document.createElement("option");
        opt.value = u.uid;
        opt.textContent = `${u.mcUsername || 'No IGN'} (${u.email}) - ${u.gems || 0} Gems`;
        adminSelectUser.appendChild(opt);
      }
    });

    if (statTotalUsers) statTotalUsers.innerText = snapshot.size;
    triggerSearchFilter();
  }, (err) => {
    console.error("Error in users real-time listener:", err);
    showToast("Failed to sync users directory.", "error");
  });
}

// Render Users Directory
function renderUsersTable(usersList) {
  if (!usersTableBody) return;
  usersTableBody.innerHTML = "";

  if (usersList.length === 0) {
    usersTableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 20px;">No matching users found.</td></tr>`;
    return;
  }

  usersList.forEach(u => {
    const displayPassword = u.password || "••••••••";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escapeHtml(u.email || 'N/A')}</strong></td>
      <td><span style="color: var(--color-cyan); font-weight: 700;">${escapeHtml(u.mcUsername || 'N/A')}</span></td>
      <td><code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; color: var(--text-muted); font-size: 0.85rem;">${escapeHtml(displayPassword)}</code></td>
      <td><strong style="color: var(--color-gold);">💎 ${u.gems || 0}</strong></td>
      <td>${u.isAdmin ? '<span class="badge-admin">ADMIN</span>' : '<span style="color: var(--text-muted);">Player</span>'}</td>
      <td>
        <button class="nav-btn btn-outline btn-sm quick-add-btn" data-uid="${u.uid}" data-action="add" data-amount="100" style="border-color: var(--color-green); color: var(--color-green); padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;">+100</button>
        <button class="nav-btn btn-outline btn-sm quick-add-btn" data-uid="${u.uid}" data-action="remove" data-amount="100" style="border-color: var(--color-danger); color: var(--color-danger); padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;">-100</button>
        <button class="nav-btn btn-outline btn-sm quick-add-btn" data-uid="${u.uid}" data-action="reset" style="border-color: var(--text-muted); color: var(--text-muted); padding: 4px 8px; font-size: 0.75rem; margin-right: 4px;">Reset</button>
        <button class="nav-btn btn-sm delete-user-btn" data-uid="${u.uid}" data-email="${escapeHtml(u.email || '')}" data-username="${escapeHtml(u.mcUsername || '')}" style="border-color: var(--color-danger); color: #fff; background-color: var(--color-danger); padding: 4px 8px; font-size: 0.75rem;">Delete</button>
      </td>
    `;
    usersTableBody.appendChild(tr);
  });

  document.querySelectorAll(".quick-add-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const uid = e.currentTarget.getAttribute("data-uid");
      const action = e.currentTarget.getAttribute("data-action");
      const amount = parseInt(e.currentTarget.getAttribute("data-amount") || "0", 10);
      grantGemsToUser(uid, action, amount);
    });
  });

  document.querySelectorAll(".delete-user-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const uid = e.currentTarget.getAttribute("data-uid");
      const email = e.currentTarget.getAttribute("data-email");
      const username = e.currentTarget.getAttribute("data-username");
      deleteUserAccount(uid, email, username);
    });
  });
}

// User Search Input Filter
function triggerSearchFilter() {
  const query = (adminSearchUsers?.value || "").toLowerCase().trim();
  if (!query) {
    renderUsersTable(allUsersCache);
    return;
  }
  const filtered = allUsersCache.filter(u => {
    const email = (u.email || "").toLowerCase();
    const username = (u.mcUsername || "").toLowerCase();
    const password = (u.password || "").toLowerCase();
    return email.includes(query) || username.includes(query) || password.includes(query);
  });
  renderUsersTable(filtered);
}

adminSearchUsers?.addEventListener("input", triggerSearchFilter);

adminGemsAction?.addEventListener("change", (e) => {
  if (e.target.value === "reset") {
    adminGemsAmount.value = "0";
    adminGemsAmount.disabled = true;
    adminGemsAmount.required = false;
  } else {
    adminGemsAmount.disabled = false;
    adminGemsAmount.required = true;
  }
});

// Real-time Listener: Purchases (auto-updates on new purchases, task completions, deletions)
function startPurchasesRealtimeListener() {
  if (purchasesUnsubscribe) purchasesUnsubscribe(); // clean up old listener

  purchasesUnsubscribe = db.collection("purchases").orderBy("createdAt", "desc").limit(100).onSnapshot((snapshot) => {
    allPendingPurchases = [];
    allCompletedPurchases = [];

    snapshot.forEach(docSnap => {
      const item = { id: docSnap.id, ...docSnap.data() };
      if (item.status === "completed") {
        allCompletedPurchases.push(item);
      } else {
        allPendingPurchases.push(item);
      }
    });

    renderPendingPurchasesTable(allPendingPurchases);
    renderCompletedPurchasesTable(allCompletedPurchases);

    // Update Overview Counters
    if (statTotalPurchases) statTotalPurchases.innerText = allPendingPurchases.length;
    if (statCompletedPurchases) statCompletedPurchases.innerText = allCompletedPurchases.length;
    if (pendingCountBadge) pendingCountBadge.innerText = `${allPendingPurchases.length} Pending`;
  }, (err) => {
    console.error("Error in purchases real-time listener:", err);
    showToast("Failed to sync purchase tasks.", "error");
  });
}

// Render Pending Dispatch Tasks Table (with Checkbox Tick button)
function renderPendingPurchasesTable(pendingList) {
  if (!purchasesTableBody) return;
  purchasesTableBody.innerHTML = "";

  if (pendingList.length === 0) {
    purchasesTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">🎉 All dispatches completed! No pending tasks.</td></tr>`;
    return;
  }

  pendingList.forEach(p => {
    const dateStr = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleString() : "Just now";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td style="text-align: center;">
        <button class="nav-btn btn-outline btn-sm task-tick-btn" data-id="${p.id}" style="border-color: var(--color-green); color: var(--color-green); padding: 6px 12px; font-size: 0.8rem;" title="Mark Task Completed">
          ☑ Done
        </button>
      </td>
      <td style="font-size: 0.8rem; color: var(--text-muted);">${dateStr}</td>
      <td><strong>${escapeHtml(p.buyerEmail || 'N/A')}</strong></td>
      <td><strong style="color: var(--color-cyan);">${escapeHtml(p.targetUsername || 'N/A')}</strong></td>
      <td>${escapeHtml(p.itemTitle || 'N/A')}</td>
      <td><strong style="color: var(--color-gold);">💎 ${p.costGems || 0}</strong></td>
      <td>
        <div class="cmd-badge">
          <code>${escapeHtml(p.commandToRun || '')}</code>
          <button class="copy-cmd-btn" data-cmd="${escapeHtml(p.commandToRun || '')}" title="Copy Command" style="background: none; border: none; cursor: pointer; color: var(--color-cyan);">
            📋
          </button>
        </div>
      </td>
    `;
    purchasesTableBody.appendChild(tr);
  });

  // Attach Mark Done tick event listeners
  document.querySelectorAll(".task-tick-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const docId = e.currentTarget.getAttribute("data-id");
      toggleTaskCompletion(docId, true);
    });
  });

  // Attach Copy Command buttons
  document.querySelectorAll(".copy-cmd-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cmd = e.currentTarget.getAttribute("data-cmd");
      navigator.clipboard.writeText(cmd);
      showToast("Console command copied to clipboard!", "success");
    });
  });
}

// Render Completed History Table
function renderCompletedPurchasesTable(completedList) {
  if (!completedTableBody) return;
  completedTableBody.innerHTML = "";

  if (completedList.length === 0) {
    completedTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No completed tasks yet. Tick a task above to mark it done.</td></tr>`;
    return;
  }

  completedList.forEach(p => {
    const createdStr = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleString() : "N/A";
    const completedStr = p.completedAt ? new Date(p.completedAt.seconds * 1000).toLocaleString() : "Just now";

    const tr = document.createElement("tr");
    tr.style.background = "rgba(0, 230, 118, 0.02)";
    tr.innerHTML = `
      <td style="text-align: center;">
        <span style="color: var(--color-green); font-size: 1.2rem; font-weight: bold;" title="Task Completed">✅</span>
      </td>
      <td style="font-size: 0.8rem; color: var(--text-muted);">${createdStr}</td>
      <td>${escapeHtml(p.buyerEmail || 'N/A')}</td>
      <td><strong style="color: var(--color-cyan);">${escapeHtml(p.targetUsername || 'N/A')}</strong></td>
      <td>${escapeHtml(p.itemTitle || 'N/A')}</td>
      <td><strong style="color: var(--color-gold);">💎 ${p.costGems || 0}</strong></td>
      <td>
        <div class="cmd-badge">
          <code>${escapeHtml(p.commandToRun || '')}</code>
          <button class="copy-cmd-btn" data-cmd="${escapeHtml(p.commandToRun || '')}" title="Copy Command" style="background: none; border: none; cursor: pointer; color: var(--color-cyan);">
            📋
          </button>
        </div>
      </td>
      <td style="font-size: 0.8rem; color: var(--color-green);">${completedStr}</td>
      <td style="text-align: center;">
        <button class="nav-btn btn-outline btn-sm task-revert-btn" data-id="${p.id}" style="border-color: var(--text-muted); color: var(--text-muted); padding: 4px 8px; font-size: 0.75rem;" title="Move back to pending tasks">
          ↩ Revert
        </button>
      </td>
    `;
    completedTableBody.appendChild(tr);
  });

  // Attach Revert button click event listeners
  document.querySelectorAll(".task-revert-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const docId = e.currentTarget.getAttribute("data-id");
      toggleTaskCompletion(docId, false);
    });
  });

  // Attach Copy Command buttons
  document.querySelectorAll(".copy-cmd-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cmd = e.currentTarget.getAttribute("data-cmd");
      navigator.clipboard.writeText(cmd);
      showToast("Console command copied to clipboard!", "success");
    });
  });
}

// Toggle Task Completion Status in Firestore
async function toggleTaskCompletion(docId, markCompleted) {
  if (!docId) return;

  try {
    const updateData = markCompleted
      ? { status: "completed", completedAt: firebase.firestore.FieldValue.serverTimestamp() }
      : { status: "pending", completedAt: firebase.firestore.FieldValue.delete() };

    await db.collection("purchases").doc(docId).update(updateData);

    showToast(markCompleted ? "Task marked as completed! ✅" : "Task reverted back to pending. ⏳", markCompleted ? "success" : "info");
    fetchPurchases();
  } catch (err) {
    console.error("Error toggling task status:", err);
    showToast("Failed to update task status in database.", "error");
  }
}

// Completed Search Handler
adminSearchCompleted?.addEventListener("input", () => {
  const query = (adminSearchCompleted.value || "").toLowerCase().trim();
  if (!query) {
    renderCompletedPurchasesTable(allCompletedPurchases);
    return;
  }

  const filtered = allCompletedPurchases.filter(p => {
    const email = (p.buyerEmail || "").toLowerCase();
    const ign = (p.targetUsername || "").toLowerCase();
    const item = (p.itemTitle || "").toLowerCase();
    return email.includes(query) || ign.includes(query) || item.includes(query);
  });

  renderCompletedPurchasesTable(filtered);
});

// Toggle Hide / Expand Completed History List
const toggleCompletedListBtn = document.getElementById("toggle-completed-list-btn");
const completedTableWrapper = document.getElementById("completed-table-wrapper");

toggleCompletedListBtn?.addEventListener("click", () => {
  if (!completedTableWrapper) return;
  if (completedTableWrapper.style.display === "none") {
    completedTableWrapper.style.display = "block";
    toggleCompletedListBtn.innerHTML = "👁️ Hide History List";
    showToast("Completed history list shown.", "info");
  } else {
    completedTableWrapper.style.display = "none";
    toggleCompletedListBtn.innerHTML = "👁️ Show History List";
    showToast("Completed history list hidden.", "info");
  }
});

// Delete All Completed History from Database
const deleteAllCompletedBtn = document.getElementById("delete-all-completed-btn");

deleteAllCompletedBtn?.addEventListener("click", async () => {
  if (allCompletedPurchases.length === 0) {
    showToast("No completed transactions to delete.", "error");
    return;
  }

  const confirmDelete = confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE ALL ${allCompletedPurchases.length} completed transaction records from the database? This action CANNOT be undone!`);
  if (!confirmDelete) return;

  try {
    deleteAllCompletedBtn.disabled = true;
    deleteAllCompletedBtn.innerText = "Deleting...";

    const batch = db.batch();
    allCompletedPurchases.forEach(item => {
      const docRef = db.collection("purchases").doc(item.id);
      batch.delete(docRef);
    });

    await batch.commit();
    showToast(`Successfully deleted ${allCompletedPurchases.length} completed transaction records from database! 🗑️`, "success");
    loadAdminDashboardData();
  } catch (err) {
    console.error("Error deleting completed transactions:", err);
    showToast("Failed to delete completed transaction records.", "error");
  } finally {
    deleteAllCompletedBtn.disabled = false;
    deleteAllCompletedBtn.innerText = "🗑️ Delete All History";
  }
});

// Extract Completed Transactions to CSV File
exportCompletedCsvBtn?.addEventListener("click", () => {
  if (allCompletedPurchases.length === 0) {
    showToast("No completed transactions available to extract.", "error");
    return;
  }

  const headers = ["Date & Time", "Buyer Email", "Target IGN", "Item Title", "Cost (Gems)", "Console Command", "Status", "Completed At"];
  const rows = allCompletedPurchases.map(p => {
    const createdStr = p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleString() : "N/A";
    const completedStr = p.completedAt ? new Date(p.completedAt.seconds * 1000).toLocaleString() : "N/A";
    return [
      `"${createdStr}"`,
      `"${p.buyerEmail || ''}"`,
      `"${p.targetUsername || ''}"`,
      `"${p.itemTitle || ''}"`,
      `"${p.costGems || 0}"`,
      `"${(p.commandToRun || '').replace(/"/g, '""')}"`,
      `"Completed"`,
      `"${completedStr}"`
    ];
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `moon_completed_dispatches_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast(`Successfully extracted ${allCompletedPurchases.length} completed transactions! 📥`, "success");
});

// Grant, Remove, or Reset Gems to User
async function grantGemsToUser(uid, action, amount) {
  if (!uid) {
    showToast("Invalid user specified.", "error");
    return;
  }

  const user = allUsersCache.find(u => u.uid === uid);
  if (!user) {
    showToast("User not found.", "error");
    return;
  }

  if (action !== "reset" && (isNaN(amount) || amount < 0)) {
    showToast("Invalid gems amount specified.", "error");
    return;
  }

  const currentGems = user.gems || 0;
  let newGems = currentGems;

  if (action === "add") {
    newGems = currentGems + amount;
  } else if (action === "remove") {
    newGems = Math.max(0, currentGems - amount);
  } else if (action === "set") {
    newGems = Math.max(0, amount);
  } else if (action === "reset") {
    newGems = 0;
  }

  try {
    await db.collection("users").doc(uid).update({
      gems: newGems,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast(`Updated Gems for ${user.mcUsername || user.email} to ${newGems} Gems!`, "success");
    loadAdminDashboardData();
  } catch (err) {
    console.error("Error updating gems:", err);
    showToast("Failed to update user Gems.", "error");
  }
}

// Delete User Account from Firestore database
async function deleteUserAccount(uid, email, username) {
  if (!uid) {
    showToast("Invalid user specified.", "error");
    return;
  }

  const confirmDelete = confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE player "${username || 'No IGN'}" (${email})?\n\nThis will remove their profile from the database. When this player next opens the store, their Authentication account will also be cleaned up.`);
  if (!confirmDelete) return;

  try {
    await db.collection("users").doc(uid).delete();
    showToast(`Successfully deleted user ${email} from Firestore! 🗑️`, "success");
    loadAdminDashboardData();
  } catch (err) {
    console.error("Error deleting user:", err);
    showToast("Failed to delete user account from Firestore.", "error");
  }
}

// Admin Gems Form Submission
adminGemsForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedUid = adminSelectUser.value;
  const action = adminGemsAction.value;
  const amount = parseInt(adminGemsAmount.value, 10);

  grantGemsToUser(selectedUid, action, amount);
  adminGemsForm.reset();
  
  adminGemsAmount.disabled = false;
  adminGemsAmount.required = true;
});

// ==========================================================================
// Admin Gift Cards Management Logic
// ==========================================================================

// Gift Card Tier Level Evaluator
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

// 5-Digit Random Code Generator
function generate5DigitCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

// Live Tier Preview in Admin Form
const adminGiftcardGemsInput = document.getElementById("admin-giftcard-gems");
const adminGiftcardTierBadge = document.getElementById("admin-giftcard-tier-badge");

adminGiftcardGemsInput?.addEventListener("input", () => {
  const gems = parseInt(adminGiftcardGemsInput.value, 10) || 0;
  const tier = getGiftCardTier(gems);
  if (adminGiftcardTierBadge) {
    adminGiftcardTierBadge.className = `tier-badge ${tier.key}`;
    adminGiftcardTierBadge.innerHTML = `${tier.icon} ${tier.name} Tier`;
  }
});

// Admin Create Gift Card Handler
document.getElementById("admin-giftcard-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const gems = parseInt(adminGiftcardGemsInput.value, 10);
  if (isNaN(gems) || gems < 1) {
    showToast("Please enter a valid Gems amount.", "error");
    return;
  }

  try {
    const code = generate5DigitCode();
    const tier = getGiftCardTier(gems);

    await db.collection("gift_cards").add({
      code: code,
      gems: gems,
      tierName: tier.name,
      tierKey: tier.key,
      tierIcon: tier.icon,
      creatorUid: "admin",
      creatorEmail: "Admin Panel",
      creatorUsername: "👑 Administrator",
      isRedeemed: false,
      redeemedByUid: null,
      redeemedByEmail: null,
      redeemedByUsername: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      redeemedAt: null
    });

    showToast(`Successfully created Admin Gift Card Code [${code}] worth ${gems} Gems! (${tier.name} Tier)`, "success");
    document.getElementById("admin-giftcard-form").reset();
    if (adminGiftcardTierBadge) {
      adminGiftcardTierBadge.className = "tier-badge bronze";
      adminGiftcardTierBadge.innerHTML = "🥉 Bronze Tier";
    }
  } catch (err) {
    console.error("Admin gift card creation error:", err);
    showToast("Failed to create admin gift card.", "error");
  }
});

// Real-time Listener for Gift Cards Directory
function startGiftCardsRealtimeListener() {
  if (giftCardsUnsubscribe) giftCardsUnsubscribe();

  giftCardsUnsubscribe = db.collection("gift_cards").orderBy("createdAt", "desc").limit(200).onSnapshot((snapshot) => {
    allGiftCardsCache = [];
    snapshot.forEach(docSnap => {
      allGiftCardsCache.push({ id: docSnap.id, ...docSnap.data() });
    });
    triggerGiftCardsSearchFilter();
  }, (err) => {
    console.error("Error in gift cards real-time listener:", err);
    showToast("Failed to sync gift cards directory.", "error");
  });
}

// Render Gift Cards Table
function renderGiftCardsTable(list) {
  const tableBody = document.getElementById("giftcards-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No gift cards found.</td></tr>`;
    return;
  }

  list.forEach(c => {
    const tier = getGiftCardTier(c.gems);
    const createdStr = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString() : "Just now";
    const redeemedStr = c.redeemedAt ? new Date(c.redeemedAt.seconds * 1000).toLocaleString() : "-";
    const statusBadge = c.isRedeemed 
      ? `<span style="color: var(--color-green); font-weight: 700; background: rgba(0, 230, 118, 0.1); border: 1px solid rgba(0,230,118,0.3); padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;">✅ Redeemed</span>`
      : `<span style="color: var(--color-gold); font-weight: 700; background: rgba(255, 215, 0, 0.1); border: 1px solid rgba(255,215,0,0.3); padding: 4px 8px; border-radius: 12px; font-size: 0.78rem;">⚡ Active</span>`;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code style="font-family: monospace; font-size: 1.1rem; font-weight: 900; color: var(--color-cyan); background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 6px; letter-spacing: 2px;">${escapeHtml(c.code || 'N/A')}</code></td>
      <td><strong style="color: var(--color-gold);">💎 ${c.gems || 0}</strong></td>
      <td><span class="tier-badge ${tier.key}">${tier.icon} ${tier.name}</span></td>
      <td><strong>${escapeHtml(c.creatorUsername || 'Player')}</strong> <div style="font-size: 0.75rem; color: var(--text-muted);">${escapeHtml(c.creatorEmail || '')}</div></td>
      <td>${statusBadge}</td>
      <td>${c.isRedeemed ? `<strong style="color: var(--color-cyan);">${escapeHtml(c.redeemedByUsername || 'Player')}</strong>` : '<span style="color: var(--text-muted);">-</span>'}</td>
      <td style="font-size: 0.78rem; color: var(--text-muted);">${createdStr}</td>
      <td style="font-size: 0.78rem; color: var(--text-muted);">${redeemedStr}</td>
      <td style="text-align: center;">
        <button class="nav-btn btn-sm delete-card-btn" data-id="${c.id}" data-code="${escapeHtml(c.code || '')}" style="border-color: var(--color-danger); color: #fff; background-color: var(--color-danger); padding: 4px 10px; font-size: 0.75rem;">
          🗑️ Delete
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach delete listeners
  document.querySelectorAll(".delete-card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const docId = e.currentTarget.getAttribute("data-id");
      const code = e.currentTarget.getAttribute("data-code");
      deleteGiftCardDoc(docId, code);
    });
  });
}

// Search Filter for Gift Cards
function triggerGiftCardsSearchFilter() {
  const query = (document.getElementById("admin-search-giftcards")?.value || "").toLowerCase().trim();
  if (!query) {
    renderGiftCardsTable(allGiftCardsCache);
    return;
  }
  const filtered = allGiftCardsCache.filter(c => {
    const code = (c.code || "").toLowerCase();
    const creator = (c.creatorUsername || "").toLowerCase();
    const creatorEmail = (c.creatorEmail || "").toLowerCase();
    const redeemer = (c.redeemedByUsername || "").toLowerCase();
    return code.includes(query) || creator.includes(query) || creatorEmail.includes(query) || redeemer.includes(query);
  });
  renderGiftCardsTable(filtered);
}

document.getElementById("admin-search-giftcards")?.addEventListener("input", triggerGiftCardsSearchFilter);

// Delete single Gift Card document from Firestore database
async function deleteGiftCardDoc(docId, code) {
  if (!docId) return;

  const confirmDelete = confirm(`⚠️ Are you sure you want to PERMANENTLY DELETE Gift Card code [${code}] from the database?`);
  if (!confirmDelete) return;

  try {
    await db.collection("gift_cards").doc(docId).delete();
    showToast(`Gift card code [${code}] deleted from database! 🗑️`, "success");
  } catch (err) {
    console.error("Error deleting gift card:", err);
    showToast("Failed to delete gift card.", "error");
  }
}

// Delete ALL Gift Cards History from database
document.getElementById("delete-all-giftcards-btn")?.addEventListener("click", async () => {
  if (allGiftCardsCache.length === 0) {
    showToast("No gift card history to delete.", "error");
    return;
  }

  const confirmDelete = confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE ALL ${allGiftCardsCache.length} gift card records from the database? This action CANNOT be undone!`);
  if (!confirmDelete) return;

  const deleteBtn = document.getElementById("delete-all-giftcards-btn");
  try {
    deleteBtn.disabled = true;
    deleteBtn.innerText = "Deleting...";

    const batch = db.batch();
    allGiftCardsCache.forEach(c => {
      const docRef = db.collection("gift_cards").doc(c.id);
      batch.delete(docRef);
    });

    await batch.commit();
    showToast(`Successfully deleted ${allGiftCardsCache.length} gift card records from database! 🗑️`, "success");
  } catch (err) {
    console.error("Error deleting all gift cards:", err);
    showToast("Failed to delete all gift card records.", "error");
  } finally {
    deleteBtn.disabled = false;
    deleteBtn.innerText = "🗑️ Delete All Gift Cards History";
  }
});

// Delete ALL Completed Tasks / Receipts History Handler
document.getElementById("delete-all-completed-btn")?.addEventListener("click", async () => {
  if (allCompletedPurchases.length === 0) {
    showToast("No completed tasks or receipts to delete.", "error");
    return;
  }

  const confirmDelete = confirm(`⚠️ DANGER: Are you sure you want to PERMANENTLY DELETE ALL ${allCompletedPurchases.length} completed receipts/tasks from the database? This action CANNOT be undone!`);
  if (!confirmDelete) return;

  const btn = document.getElementById("delete-all-completed-btn");
  try {
    btn.disabled = true;
    btn.innerText = "Deleting...";

    const batch = db.batch();
    allCompletedPurchases.forEach(p => {
      const docRef = db.collection("purchases").doc(p.id);
      batch.delete(docRef);
    });

    await batch.commit();
    showToast(`Successfully deleted ${allCompletedPurchases.length} completed receipts from database! 🗑️`, "success");
  } catch (err) {
    console.error("Error deleting completed tasks:", err);
    showToast("Failed to delete completed task receipts.", "error");
  } finally {
    btn.disabled = false;
    btn.innerText = "🗑️ Delete All Completed Tasks Log";
  }
});

// ==========================================================================
// Debit Cards Management System (16-Digit Card Creation, Operations & Directory)
// ==========================================================================

function format16DigitCardNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 16);
  const parts = [];
  for (let i = 0; i < digits.length; i += 4) {
    parts.push(digits.substring(i, i + 4));
  }
  return parts.join(' ');
}

function generate16DigitCardNumber() {
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

// Auto format input listener on admin debit card creation field
const adminDebitNumInput = document.getElementById("admin-debit-number");
adminDebitNumInput?.addEventListener("input", (e) => {
  e.target.value = format16DigitCardNumber(e.target.value);
});

// Auto Generate 16-digit number button listener
document.getElementById("admin-auto-gen-card-btn")?.addEventListener("click", () => {
  const genNum = generate16DigitCardNumber();
  if (adminDebitNumInput) {
    adminDebitNumInput.value = format16DigitCardNumber(genNum);
  }
});

// Create New Debit Card Handler
document.getElementById("admin-create-debitcard-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const rawNum = document.getElementById("admin-debit-number").value;
  const cleanNum = rawNum.replace(/\s+/g, '');
  const pin = document.getElementById("admin-debit-pin").value.trim();
  const initialGems = parseInt(document.getElementById("admin-debit-gems").value, 10) || 0;

  if (cleanNum.length !== 16 || isNaN(cleanNum)) {
    showToast("Please enter a valid 16-digit numeric card number.", "error");
    return;
  }
  if (!/^[0-9]{3,4}$/.test(pin)) {
    showToast("Please enter a valid 3 or 4-digit numeric PIN code.", "error");
    return;
  }
  if (isNaN(initialGems) || initialGems < 0) {
    showToast("Please enter a valid initial Gems amount.", "error");
    return;
  }

  try {
    const existing = await db.collection("debit_cards").where("cardNumber", "==", cleanNum).limit(1).get();
    if (!existing.empty) {
      showToast("A debit card with this 16-digit card number already exists!", "error");
      return;
    }

    await db.collection("debit_cards").add({
      cardNumber: cleanNum,
      pin: pin,
      gems: initialGems,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    showToast(`Debit Card [${format16DigitCardNumber(cleanNum)}] created with ${initialGems} Gems!`, "success");
    document.getElementById("admin-create-debitcard-form").reset();
  } catch (err) {
    console.error("Error creating debit card:", err);
    showToast("Failed to create debit card.", "error");
  }
});

// Real-time Listener for Debit Cards Directory & Select Dropdown
function startDebitCardsRealtimeListener() {
  if (debitCardsUnsubscribe) debitCardsUnsubscribe();

  const selectEl = document.getElementById("admin-select-debit-card");

  debitCardsUnsubscribe = db.collection("debit_cards").orderBy("createdAt", "desc").limit(200).onSnapshot((snapshot) => {
    allDebitCardsCache = [];
    if (selectEl) selectEl.innerHTML = `<option value="">-- Select a Debit Card --</option>`;

    snapshot.forEach(docSnap => {
      const card = { id: docSnap.id, ...docSnap.data() };
      allDebitCardsCache.push(card);

      if (selectEl) {
        const opt = document.createElement("option");
        opt.value = card.id;
        opt.textContent = `${format16DigitCardNumber(card.cardNumber)} (PIN: ${card.pin}) - ${card.gems || 0} Gems`;
        selectEl.appendChild(opt);
      }
    });

    triggerDebitCardsSearchFilter();
  }, (err) => {
    console.error("Error in debit cards listener:", err);
    showToast("Failed to sync debit cards directory.", "error");
  });
}

// Modify Selected Debit Card Gems Form Handler
document.getElementById("admin-debit-gems-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const docId = document.getElementById("admin-select-debit-card").value;
  const action = document.getElementById("admin-debit-gems-action").value;
  const amountInput = parseInt(document.getElementById("admin-debit-gems-amount").value, 10) || 0;

  if (!docId) {
    showToast("Please select a Debit Card to update.", "error");
    return;
  }

  const cardRef = db.collection("debit_cards").doc(docId);

  try {
    await db.runTransaction(async (transaction) => {
      const cardDoc = await transaction.get(cardRef);
      if (!cardDoc.exists) throw new Error("Debit card document not found.");

      const currentGems = cardDoc.data().gems || 0;
      let newGems = currentGems;

      if (action === "add") newGems += amountInput;
      else if (action === "remove") newGems = Math.max(0, currentGems - amountInput);
      else if (action === "set") newGems = amountInput;
      else if (action === "reset") newGems = 0;

      transaction.update(cardRef, {
        gems: newGems,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    });

    showToast(`Debit Card Gems updated successfully!`, "success");
    document.getElementById("admin-debit-gems-amount").value = "";
  } catch (err) {
    console.error("Error updating debit card gems:", err);
    showToast(err.message || "Failed to update card gems.", "error");
  }
});

// Render Debit Cards Table Directory
function renderDebitCardsTable(list) {
  const tableBody = document.getElementById("debitcards-table-body");
  if (!tableBody) return;
  tableBody.innerHTML = "";

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px;">No debit cards found.</td></tr>`;
    return;
  }

  list.forEach(c => {
    const createdStr = c.createdAt ? new Date(c.createdAt.seconds * 1000).toLocaleString() : "Just now";
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code style="font-family: monospace; font-size: 0.95rem; font-weight: 700; color: var(--color-cyan); background: rgba(0,0,0,0.3); padding: 4px 8px; border-radius: 6px; letter-spacing: 1px;">${format16DigitCardNumber(c.cardNumber)}</code></td>
      <td><code style="font-family: monospace; font-size: 1.05rem; font-weight: 800; color: #fff; background: rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 4px; letter-spacing: 3px;">${escapeHtml(c.pin || '••••')}</code></td>
      <td><strong style="color: var(--color-gold); font-size: 1.05rem;">💎 ${c.gems || 0}</strong></td>
      <td style="font-size: 0.78rem; color: var(--text-muted);">${createdStr}</td>
      <td>
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="nav-btn btn-outline btn-sm add-quick-gems-btn" data-id="${c.id}" data-amount="100" style="padding: 2px 8px; font-size: 0.75rem;">+100 💎</button>
          <button class="nav-btn btn-outline btn-sm reset-card-gems-btn" data-id="${c.id}" style="padding: 2px 8px; font-size: 0.75rem; border-color: var(--color-gold); color: var(--color-gold);">Reset 0 💎</button>
          <button class="nav-btn btn-sm delete-debit-card-btn" data-id="${c.id}" data-cardnum="${escapeHtml(c.cardNumber || '')}" style="border-color: var(--color-danger); color: #fff; background-color: var(--color-danger); padding: 2px 8px; font-size: 0.75rem;">🗑️ Delete</button>
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach table quick action listeners
  document.querySelectorAll(".add-quick-gems-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      const amount = parseInt(e.currentTarget.getAttribute("data-amount"), 10);
      try {
        await db.collection("debit_cards").doc(id).update({
          gems: firebase.firestore.FieldValue.increment(amount),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast(`+${amount} Gems added to card!`, "success");
      } catch (err) {
        showToast("Failed to add gems.", "error");
      }
    });
  });

  document.querySelectorAll(".reset-card-gems-btn").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.getAttribute("data-id");
      try {
        await db.collection("debit_cards").doc(id).update({
          gems: 0,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast(`Card Gems balance reset to 0!`, "info");
      } catch (err) {
        showToast("Failed to reset card gems.", "error");
      }
    });
  });

  document.querySelectorAll(".delete-debit-card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const docId = e.currentTarget.getAttribute("data-id");
      const cardNum = e.currentTarget.getAttribute("data-cardnum");
      deleteDebitCardDoc(docId, cardNum);
    });
  });
}

// Search Filter for Debit Cards Directory
function triggerDebitCardsSearchFilter() {
  const query = (document.getElementById("admin-search-debitcards")?.value || "").toLowerCase().replace(/\s+/g, '');
  if (!query) {
    renderDebitCardsTable(allDebitCardsCache);
    return;
  }
  const filtered = allDebitCardsCache.filter(c => {
    const num = (c.cardNumber || "").toLowerCase();
    const pin = (c.pin || "").toLowerCase();
    return num.includes(query) || pin.includes(query);
  });
  renderDebitCardsTable(filtered);
}

document.getElementById("admin-search-debitcards")?.addEventListener("input", triggerDebitCardsSearchFilter);

// Delete Debit Card Document from Firestore
async function deleteDebitCardDoc(docId, cardNumber) {
  if (!docId) return;

  const confirmDelete = confirm(`⚠️ Are you sure you want to PERMANENTLY DELETE Debit Card [${format16DigitCardNumber(cardNumber)}]?`);
  if (!confirmDelete) return;

  try {
    await db.collection("debit_cards").doc(docId).delete();
    showToast(`Debit Card deleted from database! 🗑️`, "success");
  } catch (err) {
    console.error("Error deleting debit card:", err);
    showToast("Failed to delete debit card.", "error");
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Check PIN Security State on Load
document.addEventListener("DOMContentLoaded", () => {
  checkAdminPinAuth();
});

// Run immediate check
checkAdminPinAuth();

// ==========================================================================
// Debit Cards Bank Savings Interest System
// ==========================================================================

let currentInterestSettings = {
  enabled: true,
  ratePercent: 5,
  interval: "daily",
  lastAppliedAt: null
};

// Real-time / One-time Listener for Interest Settings
function initDebitCardInterestSettings() {
  db.collection("settings").doc("debit_card_interest").onSnapshot((docSnap) => {
    if (docSnap.exists) {
      currentInterestSettings = docSnap.data();
      updateInterestUIFields();
      checkAndApplyDebitCardInterest(false);
    } else {
      // Initialize default settings document in Firestore
      const initialSettings = {
        enabled: true,
        ratePercent: 5,
        interval: "daily",
        lastAppliedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      db.collection("settings").doc("debit_card_interest").set(initialSettings).then(() => {
        currentInterestSettings = { enabled: true, ratePercent: 5, interval: "daily", lastAppliedAt: Date.now() };
        updateInterestUIFields();
      });
    }
  }, (err) => {
    console.error("Error loading interest settings:", err);
  });
}

function updateInterestUIFields() {
  const enableSwitch = document.getElementById("interest-enable-switch");
  const rateInput = document.getElementById("interest-rate-input");
  const intervalSelect = document.getElementById("interest-interval-select");
  const statusBadge = document.getElementById("interest-status-badge");
  const lastText = document.getElementById("last-interest-applied-text");
  const nextText = document.getElementById("next-interest-due-text");

  if (enableSwitch) enableSwitch.value = String(currentInterestSettings.enabled);
  if (rateInput) rateInput.value = currentInterestSettings.ratePercent ?? 5;
  if (intervalSelect) intervalSelect.value = currentInterestSettings.interval || "daily";

  if (statusBadge) {
    if (currentInterestSettings.enabled) {
      statusBadge.innerText = `🟢 ACTIVE (${currentInterestSettings.ratePercent}% / ${currentInterestSettings.interval})`;
      statusBadge.style.background = "rgba(0, 230, 118, 0.15)";
      statusBadge.style.color = "var(--color-green)";
      statusBadge.style.borderColor = "var(--color-green)";
    } else {
      statusBadge.innerText = `🔴 DISABLED`;
      statusBadge.style.background = "rgba(255, 77, 77, 0.15)";
      statusBadge.style.color = "var(--color-danger)";
      statusBadge.style.borderColor = "var(--color-danger)";
    }
  }

  // Format dates
  const lastTs = currentInterestSettings.lastAppliedAt
    ? (currentInterestSettings.lastAppliedAt.toMillis ? currentInterestSettings.lastAppliedAt.toMillis() : currentInterestSettings.lastAppliedAt)
    : Date.now();

  const intervalMs = (currentInterestSettings.interval === "weekly") ? (7 * 86400000) : 86400000;
  const nextTs = lastTs + intervalMs;

  if (lastText) lastText.innerText = new Date(lastTs).toLocaleString();
  if (nextText) {
    if (!currentInterestSettings.enabled) {
      nextText.innerText = "Disabled";
    } else if (Date.now() >= nextTs) {
      nextText.innerText = "⚡ Due Now! (Auto calculating...)";
    } else {
      const hoursLeft = Math.ceil((nextTs - Date.now()) / (1000 * 60 * 60));
      nextText.innerText = `Due in ~${hoursLeft} hour(s) (${new Date(nextTs).toLocaleString()})`;
    }
  }
}

// Calculate and Apply Interest to All Debit Cards
async function checkAndApplyDebitCardInterest(forceManual = false) {
  if (!currentInterestSettings || (!currentInterestSettings.enabled && !forceManual)) return;

  const ratePercent = parseFloat(currentInterestSettings.ratePercent) || 0;
  if (ratePercent <= 0) return;

  const lastTs = currentInterestSettings.lastAppliedAt
    ? (currentInterestSettings.lastAppliedAt.toMillis ? currentInterestSettings.lastAppliedAt.toMillis() : currentInterestSettings.lastAppliedAt)
    : Date.now();

  const intervalMs = (currentInterestSettings.interval === "weekly") ? (7 * 86400000) : 86400000;
  const elapsedMs = Date.now() - lastTs;
  let intervalsPassed = Math.floor(elapsedMs / intervalMs);

  if (forceManual) {
    intervalsPassed = Math.max(1, intervalsPassed);
  }

  if (intervalsPassed < 1) return; // Not due yet

  try {
    const snapshot = await db.collection("debit_cards").get();
    if (snapshot.empty) {
      await db.collection("settings").doc("debit_card_interest").update({
        lastAppliedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      return;
    }

    const batch = db.batch();
    let updatedCount = 0;
    let totalInterestGems = 0;

    snapshot.forEach(docSnap => {
      const card = docSnap.data();
      const currentGems = card.gems || 0;
      if (currentGems > 0) {
        // Compound interest growth per interval passed
        const rateDecimal = ratePercent / 100;
        const newGemsCalculated = Math.floor(currentGems * Math.pow(1 + rateDecimal, intervalsPassed));
        const gainGems = Math.max(1, newGemsCalculated - currentGems);
        const finalGems = currentGems + gainGems;

        totalInterestGems += gainGems;
        updatedCount++;

        batch.update(docSnap.ref, {
          gems: finalGems,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
    });

    const newLastApplied = forceManual ? Date.now() : (lastTs + (intervalsPassed * intervalMs));
    const settingsRef = db.collection("settings").doc("debit_card_interest");
    batch.update(settingsRef, {
      lastAppliedAt: firebase.firestore.Timestamp.fromMillis(newLastApplied)
    });

    await batch.commit();

    if (updatedCount > 0) {
      showToast(`🏦 Interest Paid! Added total 💎 ${totalInterestGems} Gems across ${updatedCount} debit card(s) (${ratePercent}% / ${currentInterestSettings.interval}).`, "success");
    } else {
      showToast(`Interest system checked: No active cards with Gems balance to credit.`, "info");
    }

  } catch (err) {
    console.error("Error applying debit card interest:", err);
    showToast("Failed to apply savings interest to debit cards.", "error");
  }
}

// Save Interest Settings Form Event Handler
document.getElementById("admin-debit-interest-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const enabled = document.getElementById("interest-enable-switch").value === "true";
  const ratePercent = parseFloat(document.getElementById("interest-rate-input").value) || 0;
  const interval = document.getElementById("interest-interval-select").value;

  if (ratePercent <= 0) {
    showToast("Please enter a valid positive interest rate percentage.", "error");
    return;
  }

  try {
    await db.collection("settings").doc("debit_card_interest").set({
      enabled: enabled,
      ratePercent: ratePercent,
      interval: interval,
      lastAppliedAt: currentInterestSettings.lastAppliedAt || firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    showToast("Debit Card Savings Interest Settings saved successfully! 🏦", "success");
  } catch (err) {
    console.error("Error saving interest settings:", err);
    showToast("Failed to save interest settings.", "error");
  }
});

// Apply Interest Now Button Handler
document.getElementById("apply-interest-now-btn")?.addEventListener("click", () => {
  const confirmApply = confirm(`🏦 Are you sure you want to apply interest payout to all debit cards NOW?\n\nRate: ${currentInterestSettings.ratePercent}%\nInterval: ${currentInterestSettings.interval}`);
  if (confirmApply) {
    checkAndApplyDebitCardInterest(true);
  }
});

