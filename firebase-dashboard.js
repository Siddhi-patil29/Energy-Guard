import { auth, db } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let currentUser = null;

// Protect Route
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('dashGreeting').textContent = `Welcome, ${user.displayName || 'User'}`;

        // Load User Energy Data
        const docRef = doc(db, "energyData", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.monthlyData && data.monthlyData.length === 12) {
                document.getElementById('sewdInput').value = data.monthlyData.join(',');
                // Auto-run if there is data
                setTimeout(() => {
                    if (typeof window.runWasteDetection === 'function') {
                        window.runWasteDetection();
                    }
                }, 1000);
            }
        }

        // Add Logout button to Navbar
        const navRight = document.querySelector('.navbar .nav-inner div[style*="align-items:center"]');
        if (navRight && !document.getElementById('logoutBtn')) {
            const logoutBtn = document.createElement('a');
            logoutBtn.id = 'logoutBtn';
            logoutBtn.className = 'btn btn-outline';
            logoutBtn.style.padding = '8px 18px';
            logoutBtn.style.fontSize = '0.85rem';
            logoutBtn.style.cursor = 'pointer';
            logoutBtn.textContent = 'Logout';
            logoutBtn.onclick = () => {
                signOut(auth).then(() => {
                    window.location.href = 'login.html';
                });
            };
            // Replace the back button or just append
            navRight.appendChild(logoutBtn);
        }

        // Listen for Site Settings changes
        const settingsRef = doc(db, "settings", "global");
        onSnapshot(settingsRef, (snapshot) => {
            if (snapshot.exists()) {
                const s = snapshot.data();
                if (s.email) document.getElementById('editContactEmail').value = s.email;
                if (s.phone) document.getElementById('editContactPhone').value = s.phone;
                if (s.repoSiddhi) document.getElementById('editRepoSiddhi').value = s.repoSiddhi;
                if (s.repoHarish) document.getElementById('editRepoHarish').value = s.repoHarish;
            }
        });

    } else {
        // Not logged in
        window.location.href = 'login.html';
    }
});

// Expose save functions to window so inline onclick handlers in dashboard.html can use them
window.saveEnergyDataToFirebase = async (valuesArray, wasteScore) => {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, "energyData", currentUser.uid), {
            monthlyData: valuesArray,
            wasteScore: wasteScore,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log("Energy data saved to Firestore");
    } catch (e) {
        console.error("Error saving energy data: ", e);
    }
};

window.saveSiteSettingsToFirebase = async (settings) => {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, "settings", "global"), {
            ...settings,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        console.log("Settings saved to Firestore");
    } catch (e) {
        console.error("Error saving settings: ", e);
    }
};
