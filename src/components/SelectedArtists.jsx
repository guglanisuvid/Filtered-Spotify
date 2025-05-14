const SelectedArtists = ({ artists }) => {
  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center bg-bg-200 p-2 rounded-xl">
      <h3 className="text-[16px] font-semibold">Selected Artists</h3>
      <div className="flex-1 w-full flex flex-col gap-2 justify-between items-center">
        <div>{artists.length ? "Hello World" : "No artist selected"}</div>
      </div>
    </div>
  );
};

export default SelectedArtists;
