/* global chrome */

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Filters = ({ handleUser, user }) => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [artists, setArtists] = useState([]);

  const handleSignOut = async () => {
    return await handleUser("signout-request");
  };

  const handleArtistSearch = () => {
    console.log("handleArtistSearch clicked");
  };

  const handleSongsSearch = () => {
    console.log("handleSongsSearch clicked");
  };

  useEffect(() => {
    const handleSpotifyTokens = () => {
      const port = chrome.runtime.connect({
        name: "get-spotify-token",
      });

      port.onMessage.addListener((message) => {
        if (message.type === "spotify-tokens") {
          console.log(message);
        }
      });

      return () => {
        port.disconnect();
      };
    };

    handleSpotifyTokens();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="w-full h-full p-4 flex flex-col gap-8 justify-between items-center text-center">
      <div className="flex flex-col justify-between items-center">
        <h2 className="text-lg font-medium text-text-100">
          <span className="text-text-200 font-medium text-sm">
            Welcome back,
          </span>{" "}
          {user?.name}
        </h2>
        <h1 className="text-3xl font-semibold">Filtered Spotify</h1>
      </div>
      <div className="w-full flex-1 flex flex-col gap-8 justify-between items-center">
        <div className="flex-1 w-full bg-bg-200 px-4 py-2 flex flex-col gap-2 justify-between items-center rounded-xl">
          <h3 className="text-md font-semibold">Selected Artists</h3>
          <div className="flex-1 flex flex-col gap-2 justify-between items-center">
            {artists.length ? "Hello World" : "No artist selected"}
          </div>
        </div>
        <div className="w-full flex gap-4 justify-between items-center">
          <input
            className="flex-1 px-4 py-2 bg-bg-300 outline-none rounded-full placeholder:text-text-200 placeholder:opacity-64"
            type="text"
            placeholder="Up to 5 artists"
            disabled={artists.length >= 5}
          />
          <button
            onClick={handleArtistSearch}
            className="w-8 aspect-square bg-text-100 text-bg-300 font-semibold outline-none rounded-full cursor-pointer"
            disabled={artists.length >= 5}
          >
            <FontAwesomeIcon icon={faSearch} className="text-md" />
          </button>
        </div>
        <div className="w-full flex gap-4 justify-center items-center">
          <DatePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(update) => {
              setDateRange(update);
            }}
            dateFormat={"MM/YYYY"}
            minDate={new Date(1951, 0)}
            maxDate={new Date()}
            className="px-4 py-2 bg-bg-300 outline-none rounded-full"
            placeholderText="Select Date Range"
            selectsRange
            showMonthYearPicker
            withPortal
            fixedHeight
            isClearable
          />
          <button
            onClick={handleSongsSearch}
            className="px-4 py-2 bg-text-100 text-bg-300 font-semibold whitespace-nowrap outline-none rounded-full"
          >
            Get Songs
          </button>
        </div>
      </div>
      <div className="w-full flex gap-4 justify-center items-center">
        <button
          onClick={() =>
            chrome.tabs.create({
              url: "http://127.0.0.1:5173/filtered-spotify/dashboard",
            })
          }
          className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
        >
          Go to Dashboard
        </button>
        <button
          onClick={handleSignOut}
          className="px-4 py-2 border-2 rounded-lg hover:cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Filters;
