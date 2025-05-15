export async function isTokenExpired(tokens) {
    const isExpired =
        (new Date() - new Date(tokens?.recievedAt)) / 1000 >
        tokens?.expiresIn - 30;

    if (isExpired) {
        return true
    }

    return false;
}