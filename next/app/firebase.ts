import { initializeApp } from "firebase/app";
import {
  Auth,
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVJ76vO0YNHlGwCtvkKfDe5rWLxFiIzgA",
  authDomain: "ytpa-f7aca.firebaseapp.com",
  projectId: "ytpa-f7aca",
  storageBucket: "ytpa-f7aca.firebasestorage.app",
  messagingSenderId: "374268704603",
  appId: "1:374268704603:web:646ec6a00d2b5d45968c7e",
  measurementId: "G-860EZ6JGNF",
};

type DbUserData = {
  allFavorites: string[];
};

/** Status of a suggestion set by admins: it is discarded or has a priority
 * from 1 to 3 (3 is the highest). Suggestions without status are new.
 */
export type SuggestionStatus = "discarded" | 1 | 2 | 3;

/** Reads the status from a document (also understands the old "priority"). */
const readStatus = (data: any): SuggestionStatus | undefined => {
  if (data.status === "discarded") {
    return "discarded";
  }
  const num = data.status ?? data.priority;
  if (typeof num === "number") {
    return Math.min(3, Math.max(1, Math.round(num))) as 1 | 2 | 3;
  }
  return undefined;
};

/** A song suggestion as stored in the "suggestions" collection. */
export type Suggestion = {
  id: string;
  name: string;
  artist: string;
  videoUrl: string; // YouTube video id
  email?: string;
  createdAt?: { toMillis: () => number };
  status?: SuggestionStatus; // undefined: new
};

/** Result of a login or registration. `error` and `info` are keys of the
 * translations, `detail` is the technical reason of an unexpected error.
 */
export type AuthResult = { error?: string; info?: string; detail?: string };

// Only the errors a user can do something about have their own message, all
// others get the generic one with the code of the error as detail.
const authErrorKeys: { [code: string]: string } = {
  "auth/invalid-credential": "authInvalidCredential",
  "auth/invalid-login-credentials": "authInvalidCredential",
  "auth/wrong-password": "authInvalidCredential",
  "auth/user-not-found": "authInvalidCredential",
  "auth/invalid-email": "invalidEmail",
  "auth/email-already-in-use": "authEmailInUse",
};

