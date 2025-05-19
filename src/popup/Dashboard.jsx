/* global chrome */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { SpotifyTokenRefreshMessage } from "../popupUtilities/SpotifyTokenRefreshMessage";

const Dashboard = ({ handleUser, user }) => {
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");
  const [longTermTracks, setLongTermTracks] = useState([]);
  const [shortTermTracks, setShortTermTracks] = useState([]);
  const [longTermArtists, setLongTermArtists] = useState([]);
  const [shortTermArtists, setShortTermArtists] = useState([]);
  const [followedArtists, setFollowedArtists] = useState([]);

  useEffect(() => {
    const getTopItems = async () => {
      try {
        const res = await chrome.runtime.sendMessage({
          type: "spotify-user-top-request",
        });

        if (res?.error && res?.type === "spotify-user-top-request-failed") {
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

            if (!response?.error) getTopItems();
          } else {
            setMsg(res?.reason);
          }
        }

        if (!res?.error) {
          setLongTermTracks(res?.longTermTracks?.data?.items);
          setShortTermTracks(res?.shortTermTracks?.data?.items);
          setLongTermArtists(res?.longTermArtists?.data?.items);
          setShortTermArtists(res?.shortTermArtists?.data?.items);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getTopItems();
  }, []);

  useEffect(() => {
    const getFollowedArtists = async () => {
      try {
        const res = await chrome.runtime.sendMessage({
          type: "spotify-user-followed-artists-request",
        });

        if (
          res?.error &&
          res?.type === "spotify-user-followed-artists-failed"
        ) {
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

            if (!response?.error) getFollowedArtists();
          } else if (
            res?.reason === "spotify-user-followed-artists-not-fetched"
          ) {
            setMsg("Failed to fetch spotify user data. Please try again...");
          }
        }

        if (!res?.error) {
          setFollowedArtists(res?.followedArtists?.artists?.items);
        }
      } catch (error) {
        console.error(error);
      }
    };

    getFollowedArtists();
  }, []);

  useEffect(() => {
    setInterval(() => {
      setMsg("");
    }, 4000);
  }, [msg]);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center text-center overflow-hidden">
      <Navbar handleUser={handleUser} userName={user?.name} />
      <div className="w-full flex-1 flex flex-col gap-4 justify-start items-center p-4 text-left overflow-hidden">
        <h1 className="w-full text-2xl text-center font-semibold">Dashboard</h1>
        {msg && <div className="w-full py-2 px-4">{msg}</div>}
        <div className="w-full flex-1 overflow-y-auto">
          <div className="w-full flex flex-col gap-4 justify-between items-start mb-8 overflow-hidden">
            <h2 className="text-lg font-semibold">Your Top Tracks</h2>
            <div className="w-full flex flex-col gap-1 justify-between items-start overflow-y-hidden overflow-x-auto">
              {longTermTracks.length ? (
                <p className="font-semibold">Yearly</p>
              ) : (
                ""
              )}
              <div className="flex gap-4 justify-start items-start">
                {longTermTracks.length
                  ? longTermTracks?.map((track) => (
                      <div
                        id={track?.id}
                        onClick={() =>
                          chrome.tabs.create({
                            url: track?.external_urls?.spotify,
                          })
                        }
                        className="w-24 flex flex-col gap-1 justify-between items-start cursor-pointer transition duration-[400ms] hover:scale-104"
                      >
                        <img
                          className="w-24 aspect-square rounded-lg"
                          src={track?.album?.images[0]?.url}
                        />
                        <p className="line-clamp-2">{track?.name}</p>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            <div className="w-full flex flex-col gap-1 justify-between items-start overflow-y-hidden overflow-x-auto">
              {shortTermTracks.length ? (
                <p className="font-semibold">Monthly</p>
              ) : (
                ""
              )}
              <div className="flex gap-4 justify-start items-start">
                {shortTermTracks.length
                  ? shortTermTracks?.map((track) => (
                      <div
                        id={track?.id}
                        onClick={() =>
                          chrome.tabs.create({
                            url: track?.external_urls?.spotify,
                          })
                        }
                        className="w-24 flex flex-col gap-1 justify-between items-start cursor-pointer transition duration-[400ms] hover:scale-104"
                      >
                        <img
                          className="w-24 aspect-square rounded-lg"
                          src={track?.album?.images[0]?.url}
                        />
                        <p className="line-clamp-2">{track?.name}</p>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 justify-between items-start overflow-hidden">
            <h2 className="text-lg font-semibold">Your Top Artists</h2>
            <div className="w-full flex flex-col gap-1 justify-between items-start overflow-y-hidden overflow-x-auto">
              {longTermArtists.length ? (
                <p className="font-semibold">Yearly</p>
              ) : (
                ""
              )}
              <div className="flex gap-4 justify-start items-start">
                {longTermArtists.length
                  ? longTermArtists?.map((artist) => (
                      <div
                        id={artist?.id}
                        onClick={() =>
                          chrome.tabs.create({
                            url: artist?.external_urls?.spotify,
                          })
                        }
                        className="w-24 flex flex-col gap-1 justify-between items-start cursor-pointer transition duration-[400ms] hover:scale-104"
                      >
                        <img
                          className="w-24 aspect-square rounded-lg"
                          src={artist?.images[0]?.url}
                        />
                        <p className="line-clamp-2">{artist?.name}</p>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
            <div className="w-full flex flex-col gap-1 justify-between items-start overflow-y-hidden overflow-x-auto">
              {shortTermArtists.length ? (
                <p className="font-semibold">Monthly</p>
              ) : (
                ""
              )}
              <div className="flex gap-4 justify-start items-start">
                {shortTermArtists.length
                  ? shortTermArtists?.map((artist) => (
                      <div
                        id={artist?.id}
                        onClick={() =>
                          chrome.tabs.create({
                            url: artist?.external_urls?.spotify,
                          })
                        }
                        className="w-24 flex flex-col gap-1 justify-between items-start cursor-pointer transition duration-[400ms] hover:scale-104"
                      >
                        <img
                          className="w-24 aspect-square rounded-lg"
                          src={artist?.images[0]?.url}
                        />
                        <p className="line-clamp-2">{artist?.name}</p>
                      </div>
                    ))
                  : ""}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-4 justify-between items-start overflow-hidden">
            <h2 className="text-lg font-semibold">Your Followed Artists</h2>
            <div className="flex gap-4 justify-start items-start overflow-y-hidden overflow-x-auto">
              {followedArtists.length ? (
                followedArtists?.map((artist) => (
                  <div
                    id={artist?.id}
                    onClick={() =>
                      chrome.tabs.create({
                        url: artist?.external_urls?.spotify,
                      })
                    }
                    className="w-24 flex flex-col gap-1 justify-between items-start cursor-pointer transition duration-[400ms] hover:scale-104"
                  >
                    <img
                      className="w-24 aspect-square rounded-lg"
                      src={artist?.images[0]?.url}
                    />
                    <p className="line-clamp-2">{artist?.name}</p>
                  </div>
                ))
              ) : (
                <div>You don't follow any artist.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
