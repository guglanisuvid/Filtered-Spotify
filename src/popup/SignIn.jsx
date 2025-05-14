/* global chrome */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = ({ handleUser, user }) => {
  const navigate = useNavigate();

  const handleSignInClick = async () => {
    const res = await chrome.runtime.sendMessage({
      type: "user-signin-request",
    });
    if (res?.type === "signin-success") {
      handleUser();
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/filters");
    }
  }, [user]);

  return (
    <div className="h-full w-full text-center flex flex-col gap-8 justify-center items-center p-4">
      <div className="flex flex-col gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Filtered Spotify</h1>
          <p className="text-sm text-text-200">
            A Chrome Extension by Loopverse
          </p>
        </div>
        <p className="text-text-200">
          Control your Spotify like never before. Filter by artist, date, and
          more — all inside your browser.
        </p>
      </div>
      <div>
        <button
          onClick={handleSignInClick}
          className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
        >
          SignIn & Authorize Spotify
        </button>
      </div>
    </div>
  );
};

export default SignIn;
