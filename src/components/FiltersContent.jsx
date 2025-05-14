/* global chrome */
import { useState } from "react";
import FilterInputs from "./FilterInputs";
import SelectedArtists from "./SelectedArtists";
import FilterResults from "./FilterResults";

const FiltersContent = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [artists] = useState([]);
  const [artistSearch, setArtistSearch] = useState("");

  const handleArtistSearchClick = async (key) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: "artist-search-request",
        artistSearch: key.trim(),
      });

      console.log(res);
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
            artists={artists}
            handleArtistSearchClick={handleArtistSearchClick}
            startDate={startDate}
            endDate={endDate}
            setDateRange={setDateRange}
            handleFilterSongs={handleFilterSongs}
          />
        </div>
        <div className="col-span-1 h-full">
          <SelectedArtists artists={artists} />
        </div>
      </div>
      <div className="w-full flex-1">
        <FilterResults />
      </div>
    </div>
  );
};

export default FiltersContent;
