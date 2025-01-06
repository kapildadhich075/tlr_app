// utils/validators.ts
export function validateYouTubeUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();

    // Check if the hostname is youtube.com or youtu.be
    if (!["youtube.com", "www.youtube.com", "youtu.be"].includes(hostname)) {
      return false;
    }

    // For youtube.com, ensure it has a video ID
    if (hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");
      return !!videoId;
    }

    // For youtu.be, ensure it has a path (video ID)
    if (hostname === "youtu.be") {
      return parsedUrl.pathname.length > 1;
    }

    return false;
  } catch {
    return false;
  }
}
