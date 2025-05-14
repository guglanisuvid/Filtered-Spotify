import { doc, setDoc } from "firebase/firestore";

export async function firestoreSetSpotifyData(db, data, uid) {
    try {
        // Update the token in Firestore
        await setDoc(doc(db, "userData", uid),
            {
                spotify: {
                    accessToken: data.access_token,
                    refreshToken: data.refresh_token,
                    expiresIn: data.expires_in,
                    recievedAt: new Date().toISOString(),
                },
            }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error: ", error);
        return false;
    }
}