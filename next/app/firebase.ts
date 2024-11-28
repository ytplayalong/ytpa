import { initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import {
  doc,
  Firestore,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {};

class FirebaseManager {
  private readonly firebaseAuth: Auth;
  private readonly firestoreDb: Firestore;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.firebaseAuth = getAuth(app);
    this.firestoreDb = getFirestore(app);
  }

  userLoggedIn() {
    const user = this.firebaseAuth.currentUser;
    return !!user?.emailVerified;
  }

  private currentUser() {
    return this.firebaseAuth.currentUser;
  }

  getUserName() {
    const email = firebaseManager.currentUser()?.email ?? "@";
    return email.split("@")[0];
  }

  getAuth() {
    return this.firebaseAuth;
  }

  async signOut() {
    try {
      await signOut(this.firebaseAuth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  /** Sign-in a user by email and password. */
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );

      // Check that email is verified
      const user = userCredential.user;
      if (!user.emailVerified) {
        return { error: "Email not verified!" };
      }
    } catch (error) {
      return { error: `Sign-in failed, error: ${error}` };
    }
    return { info: "Sucessfully signed-in." };
  }

  /** Create user account using email and password. */
  async signUp(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password
      );

      // Send verification email
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log(`Success: Created user ${user.uid}!`);
      return { info: "Created user account, verify your email and log in." };
    } catch (error) {
      return { error: `Sign-up failed, error: ${error}` };
    }
  }

  async addFavorite(scoreId: string) {
    const userDocRef = this.getUserDoc();
    const loadedDoc = await getDoc(userDocRef);

    if (!loadedDoc.exists()) {
      console.log("creating new");
      const newData: DbUserData = { allFavorites: [scoreId] };
      await setDoc(userDocRef, newData);
    } else {
      const data = loadedDoc.data() as DbUserData;
      const currentList = data.allFavorites || [];
      const updatedList = Array.from(new Set([...currentList, scoreId])); // No duplicates
      const updatedData: DbUserData = { allFavorites: updatedList };
      await updateDoc(userDocRef, updatedData);
    }
  }

  async getFavorites() {
    const userDocRef = this.getUserDoc();
    const loadedDoc = await getDoc(userDocRef);
    if (!loadedDoc.exists()) {
      return [];
    }
    const data = loadedDoc.data() as DbUserData;
    const currentList: string[] = data.allFavorites || [];
    return currentList;
  }

  async removeFromFavorites(scoreId: string) {
    const userDocRef = this.getUserDoc();
    const loadedDoc = await getDoc(userDocRef);
    if (loadedDoc.exists()) {
      const data = loadedDoc.data() as DbUserData;
      const currentList: string[] = data.allFavorites || [];
      const updatedList = currentList.filter((el) => el != scoreId);
      const updatedData: DbUserData = { allFavorites: updatedList };
      await updateDoc(userDocRef, updatedData);
    }
  }

  /** Store user-specific data. */
  async storeUserDoc(data: any) {
    const currUser = this.currentUser();
    if (currUser == null) {
      return "Not logged-in.";
    }
    try {
      await setDoc(doc(this.firestoreDb, "users", currUser.uid), data);
    } catch (e) {
      return e;
    }
  }

  private getUserDoc() {
    const currUser = this.currentUser();
    console.assert(currUser != null);
    const userId = currUser!.uid;
    const userDocRef = doc(this.firestoreDb, "users", userId);
    return userDocRef;
  }
}

const firebaseManager = new FirebaseManager();
export default firebaseManager;

const getName = (user: User) => {
  const email = user.email ?? "user@";
  return email.split("@")[0];
};

/** Hook for usage of user.
 *
 * If the user is null, it is not logged-in. If it is undefined,
 * it is not yet determined if he is logged in.
 */
export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(
    undefined
  );

  useEffect(() => {
    const auth = firebaseManager.getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Save user in localStorage to avoid always waiting for
      if (user) {
        localStorage.setItem("username", getName(user));
      } else {
        localStorage.removeItem("username");
      }
      setCurrentUser(user || null);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  return currentUser;
};

export const getCurrUsername = (user: User | null | undefined) => {
  let userName: string | null = null;
  if (user) {
    userName = getName(user);
  } else if (user === undefined && typeof window !== "undefined") {
    console.log("Grabbing username from localstorage");
    const storedUsername = localStorage.getItem("username");
    if (storedUsername !== null) {
      userName = storedUsername;
    }
  }
  return userName;
};
