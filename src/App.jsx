/* global chrome */

import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Filters from "./pages/Filters";

const App = () => {
  const [user, setUser] = useState();

  const handleUser = (name) => {
    const port = chrome.runtime.connect({
      name: name,
    });

    port.onMessage.addListener((message) => {
      if (message.type === "user-data") {
        setUser(message?.user);
        console.log(message);
      }
    });

    return () => {
      port.disconnect();
    };
  };

  useEffect(() => {
    handleUser("user-request");
  }, []);

  return (
    <div className="font-primary bg-bg-100 text-text-100 w-[320px] h-[480px] border-2">
      <Routes>
        <Route path="/" element={<SignIn user={user} />} />
        <Route
          path="/filters"
          element={<Filters handleUser={handleUser} user={user} />}
        />
      </Routes>
    </div>
  );
};

export default App;
