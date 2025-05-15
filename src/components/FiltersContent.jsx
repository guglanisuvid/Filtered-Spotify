/* global chrome */
import { useState } from "react";
import FilterInputs from "./FilterInputs";
import SelectedArtists from "./SelectedArtists";
import FilterResults from "./FilterResults";
import ArtistSearchResults from "./ArtistSearchResults";

const FiltersContent = ({ setMsg }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [selectedArtists, setSelectedArtists] = useState([]);
  const [artistSearch, setArtistSearch] = useState("");
  const [artistSearchList, setArtistSearchList] = useState("");

  const handleArtistSearchClick = async (key) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: "artist-search-request",
        artistSearch: key.trim(),
      });

      if (res?.error && res?.type === "artist-search-failed") {
        setMsg(res?.reason);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilterSongs = () => {
    console.log("handleFilterSongs clicked");
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 jutify-between items-center text-center p-4">
      <div className="w-full grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <FilterInputs
            artistSearch={artistSearch}
            setArtistSearch={setArtistSearch}
            selectedArtists={selectedArtists}
            handleArtistSearchClick={handleArtistSearchClick}
            startDate={startDate}
            endDate={endDate}
            setDateRange={setDateRange}
            handleFilterSongs={handleFilterSongs}
          />
        </div>
        <div className="col-span-1 h-full">
          <SelectedArtists selectedArtists={selectedArtists} />
        </div>
      </div>
      <div className="flex-1 w-full grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <ArtistSearchResults artistSearchList={artistSearchList} />
        </div>
        <div className="col-span-1">
          <FilterResults />
        </div>
      </div>
    </div>
  );
};

export default FiltersContent;
