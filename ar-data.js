import { auth, db, storage } from './firebase-config.js';
import { 
    collection, doc, addDoc, getDoc, getDocs, query, where, deleteDoc, updateDoc 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { 
    ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-storage.js";

const MiraData = {
    /**
     * Saves an experience's metadata to Firestore and its files to Cloud Storage.
     */
    async saveExperience(experienceData, files = []) {
        const user = auth.currentUser;
        if (!user) throw new Error("User not authenticated.");

        try {
            // 1. Create a document in Firestore to get an ID
            const docRef = await addDoc(collection(db, "experiences"), {
                userId: user.uid,
                fileName: experienceData.fileName,
                type: experienceData.type,
                textData: experienceData.textData || null,
                createdAt: new Date(),
                fileUrls: [], // Placeholder for storage URLs
            });

            const experienceId = docRef.id;
            const fileUrls = [];

            // 2. Upload each file to Cloud Storage
            for (const file of files) {
                const filePath = `experiences/${user.uid}/${experienceId}/${file.name}`;
                const storageRef = ref(storage, filePath);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                fileUrls.push({ name: file.name, url: url, path: filePath });
            }

            // 3. Update the Firestore document with the file URLs
            if (fileUrls.length > 0) {
                await updateDoc(doc(db, "experiences", experienceId), {
                    fileUrls: fileUrls
                });
            }

            return experienceId;
        } catch (error) {
            console.error("Error saving experience:", error);
            throw error;
        }
    },

    /**
     * Retrieves a single experience from Firestore.
     */
    async getExperience(id) {
        try {
            const docRef = doc(db, "experiences", id);
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                console.log("No such document!");
                return null;
            }
            return { id: docSnap.id, ...docSnap.data() };
        } catch (error) {
            console.error("Error getting experience:", error);
            throw error;
        }
    },

    /**
     * Retrieves all experiences for the currently logged-in user.
     */
    async getAllExperiences() {
        const user = auth.currentUser;
        if (!user) return [];

        try {
            const q = query(collection(db, "experiences"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const experiences = [];
            querySnapshot.forEach((doc) => {
                experiences.push({ id: doc.id, ...doc.data() });
            });
            return experiences;
        } catch (error) {
            console.error("Error getting all experiences:", error);
            throw error;
        }
    },

    /**
     * Deletes an experience from Firestore and its associated files from Cloud Storage.
     */
    async deleteExperience(id) {
        try {
            const experience = await this.getExperience(id);
            if (!experience) throw new Error("Experience not found.");

            // Delete files from Cloud Storage
            if (experience.fileUrls && experience.fileUrls.length > 0) {
                for (const file of experience.fileUrls) {
                    const fileRef = ref(storage, file.path);
                    await deleteObject(fileRef);
                }
            }

            // Delete the Firestore document
            await deleteDoc(doc(db, "experiences", id));
            console.log("Experience deleted successfully");
        } catch (error) {
            console.error("Error deleting experience:", error);
            throw error;
        }
    }
};

window.MiraData = MiraData;
