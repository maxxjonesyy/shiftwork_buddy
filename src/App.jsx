import { useState } from "react";
import { UserContext } from "./context/UserContext";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Shifts from "./pages/Shifts/Shifts";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [shifts, setShifts] = useState([]);

  return (
    <UserContext.Provider value={{ user, setUser, shifts, setShifts }}>
      {!user ? (
        <Login />
      ) : (
        <>
          <Navbar />
          <Routes>
            <Route path='/' element={<Shifts />} />
          </Routes>
        </>
      )}
    </UserContext.Provider>
  );
}

export default App;
