import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { dropDownData } from "../../utils/ButtonData";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Swal from "sweetalert2";
import closeIcon from "../../assets/icons/close-icon.svg";

function CreateShift({ createShiftRef }) {
  const { user } = useContext(UserContext);
  const [inputForm, setInputForm] = useState([]);

  function createRandomID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  inputForm.id = createRandomID();
  inputForm.checked = false;

  const docRef = doc(db, "users", user.uid, "shifts", inputForm.id);

  document.addEventListener("click", (event) => {
    if (event.target === createShiftRef.current) {
      document.getElementById("shift-container").classList.remove("hidden");
    }
  });

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

  function resetInputs() {
    day.value = "Select Day:";
    date.value = "Select Date:";
    month.value = "Select Month:";
    start.value = "";
    finish.value = "";
    rate.value = "";
  }

  function handleSubmit() {
    const start = document.getElementById("start");
    const finish = document.getElementById("finish");
    const rate = document.getElementById("rate");
    const container = document.getElementById("shift-container");

    if (
      inputForm.day &&
      inputForm.date &&
      inputForm.month &&
      validateTime(start.value, finish.value) &&
      rate.value !== ""
    ) {
      setDoc(docRef, inputForm);
      resetInputs();
      container.classList.add("hidden");
      Swal.fire({ text: "Your shift has been created!", icon: "success" });
    } else {
      Swal.fire({
        text: `Please fix your entry before submitting`,
        icon: "warning",
        confirmButtonColor: "#6d66fa",
      });
    }
  }

  const style = {
    container: "hidden fixed w-full h-full top-0 left-0",
    form: "flex flex-col items-center justify-center gap-5 h-full max-w-[900px] bg-white rounded-lg p-5 mx-auto shadow-lg",
    topDiv:
      "flex items-center justify-between my-5 w-full bg-accentBlue p-3 rounded-md text-white max-w-[500px]",
    h1: "font-semibold text-xl md:text-2xl",
    image: "hover:cursor-pointer w-5 md:w-7",
    selectContainer: "flex flex-col items-center gap-5 w-full max-w-[500px]",
    dropdownButton:
      "w-full h-[50px] rounded-md bg-white px-3 py-2 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50",
    inputContainer: "flex flex-col gap-5 pt-5 w-full max-w-[500px]",
    input:
      "border p-3 rounded-lg text-accentBlue italic text-sm font-semibold w-full",
    button:
      "border font-semibold p-2 rounded-md bg-accentBlue text-white w-[150px] mb-5 mt-5 w-2/3",
    screen: "absolute h-screen w-screen bg-black opacity-50 z-[-10]",
  };

  return (
    <div id='shift-container' className={style.container}>
      <form className={style.form}>
        <div className={style.topDiv}>
          <h1 className={style.h1}>Create Shift</h1>
          <img
            src={closeIcon}
            alt='close menu'
            className={style.image}
            onClick={() => {
              document
                .getElementById("shift-container")
                .classList.add("hidden");
            }}
          />
        </div>

        <div className={style.selectContainer}>
          <select
            id='day'
            type='button'
            className={style.dropdownButton}
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
            className={style.dropdownButton}
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
            className={style.dropdownButton}
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
        </div>

        <div className={style.inputContainer}>
          <input
            id='start'
            type='number'
            className={style.input}
            placeholder='Start time: 1445'
            onChange={() => handleStartFinish(event.target.id)}
          />

          <input
            id='finish'
            type='number'
            className={style.input}
            placeholder='Finish time: 2300'
            onChange={() => handleStartFinish(event.target.id)}
          />

          <input
            id='rate'
            type='number'
            className={style.input}
            placeholder='Hourly Rate'
            onChange={() => handleStartFinish(event.target.id)}
          />
        </div>

        <button type='button' className={style.button} onClick={handleSubmit}>
          Submit Shift
        </button>
        <div className={style.screen}></div>
      </form>
    </div>
  );
}

export default CreateShift;
