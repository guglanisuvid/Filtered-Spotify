const ArtistSearchResults = ({ artistSearchList }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center bg-bg-200 p-2 rounded-xl">
      <h3 className="text-[16px] font-semibold">Artist Search Results</h3>
      <div className="flex-1 w-full flex flex-col gap-2 justify-between items-center">
        <div>
          {artistSearchList.length ? "Hello World" : "No artist selected"}
        </div>
      </div>
    </div>
  );
};

export default ArtistSearchResults;
