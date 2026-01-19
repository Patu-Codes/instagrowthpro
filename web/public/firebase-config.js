// Firebase Configuration - InstaGrow-X Project
const firebaseConfig = {
    apiKey: "AIzaSyCJc3ZLiR9BSB01hOaSRHO3lSmLf0le8zw",
    authDomain: "instagrow-x.firebaseapp.com",
    projectId: "instagrow-x",
    storageBucket: "instagrow-x.firebasestorage.app",
    messagingSenderId: "320041630068",
    appId: "1:320041630068:web:01cde8140ceb3750ee9421",
    measurementId: "G-WMVHQCMEZS"
};

// Initialize Firebase
let db = null;
let firebaseInitialized = false;

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        firebaseInitialized = true;
        console.log('✅ Firebase initialized for cloud backup');
    }
} catch (error) {
    console.warn('⚠️ Firebase not available, using localStorage only:', error.message);
}

// Export for use
window.firebaseDB = db;
window.firebaseAvailable = firebaseInitialized;
