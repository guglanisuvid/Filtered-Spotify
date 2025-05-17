/* global chrome */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FiltersContent from "../components/FiltersContent";
import { SpotifyTokenRefreshPort } from "../popupUtilities/SpotifyTokenRefreshPort";
import FiltersMessage from "../components/FiltersMessage";

const Filters = ({ handleUser, user }) => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const port = chrome.runtime.connect({
      name: "spotify-token-request",
    });

    port.onMessage.addListener((message) => {
      if (message.type === "user-data-not-available") {
        setMsg(
          "User date not available. Please Sign in again. Signing Out in 4 seconds..."
        );
        setInterval(async () => {
          await chrome.runtime.sendMessage({
            type: "user-signout-request",
          });
          handleUser();
        }, 4000);
      } else if (message.type === "spotify-not-authorized") {
        navigate("/spotifyAuthorizationRedirect");
      } else if (message.type === "spotify-token-expired") {
        setMsg("Spotify token expired. Trying to refresh spotify token...");
        SpotifyTokenRefreshPort();
      }
    });

    return () => {
      port.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    setInterval(() => {
      setMsg("");
    }, 4000);
  }, [msg]);

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center text-center">
      <Navbar handleUser={handleUser} userName={user?.name} />
      <FiltersMessage msg={msg} />
      <div className="w-full flex-1">
        <FiltersContent setMsg={setMsg} />
      </div>
    </div>
  );
};

export default Filters;
