import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import moment, { duration } from "moment/moment";

function ShiftsSummary() {
  const { shifts } = useContext(UserContext);

  let totalHours = 0;
  let grossIncome = 0;

  function getHours(start, finish) {
    let hours = 0;
    const startTime = moment(start, "hh:mm");
    const finishTime = moment(finish, "hh:mm");
    const hoursDiff = finishTime.diff(startTime, "hours");

    if (hoursDiff < 0) {
      hours = 24 + hoursDiff;
    } else {
      hours = hoursDiff - 0.25;
    }
    return hours;
  }

  function getPay(shift) {
    return getHours(shift.start, shift.finish) * shift.rate;
  }

  function getTax() {
    const yearlyIncome = grossIncome * 26;
    const taxFree = 18000;
    const lowBracket = ((Math.floor(45000 - 18201) / 26) * 19) / 100;
    const highBracket = (Math.floor((120000 - 45001) / 26) * 32.5) / 100;

    if (yearlyIncome < 18200) {
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
    } else {
      const thirtySevenCents =
        ((Math.floor(yearlyIncome - 120000) / 26) * 37) / 100;
      return Math.floor(lowBracket + highBracket + thirtySevenCents);
    }
  }

  shifts.forEach((shift) => {
    totalHours += getHours(shift.start, shift.finish);
    grossIncome += getPay(shift);
  });

  const style = {
    container: "py-10 lg:max-w-[75rem] mx-auto",
    h1: "font-semibold text-lg border-b border-gray-300 pb-2",
    innerContainer: "pt-5",
    netPay: "font-semibold text-[#6d66fa]",
  };

  return shifts.length > 0 ? (
    <div className={style.container}>
      <h1 className={style.h1}>Shift Summary:</h1>
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
