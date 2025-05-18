/* global chrome */
import { SpotifyTokenRefreshMessage } from "../popupUtilities/SpotifyTokenRefreshMessage";

const ArtistSearchResults = ({
  artistSearchList,
  setArtistSearchList,
  selectedArtists,
  setSelectedArtists,
  setMsg,
}) => {
  const handlePreviousNextArtistSearchClick = async (url) => {
    try {
      const res = await chrome.runtime.sendMessage({
        type: "previous-next-artist-search-request",
        url,
      });

      if (res?.error && res?.type === "artist-search-failed") {
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

          if (!response?.error) handlePreviousNextArtistSearchClick(url);
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

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-between items-center bg-bg-200 p-2 rounded-xl overflow-hidden">
      <h3 className="text-[16px] font-semibold">Artist Search Results</h3>
      <div className="flex-1 w-full flex flex-col gap-2 justify-between items-center px-2 overflow-y-auto overflow-x-hidden">
        {artistSearchList ? (
          <div className="w-full flex flex-col gap-2 justify-between items-center">
            {artistSearchList?.items.map((artist) => (
              <div
                key={artist?.id}
                onClick={() => {
                  if (selectedArtists.length < 5) {
                    setSelectedArtists((prevSelectedArtists) => {
                      if (
                        prevSelectedArtists.some(
                          (selected) => selected.id === artist.id
                        )
                      ) {
                        return prevSelectedArtists.filter(
                          (selected) => selected.id !== artist.id
                        );
                      } else {
                        return [...prevSelectedArtists, artist];
                      }
                    });
                  } else {
                    setMsg("You can not select more than 5 artists.");
                  }
                }}
                className="w-full flex gap-2 justify-between items-center transition duration-[400ms] hover:scale-104 group cursor-pointer"
              >
                <img
                  className="w-12 aspect-square rounded-lg"
                  src={artist?.image}
                />
                <div className="flex-1 truncate text-center group-hover:underline underline-offset-4">
                  {artist?.name}
                </div>
              </div>
            ))}
            <div className="w-full flex gap-4 justify-center items-center">
              <button
                onClick={async () => {
                  await handlePreviousNextArtistSearchClick(
                    artistSearchList?.previous
                  );
                }}
                className={`underline-offset-4 ${
                  artistSearchList?.previous
                    ? "cursor-pointer hover:underline"
                    : "opacity-40 cursor-not-allowed"
                }`}
                disabled={!artistSearchList?.previous}
              >
                Previous Page
              </button>
              <span>|</span>
              <button
                onClick={async () => {
                  await handlePreviousNextArtistSearchClick(
                    artistSearchList?.next
                  );
                }}
                className={`underline-offset-4 ${
                  artistSearchList?.next
                    ? "cursor-pointer hover:underline"
                    : "opacity-40 cursor-not-allowed"
                }`}
                disabled={!artistSearchList?.next}
              >
                Next Page
              </button>
            </div>
          </div>
        ) : (
          <div>No artist data available</div>
        )}
      </div>
    </div>
  );
};

export default ArtistSearchResults;
