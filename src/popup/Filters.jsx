/* global chrome */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import FiltersContent from "../components/FiltersContent";

const Filters = ({ handleUser, user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const port = chrome.runtime.connect({
      name: "spotify-token-request",
    });

    port.onMessage.addListener((message) => {
      if (message.type === "user-data-not-available") {
        // display a message about user data not accessible and signs out the user
      } else if (message.type === "spotify-not-authorized") {
        navigate("/spotifyAuthorizationRedirect");
      } else if (message.type === "spotify-token-expired") {
        const port = chrome.runtime.connect({
          name: "spotify-token-refresh-request",
        });

        port.onMessage.addListener((message) => {
          if (message.type === "user-data-not-available") {
            // display a message about user data not accessible and signs out the user
          }
        });

        return () => {
          port.disconnect();
        };
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

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-between items-center text-center">
      <Navbar handleUser={handleUser} userName={user?.name} />
      <div className="flex-1">
        <FiltersContent />
      </div>
    </div>
  );
};

export default Filters;
