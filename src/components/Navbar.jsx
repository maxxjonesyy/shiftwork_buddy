import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import HowDoesItWork from "./HowDoesItWork";
import NavSettings from "./NavSettings";
import profile from "../utils/services/profile";

function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <nav className='bg-backgroundWhite shadow-sm'>
      <div className='relative flex items-center justify-between px-5 py-3 lg:max-w-[75rem] lg:mx-auto xl:px-0'>
        <h1 className='text-2xl font-semibold'>Shiftwork Buddy</h1>

        <div className='relative flex items-center gap-2'>
          <ul className='p-3 md:flex'>
            <li className='hidden items-center gap-2 md:flex'>
              <button
                className='nav-link'
                onClick={() => profile.logout(setUser)}>
                Logout
              </button>
            </li>
          </ul>

          <div>
            <img
              src='/icons/hamburger-icon.svg'
              alt='menu toggle'
              className='relative w-7 hover:cursor-pointer md:hidden'
              onMouseEnter={() => setShowSettings(true)}
            />

            {showSettings && (
              <NavSettings
                setShowModal={setShowModal}
                setShowSettings={setShowSettings}
                logoutUser={() => profile.logout(setUser)}
              />
            )}
          </div>

          <img
            src={user.image}
            alt='user'
            className='w-10 rounded-full hover:cursor-pointer'
            onClick={() => profile.logout(setUser)}
          />
        </div>
      </div>

      {showModal && (
        <Modal
          title='How Does It Work?'
          component={<HowDoesItWork />}
          showModal={showModal}
          setShowModal={setShowModal}
        />
      )}
    </nav>
  );
}

export default Navbar;
