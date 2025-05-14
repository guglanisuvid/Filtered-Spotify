import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FilterInputs = ({
  artistSearch,
  setArtistSearch,
  selectedArtists,
  handleArtistSearchClick,
  startDate,
  endDate,
  setDateRange,
  handleFilterSongs,
}) => {
  return (
    <div className="w-full flex flex-col gap-4 justify-between items-center text-center">
      <div className="w-full flex gap-2 justify-between items-center">
        <input
          className="flex-1 px-4 py-2 bg-bg-200 outline-none rounded-full placeholder:text-text-200 placeholder:opacity-80"
          type="text"
          placeholder="Up to 5 artists"
          onChange={(e) => {
            setArtistSearch(e.target.value);
          }}
          disabled={selectedArtists.length >= 5}
        />
        <button
          onClick={() => handleArtistSearchClick(artistSearch)}
          className="w-8 aspect-square bg-text-100 text-bg-300 font-semibold outline-none rounded-full cursor-pointer"
          disabled={selectedArtists.length >= 5}
        >
          <FontAwesomeIcon icon={faSearch} className="text-md" />
        </button>
      </div>
      <DatePicker
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setDateRange(update);
        }}
        dateFormat={"MM/YYYY"}
        minDate={new Date(1951, 0)}
        maxDate={new Date()}
        className="w-[276px] px-4 py-2 bg-bg-200 outline-none rounded-full"
        placeholderText="Select Month Range"
        selectsRange
        showMonthYearPicker
        withPortal
        fixedHeight
        isClearable
      />
      <button
        onClick={handleFilterSongs}
        className="w-full px-4 py-2 bg-text-100 text-bg-200 font-semibold outline-none rounded-full"
      >
        Get Filtered Results
      </button>
    </div>
  );
};

export default FilterInputs;
