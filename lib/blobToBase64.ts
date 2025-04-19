export const blobUrlToDataUrl = async (blobUrl: string): Promise<string> => {
    const blob = await fetch(blobUrl).then((r) => r.blob());
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject("Failed to convert blob to base64");
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};