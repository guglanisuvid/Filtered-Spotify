import { doc, getDoc } from "firebase/firestore";

export async function firestoreGetData(db, uid) {
    const data = await getDoc(doc(db, "userData", uid));

    if (!data.exists()) {
        return null;
    };

    return data.data();
}