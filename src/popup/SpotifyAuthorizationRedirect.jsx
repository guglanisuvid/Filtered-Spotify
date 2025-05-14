/* global chrome */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SpotifyAuthorizationRedirect = ({ handleUser, user }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    chrome.tabs.create({ url: import.meta.env.VITE_SPOTIFY_AUTHORIZATION_URL });
    handleUser("signout-request");
  };

  useEffect(() => {
    setInterval(() => {
      handleRedirect();
    }, 4000);
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="h-full w-full flex flex-col gap-4 justify-center items-center">
      <Navbar />
      <h1 className="text-3xl font-semibold text-center">
        Spotify Authorization
      </h1>
      <p className="text-text-200 text-lg">
        Please authorize the app to access your Spotify account.
      </p>
      <p className="text-text-200">
        Redirecting you to the Spotify authorization page in 4 seconds...
      </p>
      <p className="text-text-200">
        If you are not redirected automatically, please{" "}
        <button
          onClick={handleRedirect}
          className="underline underline-offset-4 text-text-100 cursor-pointer"
        >
          click here
        </button>
      </p>
    </div>
  );
};

export default SpotifyAuthorizationRedirect;
