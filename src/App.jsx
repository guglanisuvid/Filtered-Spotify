/* global chrome */
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Filters from "./pages/Filters";
import Dashboard from "./pages/Dashboard";
import SpotifyAuthorizationRedirect from "./pages/SpotifyAuthorizationRedirect";

const App = () => {
  const [user, setUser] = useState();

  const handleUser = () => {
    const port = chrome.runtime.connect({
      name: "user-data-request",
    });

    port.onMessage.addListener((message) => {
      if (message.type === "user-data") {
        setUser(message.user);
      }
    });

    return () => {
      port.disconnect();
    };
  };

  useEffect(() => {
    handleUser();
  }, []);

  return (
    <div className="font-primary bg-bg-100 text-text-100 h-[560px] w-[560px] border-2">
      <Routes>
        <Route
          path="/"
          element={<SignIn handleUser={handleUser} user={user} />}
        />
        <Route
          path="/filters"
          element={<Filters handleUser={handleUser} user={user} />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard handleUser={handleUser} user={user} />}
        />
        <Route
          path="/spotifyAuthorizationRedirect"
          element={
            <SpotifyAuthorizationRedirect handleUser={handleUser} user={user} />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
