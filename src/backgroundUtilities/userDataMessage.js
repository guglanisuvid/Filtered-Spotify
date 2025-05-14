export function userDataMessage(port, auth) {
    const user = auth.currentUser;

    port.postMessage({
        type: "user-data",
        user: user ?
            {
                name: user?.displayName,
                email: user?.email,
                photo: user?.photoURL,
                uid: user?.uid,
            }
            : null
    });
}