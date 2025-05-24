/* global chrome */
import { isTokenExpired } from "./isTokenExpired";

export const handleGetFilteredSongs = async (selectedArtists, dateRange) => {
    try {
        if (!selectedArtists.length) return { error: true, type: "filter-request-failed", reason: "artists-not-valid" };

        const tokens = await chrome.storage.local.get("spotifyTokens");

        if (!tokens || await isTokenExpired(tokens.spotifyTokens)) return { error: true, type: "filter-request-failed", reason: "spotify-token-not-valid" };

        const accessToken = tokens?.spotifyTokens?.accessToken;

        const data = selectedArtists.map(async (artist) => {
            const res = await getArtistAlbums(artist?.id, dateRange, accessToken);
            return res?.shortListedAlbums;
        });

        let albums = await Promise.all(data);
        albums = albums.flat();

        const tracksData = albums.map(async (album) => {
            const res = await getTracksData(album?.id, accessToken);
            return res;
        });

        let tracks = await Promise.all(tracksData);
        tracks = tracks.flat();

        let filteredTracks = tracks.filter((track) => {
            return track.artists.some(trackArtist => {
                return selectedArtists.some(artist => {
                    return artist?.id === trackArtist?.id;
                });
            });
        });

        filteredTracks = shuffleTracks(filteredTracks);

        const playlistData = await createPlaylist(selectedArtists, dateRange, accessToken);
        const playlistId = playlistData?.playlist?.id;

        console.log(await addTracksToPlaylist(playlistId, filteredTracks, accessToken));

        // return { error: false, type: "filter-request-success", tracks: filteredTracks }
    } catch (error) {
        console.error("Error fetching songs: ", error);
    }
};

const getArtistAlbums = async (artistId, dateRange, accessToken) => {
    let shortListedAlbums = [];
    const url = new URL(`v1/artists/${artistId}/albums`, import.meta.env.VITE_SPOTIFY_API_URL);
    url.search = new URLSearchParams({
        include_groups: ["album", "single"].join(","),
        limit: 50,
        offset: 0
    }).toString();

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "songs-data-not-fetched", msg: await res.text() }
    }

    let data = await res.json();
    shortListedAlbums = await comparingReleaseDates(shortListedAlbums, data, dateRange, accessToken);

    while (shortListedAlbums.length < 10 && data?.next) {
        const res = await nextAlbumsRequest(data?.next, accessToken, shortListedAlbums, dateRange);
        if (!res?.error) {
            data = res?.data;
            shortListedAlbums = res?.shortlistedItems;
        }
    }

    return { error: false, type: "filter-request-success", shortListedAlbums };
}

const comparingReleaseDates = async (shortListedAlbums, data, dateRange) => {
    let providedDate = new Date(dateRange[0]).toLocaleString();
    const startDate = [new Date(providedDate).getFullYear(), new Date(providedDate).getMonth()];
    providedDate = new Date(dateRange[1]).toLocaleString();
    const endDate = [new Date(providedDate).getFullYear(), new Date(providedDate).getMonth()];

    const filteredItems = data?.items.filter((item) => {
        const releaseDate = item?.release_date.split("-", 2);
        return (startDate[0] <= releaseDate[0] && startDate[1] + 1 <= releaseDate[1]) && (endDate[0] >= releaseDate[0] && endDate[1] + 1 >= releaseDate[1]);
    });

    return [...shortListedAlbums, ...filteredItems];
}

const nextAlbumsRequest = async (url, accessToken, shortListedAlbums, dateRange) => {
    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "songs-data-not-fetched", msg: await res.text() }
    }

    const data = await res.json();
    return { error: false, data, shortlistedItems: await comparingReleaseDates(shortListedAlbums, data, dateRange) };
}

const getTracksData = async (trackId, accessToken) => {
    const url = new URL(`v1/albums/${trackId}/tracks`, import.meta.env.VITE_SPOTIFY_API_URL);
    url.search = new URLSearchParams({
        limit: 50,
        offset: 0
    }).toString();

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "songs-data-not-fetched", msg: await res.text() }
    }

    const data = await res.json();

    return data?.items
}

const shuffleTracks = (tracks) => {
    let currentIndex = tracks.length;
    let randomIndex;

    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [tracks[currentIndex], tracks[randomIndex]] = [
            tracks[randomIndex],
            tracks[currentIndex],
        ];
    }

    if (tracks.length > 99) tracks = tracks.slice(0, 100);

    return tracks;
}

const getSpotifyUserId = async (accessToken) => {
    const url = new URL(`v1/me`, import.meta.env.VITE_SPOTIFY_API_URL);

    const res = await fetch(url.toString(), {
        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "user-id-not-fetched", msg: await res.text() }
    }

    const data = await res.json();
    return data?.id;
}

const createPlaylist = async (selectedArtists, dateRange, accessToken) => {

    const userId = await getSpotifyUserId(accessToken);
    const url = new URL(`v1/users/${userId}/playlists`, import.meta.env.VITE_SPOTIFY_API_URL);

    const artistsList = selectedArtists.map((artist) => { return artist?.name });

    let providedDate = new Date(dateRange[0]).toLocaleString();
    const startDate = `${new Date(providedDate).getFullYear()}-${new Date(providedDate).getMonth() + 1}`;
    providedDate = new Date(dateRange[1]).toLocaleString();
    const endDate = `${new Date(providedDate).getFullYear()}-${new Date(providedDate).getMonth() + 1}`;

    const playlistBody = {
        "name": `${startDate} to ${endDate}, ${artistsList.join(" ")}`,
        "description": `Songs of ${artistsList.join(", ")} from ${startDate} to ${endDate}.`,
        "public": false,
        "collaborative": false
    }

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playlistBody)
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "playlist-not-created", msg: await res.text() }
    }

    return { error: false, type: "filter-request-success", playlist: await res.json() }
}

const addTracksToPlaylist = async (playlistId, filteredTracks, accessToken) => {
    const url = new URL(`v1/playlists/${playlistId}/tracks`, import.meta.env.VITE_SPOTIFY_API_URL);

    const playlistBody = {
        "uris": filteredTracks.map((track) => { return track?.uri })
    }

    const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(playlistBody)
    });

    if (!res.ok) {
        return { error: true, type: "filter-request-failed", reason: "tracks-not-added-to-paylist", msg: await res.text() }
    }

    return { error: false, type: "filter-request-success" }
}