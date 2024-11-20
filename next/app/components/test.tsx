"use client";
import firebaseManager from "@/app/firebase";
import { useEffect } from "react";

async function task() {
  const email = "test@test.com";
  const password = "bad_password";

  let user = await firebaseManager.signUp(email, password);
  if (user === null) {
    user = await firebaseManager.signIn(email, password);
  }

  if (user === null) {
    // No user available!
    console.log("Authentication and sign-up failed!");
    return;
  }

  const userData = {
    first: "Ada",
    last: "Lovelace",
    email: email,
  };
  const error = await firebaseManager.storeUserDoc(user.uid, userData);
  if (error) {
    console.log(error);
  }
}

export const TestComp = () => {
  useEffect(() => {
    task();
  });
  return <div></div>;
};
