export const generateSessionToken = () => {
    const randomValues = new Uint8Array(256);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues, (byte) =>
        byte.toString(16).padStart(2, "0"),
    ).join("");
};
