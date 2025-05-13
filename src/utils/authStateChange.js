import { onAuthStateChanged } from "firebase/auth";

export function authStateChange(auth, connectedPort) {
    onAuthStateChanged(auth, (user) => {
        if (connectedPort) {
            connectedPort.postMessage({
                type: "user-data",
                user: user
                    ? {
                        name: user.displayName,
                        email: user.email,
                        photo: user.photoURL,
                        uid: user.uid,
                    }
                    : null,
            });
        }
    });
}