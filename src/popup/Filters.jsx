/* global chrome */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FiltersContent from "../components/FiltersContent";
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
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center text-center overflow-hidden">
      <Navbar handleUser={handleUser} userName={user?.name} />
      <FiltersMessage msg={msg} />
      <div className="w-full flex-1 overflow-hidden">
        <FiltersContent setMsg={setMsg} />
      </div>
    </div>
  );
};

export default Filters;
