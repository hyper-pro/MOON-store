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

// Real-time listener unsubscribers
let usersUnsubscribe = null;
let purchasesUnsubscribe = null;

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
  // Ensure Firebase Auth session exists anonymously if user is not signed in
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

  // Load Admin Data
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
}

// Refresh Data Button (re-subscribes listeners)
document.getElementById("refresh-admin-data")?.addEventListener("click", () => {
  // Unsubscribe and resubscribe to force a fresh pull
  if (usersUnsubscribe) usersUnsubscribe();
  if (purchasesUnsubscribe) purchasesUnsubscribe();
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

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Check PIN Security State on Load
document.addEventListener("DOMContentLoaded", () => {
  checkAdminPinAuth();
});

// Run immediate check
checkAdminPinAuth();
