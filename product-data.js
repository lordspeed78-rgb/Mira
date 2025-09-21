import { db } from './firebase-config.js'; 
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

window.ProductData = {
    /**
     * Fetches a single product document from Firestore.
     * @param {string} productId The ID of the document to fetch.
     * @returns {Promise<Object|null>} The product data or null if not found.
     */
    getProduct: async function(productId) {
        try {
            const docRef = doc(db, "products", productId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                console.warn("No such product document!");
                return null;
            }
        } catch (e) {
            console.error("Error getting product document:", e);
            throw e;
        }
    }
};
