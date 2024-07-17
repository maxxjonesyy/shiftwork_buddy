import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { dropDownData } from "../../utils/ButtonData";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import renderAlert from "../../utils/renderAlert";

function CreateShift({ setShowModal }) {
  const { user } = useContext(UserContext);
  const [inputForm, setInputForm] = useState([]);

  function createRandomID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  inputForm.id = createRandomID();
  inputForm.checked = false;

  const docRef = doc(db, "users", user.uid, "shifts", inputForm.id);

  function handleStartFinish(key) {
    const inputValue = event.target.value.slice(0, 4);
    setInputForm({ ...inputForm, [key]: inputValue.toString() });
    event.target.value = inputValue;
  }

  function handleDropDown(key) {
    setInputForm({ ...inputForm, [key]: event.target.value });
  }

  function validateTime(startTime, finishTime) {
    const regex = new RegExp(/^([01][0-9]|2[0-3])([0-5][0-9])$/);
    if (regex.test(startTime) && regex.test(finishTime)) {
      return true;
    } else return false;
  }

  function handleSubmit() {
    const start = document.getElementById("start");
    const finish = document.getElementById("finish");
    const rate = document.getElementById("rate");

    if (
      inputForm.day &&
      inputForm.date &&
      inputForm.month &&
      validateTime(start.value, finish.value) &&
      rate.value !== ""
    ) {
      setDoc(docRef, inputForm);
      setShowModal(false);

      renderAlert("success", "Your shift has been created!");
    } else {
      renderAlert("warning", "Please fix your entry before submitting");
    }
  }

  return (
    <form
      id='shift-container'
      className='flex flex-col gap-5 h-full bg-white/60 rounded-lg p-5 mx-auto shadow-lg'>
      <select
        id='day'
        type='button'
        className='text-sm w-full rounded-md bg-white p-3 text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
        onChange={() => handleDropDown(event.target.id)}>
        <option>Select Day:</option>
        {dropDownData.days.map((day, index) => {
          return (
            <option value={day} key={index}>
              {day}
            </option>
          );
        })}
      </select>
      <select
        id='date'
        type='button'
        className='text-sm w-full rounded-md bg-white p-3 text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
        onChange={() => handleDropDown(event.target.id)}>
        <option>Select Date:</option>
        {dropDownData.dates.map((date, index) => {
          return (
            <option value={date} key={index}>
              {date}
            </option>
          );
        })}
      </select>
      <select
        id='month'
        type='button'
        className='text-sm w-full rounded-md bg-white p-3 text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
        onChange={() => handleDropDown(event.target.id)}>
        <option>Select Month:</option>
        {dropDownData.months.map((month, index) => {
          return (
            <option value={month} key={index}>
              {month}
            </option>
          );
        })}
      </select>

      <div className='flex flex-col gap-5 pt-5 w-full'>
        <input
          id='start'
          type='number'
          className='border p-3 rounded-lg text-accentBlue italic text-sm w-full'
          placeholder='Start time: 1445'
          onChange={() => handleStartFinish(event.target.id)}
        />

        <input
          id='finish'
          type='number'
          className='border p-3 rounded-lg text-accentBlue italic text-sm w-full'
          placeholder='Finish time: 2300'
          onChange={() => handleStartFinish(event.target.id)}
        />

        <input
          id='rate'
          type='number'
          className='border p-3 rounded-lg text-accentBlue italic text-sm w-full'
          placeholder='Hourly Rate'
          onChange={() => handleStartFinish(event.target.id)}
        />
      </div>

      <button
        type='button'
        className='px-3 py-2 rounded-md bg-accentBlue text-white max-w-[150px]'
        onClick={handleSubmit}>
        Submit Shift
      </button>
    </form>
  );
}

export default CreateShift;
