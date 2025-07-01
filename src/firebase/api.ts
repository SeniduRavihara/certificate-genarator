// import { signInWithPopup, signOut } from "firebase/auth";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { auth, db, provider } from "./config";

// export const logout = async () => {
//   try {
//     await signOut(auth);
//   } catch (error) {
//     console.log(error);
//     throw error;
//   }
// };

// ------------------------------------------------------------------

// export const googleSignIn = async () => {
//   try {
//     const userCredential = await signInWithPopup(auth, provider);
//     console.log(userCredential);

//     const user = userCredential.user;
//     const userDocRef = doc(db, "admins", user.uid);
//     const userDoc = await getDoc(userDocRef);

//     if (!userDoc.exists()) {
//       const payload = {
//         id: user.uid,
//         name: user.displayName || "",
//         email: user.email || "",
//         isAdmin: false,
//       };

//       await setDoc(userDocRef, payload);
//     }

//     return user;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };
