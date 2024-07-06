import { doc, setDoc, deleteDoc } from "firebase/firestore";
import api from "./api";

import {
  db,
  auth,
  signInWithPopup,
  googleProvider,
  githubProvider,
} from "../../../firebase";
import renderAlert from "../renderAlert";

class profile {
  static async create(provider, setUser) {
    try {
      switch (provider) {
        case "Google":
          provider = googleProvider;
          break;
        case "Github":
          provider = githubProvider;
          break;
        default:
          throw new Error("Invalid provider");
      }

      const result = await signInWithPopup(auth, provider);

      const userData = {
        name: result.user.displayName,
        image: result.user.photoURL,
        uid: result.user.uid,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      await setDoc(doc(db, "users", userData.uid), userData, { merge: true });
    } catch (error) {
      console.log("Error creating user:", error);
      renderAlert("error", "Error logging in");
    }
  }

  static async delete(shifts, user, setUser) {
    try {
      await api.deleteAllShifts(user, shifts);
      await deleteDoc(doc(db, "users", user.uid));
      profile.logout(setUser);
    } catch (error) {
      console.log(error);
      renderAlert("error", "Error deleting user");
    }
  }

  static logout(setUser) {
    localStorage.removeItem("user");
    setUser(null);
    if (auth.currentUser) {
      auth.signOut();
    }

    renderAlert("success", "Logged out");
  }
}

export default profile;
