import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import api from "../../utils/services/api";
import Modal from "../../components/Modal";

import CreateShift from "./CreateShift";
import ShiftsSummary from "./ShiftsSummary";
import Loader from "../../components/Loader";
import closeIcon from "../../assets/icons/close-icon.svg";
import collapseIcon from "../../assets/icons/collapse-icon.svg";

function Shifts() {
  const { user, setUser, shifts, setShifts } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
    const doneShifts = [];
    const currentShifts = [];

    shifts.forEach((shift) => {
      const now = new Date();
      const shiftDate = new Date(shift.convertedDate);
      const diffInDays = (shiftDate - now) / (1000 * 60 * 60 * 24);

      if (shift.checked || diffInDays <= -1) {
        doneShifts.push(shift);
      } else {
        currentShifts.push(shift);
      }
    });

    return { doneShifts, currentShifts };
  };

  const { doneShifts, currentShifts } = categorizeShifts(shifts);

  const toggleCollapse = (task) => {
    document.getElementById("collapse-icon").classList.toggle("rotate-90");
    document.getElementById(`${task}-shifts`).classList.toggle("hidden");
  };

  return loading ? (
    <Loader />
  ) : (
    <div className='relative p-5 h-full'>
      <div className='mx-auto lg:max-w-[75rem]'>
        <div className='flex flex-col md:flex-row md:justify-between gap-5 mt-5'>
          <h2 className='text-xl font-semibold'>
            {shifts.length > 0 ? "Your shifts" : "No shifts found"}
          </h2>

          <div className='flex items-center gap-3'>
            <button
              onClick={() => setShowModal(true)}
              className='px-4 py-2 text-sm text-white rounded-md transition-colors duration-300 bg-primaryBlue hover:bg-accentBlue'>
              Create Shift
            </button>

            <button
              className='px-4 py-2 text-sm text-white rounded-md transition-colors duration-300 bg-primaryBlue hover:bg-accentBlue'
              onClick={() => api.deleteAllShifts(user, shifts)}>
              Delete All
            </button>
          </div>
        </div>

        {doneShifts.length > 0 && (
          <ul
            className='mt-5 overflow-hidden rounded-md shadow-md bg-green-500/60'
            onClick={() => toggleCollapse("completed")}>
            <div className='flex items-center justify-between p-4'>
              <h2 className='font-semibold'>Completed Shifts:</h2>
              <img
                id='collapse-icon'
                className='transition-all'
                src={collapseIcon}
                alt='collapse icon'
                width={25}
              />
            </div>

            <div id='completed-shifts' className='hidden p-5'>
              {doneShifts.map((shift, index) => {
                return (
                  <li className='shift--done' key={index} id={`ul-${index}`}>
                    <input
                      type='checkbox'
                      checked={true}
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

        {currentShifts?.length > 0 && (
          <ul className='mt-5'>
            {currentShifts.map((shift, index) => {
              return (
                <li className='shift--unchecked' key={index} id={`ul-${index}`}>
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
      </div>

      {showModal && (
        <Modal
          title='Create Shift'
          component={<CreateShift setShowModal={setShowModal} />}
          showModal={true}
          setShowModal={setShowModal}
        />
      )}
      <ShiftsSummary />
    </div>
  );
}

export default Shifts;
