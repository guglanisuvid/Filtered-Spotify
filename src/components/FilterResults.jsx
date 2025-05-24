/* global chrome */
const FilterResults = ({ filteredResult }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 items-center bg-bg-200 p-2 border-2 rounded-xl">
      <h3 className="text-[16px] font-semibold">Filtered Results</h3>
      {filteredResult ? (
        <div
          className="flex-1 w-full flex flex-col gap-2 items-center p-2 transition duration-400 hover:scale-104 cursor-pointer"
          onClick={() =>
            chrome.tabs.create({
              url: filteredResult?.external_urls?.spotify,
            })
          }
        >
          <img
            className="w-[120px] aspect-square rounded-2xl"
            src={filteredResult?.images[0]?.url}
            alt=""
          />
          <h2 className="font-medium text-lg">{filteredResult?.name}</h2>
          <p>{filteredResult?.description}</p>
        </div>
      ) : (
        <div>No results to show</div>
      )}
    </div>
  );
};

export default FilterResults;