const authError = (error: any, fallbackKey: string): AuthResult => {
  const code: string | undefined = error?.code;
  const key = code ? authErrorKeys[code] : undefined;
  if (key) {
    return { error: key };
  }
  return { error: fallbackKey, detail: code ?? String(error) };
};

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

  getUserEmail() {
    return firebaseManager.currentUser()?.email;
  }

  getUserName() {
    const email = this.getUserEmail() ?? "@";
    return email.split("@")[0];
  }

  getAuth() {
    return this.firebaseAuth;
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.firebaseAuth, email);
      return true;
    } catch (err: any) {
      console.error(err);
      return false;
    }
  }

  async signOut() {
    try {
      await signOut(this.firebaseAuth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  /** Sign-in a user by email and password. */
  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password,
      );

      // Check that email is verified
      const user = userCredential.user;
      if (!user.emailVerified) {
        return { error: "authEmailNotVerified" };
      }
    } catch (error) {
      return authError(error, "authFailed");
    }
    return { info: "authSignedIn" };
  }

  /** Log in with a Google account, a new user is created at the first login.
   *
   * Google accounts have a verified email address.
   */
  async signInWithGoogle(): Promise<AuthResult> {
    try {
      await signInWithPopup(this.firebaseAuth, new GoogleAuthProvider());
    } catch (error: any) {
      // Closing the popup is no error
      const ignored = [
        "auth/popup-closed-by-user",
        "auth/cancelled-popup-request",
      ];
      if (ignored.includes(error?.code)) {
        return {};
      }
      return authError(error, "authFailed");
    }
    return { info: "authSignedIn" };
  }

  /** Create user account using email and password. */
  async signUp(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.firebaseAuth,
        email,
        password,
      );

      // Send verification email
      const user = userCredential.user;
      await sendEmailVerification(user);
      console.log(`Success: Created user ${user.uid}!`);
      return { info: "authAccountCreated" };
    } catch (error) {
      return authError(error, "authFailed");
    }
  }

  /** Returns all suggested songs in a list. */
  async getSongSuggestions() {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestoreDb, "suggestions"),
      );
      const all = querySnapshot.docs.map((el) => {
        const data = el.data();
        return { id: el.id, ...data, status: readStatus(data) } as Suggestion;
      });
      return all;
    } catch (err) {
      console.log(err);
      return [];
    }
  }

  async addSongSuggestion(
    name: string,
    artist: string,
    videoUrl: string,
    email: string,
  ) {
    try {
      await addDoc(collection(this.firestoreDb, "suggestions"), {
        name,
        artist,
        videoUrl,
        email,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /** Whether the current user is an admin, i.e. has a doc in "admins". */
  async isAdmin() {
    const user = this.currentUser();
    if (!user?.emailVerified) {
      return false;
    }
    try {
      const adminDoc = await getDoc(doc(this.firestoreDb, "admins", user.uid));
      return adminDoc.exists();
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /** Changes title, artist, video and status of a suggestion (admins only). */
  async updateSuggestion(
    id: string,
    edit: {
      name: string;
      artist: string;
      videoUrl: string;
      status: SuggestionStatus | undefined;
    },
  ) {
    try {
      const { status, ...rest } = edit;
      await updateDoc(doc(this.firestoreDb, "suggestions", id), {
        ...rest,
        status: status === undefined ? deleteField() : status,
        priority: deleteField(), // old name of the field
      });
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  /** Deletes a suggestion (admins only). */
  async deleteSuggestion(id: string) {
    try {
      await deleteDoc(doc(this.firestoreDb, "suggestions", id));
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async addFavorite(scoreId: string) {
    const userDocRef = this.getUserDoc();
    const loadedDoc = await getDoc(userDocRef);

    if (loadedDoc.exists()) {
      const data = loadedDoc.data() as DbUserData;
      const currentList = data.allFavorites || [];
      const updatedList = Array.from(new Set([...currentList, scoreId])); // No duplicates
      const updatedData: DbUserData = { allFavorites: updatedList };
      await updateDoc(userDocRef, updatedData);
    } else {
      console.log("creating new");
      const newData: DbUserData = { allFavorites: [scoreId] };
      await setDoc(userDocRef, newData);
    }
  }

  /** Adds several favorites at once (no duplicates), e.g. for the import.
   *
   * Returns how many were new and how many already were favorites.
   */
  async addFavorites(scoreIds: string[]) {
    const userDocRef = this.getUserDoc();
    const loadedDoc = await getDoc(userDocRef);
    const currentList: string[] = loadedDoc.exists()
      ? ((loadedDoc.data() as DbUserData).allFavorites ?? [])
      : [];
    const existing = new Set(currentList);
    const newIds = Array.from(new Set(scoreIds)).filter((id) => !existing.has(id));
    if (newIds.length > 0) {
      const updatedData: DbUserData = {
        allFavorites: [...currentList, ...newIds],
      };
      if (loadedDoc.exists()) {
        await updateDoc(userDocRef, updatedData);
      } else {
        await setDoc(userDocRef, updatedData);
      }
    }
    return {
      added: newIds.length,
      alreadyFavorites: new Set(scoreIds).size - newIds.length,
    };
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
    undefined,
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
  } else if (user === undefined && globalThis.window !== undefined) {
    console.log("Grabbing username from localstorage");
    const storedUsername = localStorage.getItem("username");
    if (storedUsername !== null) {
      userName = storedUsername;
    }
  }
  return userName;
};

/** Hook that tells if the current user is an admin.
 *
 * Undefined while it is not yet determined.
 */
export const useIsAdmin = (user: User | null | undefined) => {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (user === undefined) {
      return;
    }
    if (user === null) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    firebaseManager.isAdmin().then((res) => {
      if (!cancelled) {
        setIsAdmin(res);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return isAdmin;
};
