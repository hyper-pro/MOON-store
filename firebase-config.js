// Firebase Compat SDK Initialization (Works on file:// double-click)
const firebaseConfig = {
  apiKey: "AIzaSyAlAANTPyblsCRoYoZW4qAl8ikYMZCLdPI",
  authDomain: "moon-server-2642b.firebaseapp.com",
  projectId: "moon-server-2642b",
  storageBucket: "moon-server-2642b.firebasestorage.app",
  messagingSenderId: "779046011539",
  appId: "1:779046011539:web:25189552266a094f6fc366"
};

// Initialize Firebase App globally
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
