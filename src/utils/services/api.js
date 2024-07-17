import { db } from "../../../firebase";
import {
  setDoc,
  deleteDoc,
  doc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { monthKey } from "../ButtonData";
import renderAlert from "../renderAlert";
import warningAlert from "../warningAlert";

class api {
  static async getShifts(user, setUser, setShifts) {
    try {
      const shiftColRef = collection(db, `users/${user.uid}/shifts`);
      const userRef = doc(db, "users", user.uid);

      onSnapshot(shiftColRef, (snapshot) => {
        setShifts(snapshot.docs.map((doc) => doc.data()));
      });

      onSnapshot(userRef, (snapshot) => {
        setUser(snapshot.data());
      });
    } catch (error) {
      console.error("Error fetching shifts: ", error);
      renderAlert("error", "Error fetching shifts");
    }
  }

  static async deleteShift(user, shift) {
    const docRef = doc(db, "users", user.uid, "shifts", shift.id);

    warningAlert(
      "Are you sure you want to delete this shift?",
      "warning",
      async () => {
        try {
          await deleteDoc(docRef);
          renderAlert("success", "Shift deleted successfully");
        } catch (error) {
          console.error("Error deleting shift: ", error);
          renderAlert("error", "Error deleting shift");
        }
      }
    );
  }

  static async deleteAllShifts(user, shifts) {
    warningAlert("You are about to delete ALL shifts", "info", async () => {
      try {
        const deletePromises = shifts.map((shift) => {
          const docRef = doc(db, "users", user.uid, "shifts", shift.id);
          return deleteDoc(docRef);
        });
        await Promise.all(deletePromises);
        renderAlert("success", "All shifts deleted successfully");
      } catch (error) {
        console.error("Error deleting all shifts: ", error);
        renderAlert("error", "Error deleting all shifts");
      }
    });
  }

  static convertDates(shifts) {
    return shifts.map((shift) => {
      const date = Number(shift.date.slice(0, -2));
      const month = monthKey[shift.month];
      const year = new Date().getFullYear();
      shift.convertedDate = new Date(year, month, date);
      return shift;
    });
  }

  static async setChecked(user, shift) {
    const docRef = doc(db, "users", user.uid, "shifts", shift.id);
    try {
      await setDoc(docRef, { checked: !shift.checked }, { merge: true });
    } catch (error) {
      console.error("Error updating shift: ", error);
      renderAlert("error", "Error updating shift");
    }
  }
}

export default api;
