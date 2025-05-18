import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SelectedArtists = ({ selectedArtists, setSelectedArtists }) => {
  return (
    <div className="w-full h-full flex flex-col gap-[2px] justify-between items-center bg-bg-200 p-2 rounded-xl overflow-hidden">
      <h3 className="text-[16px] font-semibold">Selected Artists</h3>
      <div className="flex-1 w-full flex flex-col justify-start items-center px-2 overflow-y-auto overflow-x-hidden">
        {selectedArtists.length ? (
          selectedArtists.map((artist) => (
            <div
              key={artist?.id}
              className="w-full flex gap-2 justify-between items-center"
            >
              <div className="flex-1 truncate text-center">{artist?.name}</div>
              <button
                onClick={() => {
                  setSelectedArtists((prevList) =>
                    prevList.filter((item) => item?.id !== artist?.id)
                  );
                }}
                className="hover:scale-104 cursor-pointer"
              >
                <FontAwesomeIcon icon={faClose} />
              </button>
            </div>
          ))
        ) : (
          <div>No artists are selected</div>
        )}
      </div>
    </div>
  );
};

export default SelectedArtists;
