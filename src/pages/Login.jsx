import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { doc, setDoc } from "firebase/firestore";
import AuthButton from "../components/AuthButton";
import Modal from "../components/Modal";
import HowDoesItWork from "../components/HowDoesItWork";

import {
  db,
  auth,
  signInWithPopup,
  googleProvider,
  githubProvider,
} from "/firebase";

function Login() {
  const [showModal, setShowModal] = useState(true);
  const { setUser } = useContext(UserContext);

  function createUser(serviceProvider) {
    signInWithPopup(auth, serviceProvider).then((result) => {
      const userData = {
        name: result.user.displayName,
        image: result.user.photoURL,
        uid: result.user.uid,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setDoc(doc(db, "users", userData.uid), userData, { merge: true });
    });
  }

  return (
    <div className='flex items-center justify-center h-screen text-center'>
      <div className='relative flex flex-col items-center justify-center w-full max-w-[500px] h-full max-h-[500px] rounded-md bg-backgroundWhite shadow-lg m-5'>
        <div className='absolute w-full h-full rotate-[6deg] rounded-md bg-accentBlue shadow-lg z-[-1]'></div>
        <h1 className='text-3xl font-semibold'>Shiftwork Buddy</h1>
        <p className='text-sm md:text-base pt-2'>
          A simple way to keep track of your hours and income.
        </p>

        <div className='flex flex-col mx-auto max-w-[300px] gap-5 mt-5'>
          <AuthButton
            provider='Google'
            onClick={() => createUser(googleProvider)}
          />

          <AuthButton
            provider='Github'
            onClick={() => createUser(githubProvider)}
          />
        </div>

        <span
          onClick={() => setShowModal(true)}
          className='absolute text-sm underline bottom-3 left-3 hover:cursor-pointer'>
          How does it work?
        </span>
      </div>

      {showModal && (
        <Modal
          title='How does it work?'
          component={<HowDoesItWork />}
          showModal={true}
          setShowModal={setShowModal}
        />
      )}
    </div>
  );
}

export default Login;
