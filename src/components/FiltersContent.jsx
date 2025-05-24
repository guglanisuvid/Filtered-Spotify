/* global chrome */
import { useEffect, useState } from "react";
import FilterInputs from "./FilterInputs";
import SelectedArtists from "./SelectedArtists";
import FilterResults from "./FilterResults";
import ArtistSearchResults from "./ArtistSearchResults";
import { SpotifyTokenRefreshMessage } from "../popupUtilities/SpotifyTokenRefreshMessage";

const FiltersContent = ({ setMsg }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [artistSearchList, setArtistSearchList] = useState("");
  const [filteredResult, setFilteredResult] = useState();

  const handleArtistSearchClick = async (key) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: "artist-search-request",
        artistSearch: key.trim(),
      });

      if (res?.error && res?.type === "artist-search-failed") {
        if (res?.reason === "artist-name-not-valid") {
          setMsg("Please search a valid artist name.");
        } else if (res?.reason === "spotify-token-not-valid") {
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

          if (!response?.error) handleArtistSearchClick(key);
        } else if (res.reason === "artist-data-not-fetched") {
          setMsg("Could not fetch artist data. Please try again...");
        }
      }

      if (!res?.error) {
        const data = await chrome.storage.local.get("artists");
        setArtistSearchList(data?.artists);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterSongsClick = async () => {
    try {
      if (!selectedArtists.length) {
        setMsg("Please select a valid artist.");
        return;
      }

      if (!dateRange[0] || !dateRange[1]) {
        setMsg("Please select a valid date range.");
        return;
      }

      const res = await chrome.runtime.sendMessage({
        type: "filter-request",
        selectedArtists,
        dateRange,
      });

      if (res?.error && res?.type === "filter-request-failed") {
        if (res?.reason === "artists-not-valid") {
          setMsg("Please select vaild artists.");
        } else if (res?.reason === "spotify-token-not-valid") {
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

          if (!response?.error) handleFilterSongsClick();
        } else if (res.reason === "songs-data-not-fetched") {
          setMsg("Could not fetch songs. Please try again...");
        }
      }

      if (!res?.error) setFilteredResult(res?.playlist);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchArtistSearchData = async () => {
      const data = await chrome.storage.local.get("artists");
      setArtistSearchList(data?.artists);
    };

    fetchArtistSearchData();
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 jutify-between items-center text-center p-4 overflow-hidden">
      <div className="w-full grid grid-cols-2 gap-4 overflow-hidden">
        <div className="col-span-1 overflow-hidden">
          <FilterInputs
            artistSearch={artistSearch}
            setArtistSearch={setArtistSearch}
            selectedArtists={selectedArtists}
            handleArtistSearchClick={handleArtistSearchClick}
            startDate={startDate}
            endDate={endDate}
            setDateRange={setDateRange}
            handleFilterSongsClick={handleFilterSongsClick}
          />
        </div>
        <div className="col-span-1 overflow-hidden">
          <SelectedArtists
            selectedArtists={selectedArtists}
            setSelectedArtists={setSelectedArtists}
          />
        </div>
      </div>
      <div className="flex-1 w-full grid grid-cols-2 gap-4 overflow-hidden">
        <div className="col-span-1 overflow-hidden">
          <ArtistSearchResults
            artistSearchList={artistSearchList}
            setArtistSearchList={setArtistSearchList}
            selectedArtists={selectedArtists}
            setSelectedArtists={setSelectedArtists}
            setMsg={setMsg}
          />
        </div>
        <div className="col-span-1 overflow-hidden">
          <FilterResults filteredResult={filteredResult} />
        </div>
      </div>
    </div>
  );
};

export default FiltersContent;
