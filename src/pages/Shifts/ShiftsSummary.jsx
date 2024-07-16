import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import moment from "moment/moment";

function ShiftsSummary() {
  const { user, shifts } = useContext(UserContext);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (user.cycle === "Weekly") {
      setCycle(52);
    } else if (user.cycle === "Fortnightly") {
      setCycle(26);
    } else {
      setCycle(12);
    }
  }, [user.cycle]);

  let totalHours = 0;
  let grossIncome = 0;

  function getHours(start, finish) {
    let hours = 0;
    const startTime = moment(start, "hh:mm");
    const finishTime = moment(finish, "hh:mm");
    const hoursDiff = finishTime.diff(startTime, "hours");

    if (hoursDiff < 0) {
      hours = hoursDiff + 24;
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
    let yearlyIncome = grossIncome * cycle;

    const taxFree = 18000;
    const lowBracket = ((Math.floor(45000 - 18201) / cycle) * 19) / 100;
    const highBracket = (Math.floor((120000 - 45001) / cycle) * 32.5) / 100;
    const higherBracket = (Math.floor((180000 - 120001) / cycle) * 37) / 100;

    if (yearlyIncome < 18200) {
      return null;
    } else if (yearlyIncome >= 18201 && yearlyIncome <= 45000) {
      const nineteenCents = Math.floor(
        (((yearlyIncome - taxFree) / cycle) * 19) / 100
      );
      return Math.floor(nineteenCents);
    } else if (yearlyIncome >= 45001 && yearlyIncome <= 120000) {
      return (
        Math.floor((((yearlyIncome - 45000) / cycle) * 32.5) / 100) +
        Math.floor(lowBracket)
      );
    } else if (yearlyIncome >= 120001 && yearlyIncome <= 180000) {
      const thirtySevenCents =
        ((Math.floor(yearlyIncome - 120000) / cycle) * 37) / 100;
      return Math.floor(lowBracket + highBracket + thirtySevenCents);
    } else {
      const fourtyFiveCents =
        ((Math.floor(yearlyIncome - 180000) / cycle) * 45) / 100;
      return Math.floor(
        lowBracket + highBracket + higherBracket + fourtyFiveCents
      );
    }
  }

  shifts.forEach((shift) => {
    totalHours += getHours(shift.start, shift.finish);
    grossIncome += getPay(shift);
  });

  return shifts.length > 0 ? (
    <div className='py-10 lg:max-w-[75rem] mx-auto'>
      <div className='flex w-full justify-between border-b border-gray-300 pb-2'>
        <h1 className='font-semibold text-lg'>Shift Summary:</h1>
        <select
          id='paycycle'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-[150px] md:w-[200px] p-2'
          onChange={() => setFrequency(event.target.value)}>
          <option className='hidden'>{user.cycle}</option>
          <option value='Weekly'>Weekly</option>
          <option value='Fortnightly'>Fortnightly</option>
          <option value='Monthly'>Monthly</option>
        </select>
      </div>
      <div className='pt-5'>
        <p>Total hours: {totalHours}</p>
        <p>Gross pay: ${grossIncome}</p>
        <p>Tax paid: {getTax() ? `-$${getTax()}` : `-$${0}`}</p>
        <p className='font-semibold text-[#6d66fa]'>
          Net pay: ${grossIncome - getTax()}
        </p>
      </div>
    </div>
  ) : null;
}

export default ShiftsSummary;
