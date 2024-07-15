import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import api from "../../utils/services/api";

import CreateShift from "./CreateShift";
import ShiftsSummary from "./ShiftsSummary";
import Loader from "../../components/Loader";
import closeIcon from "../../assets/icons/close-icon.svg";
import collapseIcon from "../../assets/icons/collapse-icon.svg";

function Shifts() {
  const { user, setUser, shifts, setShifts } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const createShiftRef = useRef();

  useEffect(() => {
    if (user.uid) {
      setLoading(true);
      api.getShifts(user, setUser, (fetchedShifts) => {
        const convertedShifts = api
          .convertDates(fetchedShifts)
          .sort((a, b) => a.convertedDate - b.convertedDate);

        setShifts(convertedShifts);
      });

      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, []);

  const categorizeShifts = (shifts) => {
    const oldShifts = [];
    const nowShifts = [];
    const farShifts = [];

    shifts.forEach((shift) => {
      const now = new Date();
      const shiftDate = new Date(shift.convertedDate);
      const diffInDays = (shiftDate - now) / (1000 * 60 * 60 * 24);

      if (shift.checked) {
        oldShifts.push(shift);
      } else if (diffInDays > 7) {
        farShifts.push(shift);
      } else {
        nowShifts.push(shift);
      }
    });

    return { oldShifts, nowShifts, farShifts };
  };

  const { oldShifts, nowShifts, farShifts } = categorizeShifts(shifts);

  const toggleCollapse = (task) => {
    document.getElementById("collapse-icon").classList.toggle("rotate-90");
    document.getElementById(`${task}-shifts`).classList.toggle("hidden");
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='relative p-5 h-full'>
      <div className='mx-auto lg:max-w-[75rem]'>
        <div className='flex items-center justify-between mt-5'>
          <h2 className='text-xl font-semibold'>
            {shifts.length > 0
              ? "Current Shifts"
              : "You have no current shifts"}
          </h2>
          <div className='flex flex-col md:flex-row'>
            <button
              ref={createShiftRef}
              className='w-32 p-1 text-base text-white rounded-md bg-primaryBlue'>
              Create Shift
            </button>

            <button
              className='w-32 p-1 text-base text-white rounded-md  mt-3 bg-primaryBlue md:ml-5 md:mt-0'
              onClick={() => api.deleteAllShifts(user, shifts)}>
              Delete All
            </button>
          </div>
        </div>

        {oldShifts?.length > 0 && (
          <ul
            className='mt-5 overflow-hidden border border-green-200 rounded-md'
            onClick={() => toggleCollapse("completed")}>
            <div className='flex items-center justify-between p-5 bg-green-100 rounded-md'>
              <h2 className='font-semibold'>Completed Shifts:</h2>
              <img
                id='collapse-icon'
                className='transition-all'
                src={collapseIcon}
                alt='collapse icon'
                width={25}
              />
            </div>

            <div id='completed-shifts' className='hidden'>
              {oldShifts.map((shift, index) => {
                return (
                  <li
                    className={
                      shift.checked ? "shift--checked" : "shift--unchecked"
                    }
                    key={index}
                    id={`ul-${index}`}>
                    <input
                      type='checkbox'
                      checked={shift.checked ? true : false}
                      className='w-5 h-5 accent-[#3f3d55]'
                      onChange={() => api.setChecked(user, shift)}
                    />
                    <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                      {shift.day} {shift.date} {shift.month}
                    </span>
                    <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                      {shift.start} - {shift.finish}
                    </span>
                    <img
                      src={closeIcon}
                      alt='delete icon'
                      className='w-5 hover:cursor-pointer'
                      onClick={() => api.deleteShift(user, shift)}
                    />
                  </li>
                );
              })}
            </div>
          </ul>
        )}

        {nowShifts?.length > 0 && (
          <ul className='mt-5'>
            {nowShifts.map((shift, index) => {
              return (
                <li
                  className={
                    shift.checked ? "shift--checked" : "shift--unchecked"
                  }
                  key={index}
                  id={`ul-${index}`}>
                  <input
                    type='checkbox'
                    checked={shift.checked ? true : false}
                    className='w-5 h-5 accent-[#3f3d55]'
                    onChange={() => api.setChecked(user, shift)}
                  />
                  <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                    {shift.day} {shift.date} {shift.month}
                  </span>
                  <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                    {shift.start} - {shift.finish}
                  </span>
                  <img
                    src={closeIcon}
                    alt='delete icon'
                    className='w-5 hover:cursor-pointer'
                    onClick={() => api.deleteShift(user, shift)}
                  />
                </li>
              );
            })}
          </ul>
        )}

        {farShifts?.length > 0 && (
          <ul
            className='mt-5 overflow-hidden border border-orange-200 rounded-md'
            onClick={() => toggleCollapse("upcoming")}>
            <div className='flex items-center justify-between p-5 bg-orange-100 rounded-md'>
              <h2 className='font-semibold'>Upcoming Shifts:</h2>
              <img
                id='collapse-icon'
                className='transition-all'
                src={collapseIcon}
                alt='collapse icon'
                width={25}
              />
            </div>

            <div id='upcoming-shifts' className='hidden'>
              {farShifts.map((shift, index) => {
                return (
                  <li
                    className={
                      shift.checked ? "shift--checked" : "shift--unchecked"
                    }
                    key={index}
                    id={` -${index}`}>
                    <input
                      type='checkbox'
                      checked={shift.checked ? true : false}
                      className='w-5 h-5 accent-[#3f3d55]'
                      onChange={() => api.setChecked(user, shift)}
                    />
                    <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                      {shift.day} {shift.date} {shift.month}
                    </span>
                    <span className='text-sm md:text-base w-1/2 text-left ml-12'>
                      {shift.start} - {shift.finish}
                    </span>
                    <img
                      src={closeIcon}
                      alt='delete icon'
                      className='w-5 hover:cursor-pointer'
                      onClick={() => api.deleteShift(user, shift)}
                    />
                  </li>
                );
              })}
            </div>
          </ul>
        )}
      </div>

      <ShiftsSummary />
      <CreateShift createShiftRef={createShiftRef} />
    </div>
  );
}

export default Shifts;
