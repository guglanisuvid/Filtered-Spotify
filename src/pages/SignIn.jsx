/* global chrome */

import React from "react";

const SignIn = () => {
  const handleSignIn = async () => {
    await chrome.runtime.sendMessage({
      type: "auth-request",
      target: "background",
    });

    return true;
  };

  return (
    <div className="h-full w-full text-center flex flex-col gap-8 justify-center items-center p-4">
      <div className="flex flex-col gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Filtered Spotify</h1>
          <p className="text-sm text-text-200">By Loopverse</p>
        </div>
        <p className="text-text-200">
          Control your Spotify like never before. Filter by artist, date, and
          more — all inside your browser.
        </p>
      </div>
      <div>
        <button
          onClick={handleSignIn}
          className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
        >
          SignIn & Authorize Spotify
        </button>
      </div>
    </div>
  );
};

export default SignIn;
