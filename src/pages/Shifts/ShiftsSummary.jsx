import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment/moment";

function ShiftsSummary() {
  const { shifts } = useContext(UserContext);

  let totalHours = 0;
  let grossIncome = 0;

  function getHours(start, finish) {
    let hours = 0;
    const startTime = moment(start, "hh:mm");
    const finishTime = moment(finish, "hh:mm");
    const hoursDiff = finishTime.diff(startTime, "hours");
  let totalHours = 0;
  let grossIncome = 0;

  function getHours(start, finish) {
    let hours = 0;
    const startTime = moment(start, "hh:mm");
    const finishTime = moment(finish, "hh:mm");
    const hoursDiff = finishTime.diff(startTime, "hours");

    if (hoursDiff < 0) {
      hours = hoursDiff + 24 - 0.5;
    } else {
      hours = hoursDiff - 0.25;
    }
    return hours;
  }

  function getPay(shift) {
    return getHours(shift.start, shift.finish) * shift.rate;
  }

  function setFrequency(input) {
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, { cycle: input }, { merge: true });
  }

  function getTax() {
    let yearlyIncome = 0;

    if (user.cycle === "weekly") {
      yearlyIncome = grossIncome * 52;
    } else if (user.cycle === "fortnightly") {
      yearlyIncome = grossIncome * 26;
    } else {
      yearlyIncome = grossIncome * 12;
    }

    const taxFree = 18000;
    const lowBracket = ((Math.floor(45000 - 18201) / 26) * 19) / 100;
    const highBracket = (Math.floor((120000 - 45001) / 26) * 32.5) / 100;

    if (yearlyIncome < 18200) {
      return null;
      return null;
    } else if (yearlyIncome >= 18201 && yearlyIncome <= 45000) {
      const nineteenCents = Math.floor(
        (((yearlyIncome - taxFree) / 26) * 19) / 100
      );
      return Math.floor(nineteenCents);
    } else if (yearlyIncome >= 45001 && yearlyIncome <= 120000) {
      const thirtyTwoCents = Math.floor(
        (((yearlyIncome - 45000) / 26) * 32.5) / 100
      );
      return Math.floor(lowBracket + thirtyTwoCents);
    } else if (yearlyIncome >= 120001 && yearlyIncome <= 180000) {
      const thirtySevenCents =
        ((Math.floor(yearlyIncome - 120000) / 26) * 37) / 100;
      return Math.floor(lowBracket + highBracket + thirtySevenCents);
    } 
  }

  shifts.forEach((shift) => {
    totalHours += getHours(shift.start, shift.finish);
    grossIncome += getPay(shift);
  });
  shifts.forEach((shift) => {
    totalHours += getHours(shift.start, shift.finish);
    grossIncome += getPay(shift);
  });

  const style = {
    container: "py-10 lg:max-w-[75rem] mx-auto",
    h1: "font-semibold text-lg ",
    innerContainer: "pt-5",
    netPay: "font-semibold text-[#6d66fa]",
    cycle:
      "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[150px] md:w-[200px] p-2",
    headingContaner:
      "flex w-full justify-between border-b border-gray-300 pb-2",
  };

  return shifts.length > 0 ? (
    <div className={style.container}>
      <div className={style.headingContaner}>
        <h1 className={style.h1}>Shift Summary:</h1>
        <select
          id='paycycle'
          className={style.cycle}
          onChange={() => setFrequency(event.target.value)}
        >
          <option>Selected: {user.cycle}</option>
          <option value='weekly'>Weekly</option>
          <option value='fortnightly'>Fortnightly</option>
          <option value='monthly'>Monthly</option>
        </select>
      </div>
      <div className={style.innerContainer}>
        <p>Total hours: {totalHours}</p>
        <p>Gross pay: ${grossIncome}</p>
        <p>Tax paid: {getTax() ? `-$${getTax()}` : `-$${0}`}</p>
        <p className={style.netPay}>Net pay: ${grossIncome - getTax()}</p>
      </div>
    </div>
  ) : null;
}

export default ShiftsSummary;
