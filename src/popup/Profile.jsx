/* global chrome */
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { SpotifyTokenRefreshMessage } from "../popupUtilities/SpotifyTokenRefreshMessage";
import { useNavigate } from "react-router-dom";

const Profile = ({ handleUser, user }) => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await chrome.runtime.sendMessage({
          type: "spotify-profile-search-request",
        });

        if (res?.error && res?.type === "spotify-profile-search-failed") {
          if (res?.reason === "spotify-token-not-valid") {
            setMsg("Spotify token not valid. Refreshing spotify token...");
            const response = await SpotifyTokenRefreshMessage();
            if (response?.error) {
              if (response?.reason === "token-refresh-failed") {
                setMsg("Failed to refresh tokens. Please try again...");
              } else if (response?.reason === "user-data-not-fetched") {
                setMsg("Could not fetch user data. Please try again...");
              } else if (response?.reason === "token-storing-failed") {
                setMsg("Could not store token. Please try again...");
              }
            }

            if (!response?.error) getProfileData();
          } else if (res.reason === "artist-data-not-fetched") {
            setMsg("Could not fetch artist data. Please try again...");
          }
        }

        if (!res?.error && res?.type === "spotify-profile-search-success") {
          setProfileData(res?.profileData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProfileData();
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
      <div className="w-full flex-1 flex flex-col gap-4 justify-between items-center p-4 text-left overflow-hidden">
        <div className="w-full text-center">
          <h1 className="text-2xl font-semibold">Profile Data</h1>
          <p>Fetched from spotify</p>
        </div>
        {msg && <div className="w-full py-2 px-4">{msg}</div>}
        {profileData && (
          <div className="w-full flex-1 flex flex-col gap-2 justify-around items-start text-lg overflow-hidden">
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Country :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.country}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Name :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.display_name}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Email :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.email}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Profile URL :</span>
              <span
                onClick={() =>
                  chrome.tabs.create({
                    url: profileData?.external_urls?.spotify,
                  })
                }
                className="flex-1 font-semibold truncate hover:underline underline-offset-4 cursor-pointer"
              >
                {profileData?.external_urls?.spotify}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Followers :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.followers?.total}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">Spotify ID :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.id}
              </span>
            </div>
            <div className="w-full flex gap-2 justify-start items-center truncate">
              <span className="opacity-[64%]">User Type :</span>
              <span className="flex-1 font-semibold truncate">
                {profileData?.product}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
