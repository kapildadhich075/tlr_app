"use client";

import { VideoInfo } from "@/types";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

interface Qualities {
  video: string[];
  audio: string[];
}

interface FormatOption {
  value: string;
  label: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [availableQualities, setAvailableQualities] = useState<Qualities>({
    video: ["2160", "1440", "1080", "720", "480", "360"],
    audio: ["320", "256", "192", "128", "96"],
  });
  const [selectedFormat, setSelectedFormat] = useState({
    video: "1080",
    audio: "128",
  });

  const formatOptionsMap: { [key: string]: string } = {
    "2160": "4K (2160p)",
    "1440": "2K (1440p)",
    "1080": "1080p",
    "720": "720p",
    "480": "480p",
    "360": "360p",
    "320": "320 kbps",
    "256": "256 kbps",
    "192": "192 kbps",
    "128": "128 kbps",
    "96": "96 kbps",
  };

  useEffect(() => {
    async function checkInstallation() {
      try {
        const response = await fetch("/api/video/check");
        const data = await response.json();
        if (!data.isWorking) {
          setInitError("yt-dlp is not properly installed");
        }
        setInitialized(true);
      } catch (error) {
        setInitError("Failed to initialize yt-dlp");
        setInitialized(true);
      }
    }
    checkInstallation();
  }, []);

  const fetchVideoInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Fetch video info
      const infoResponse = await fetch("/api/video/info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!infoResponse.ok) {
        throw new Error("Failed to fetch video info");
      }

      const { info } = await infoResponse.json();
      setVideoInfo(info);

      // Fetch available qualities
      const qualitiesResponse = await fetch("/api/video/qualities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (qualitiesResponse.ok) {
        const qualities = await qualitiesResponse.json();
        setAvailableQualities(qualities);

        // Set default qualities based on availability
        setSelectedFormat({
          video: qualities.video[0] || "1080",
          audio: qualities.audio[0] || "128",
        });
      }

      toast.success("Video information fetched successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (type: "thumbnail" | "video" | "audio") => {
    setLoading(true);
    try {
      const downloadResponse = await fetch("/api/video/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          format: type === "audio" ? "mp3" : "mp4",
          quality:
            type === "audio" ? selectedFormat.audio : selectedFormat.video,
          type,
        }),
      });

      if (!downloadResponse.ok) {
        throw new Error("Download failed");
      }

      const { filename } = await downloadResponse.json();
      toast.success(`${type} downloaded successfully to Downloads folder!`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-orange-500">
            Initializing...
          </h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (initError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">
            Initialization Error
          </h2>
          <p className="text-orange-500 mb-4">{initError}</p>
          <p className="text-sm text-gray-400">
            Please ensure yt-dlp is properly installed in the scripts directory.
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-black text-white">
      <Toaster position="bottom-right" />

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-orange-500">
            YouTube Downloader by{" "}
            <span className="text-gray-400 font-normal cursor-pointer">
              <a href="https://tlredits.com/" target="_blank">
                TLR Studios
              </a>
            </span>
          </h1>
          <p className="text-gray-400">
            Download videos, audio, or thumbnails from YouTube
          </p>
        </div>

        <form onSubmit={fetchVideoInfo} className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 p-4 rounded-lg bg-gray-900 border border-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                placeholder="Paste YouTube URL here..."
                required
              />
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-4 rounded-lg font-semibold transition-all ${
                  loading
                    ? "bg-gray-700 text-gray-400"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {loading ? "Loading..." : "Fetch Info"}
              </button>
            </div>
          </div>
        </form>

        {videoInfo && (
          <div className="space-y-6 animate-fade-in">
            <div className="p-6 rounded-lg bg-gray-900 border border-gray-800 space-y-4">
              <h2 className="text-2xl font-bold text-orange-500">
                {videoInfo.title}
              </h2>
              <div className="relative aspect-video">
                <img
                  src={videoInfo.thumbnail}
                  alt={videoInfo.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="p-3 rounded-lg bg-gray-800">
                  <div className="text-gray-400">Duration</div>
                  <div className="text-orange-500 font-semibold">
                    {videoInfo.duration} seconds
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800">
                  <div className="text-gray-400">Views</div>
                  <div className="text-orange-500 font-semibold">
                    {videoInfo.view_count.toLocaleString()}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-gray-800">
                  <div className="text-gray-400">Likes</div>
                  <div className="text-orange-500 font-semibold">
                    {videoInfo.like_count.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-gray-400 line-clamp-3">
                {videoInfo.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-900 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Video Quality
                </label>
                <select
                  value={selectedFormat.video}
                  onChange={(e) =>
                    setSelectedFormat((prev) => ({
                      ...prev,
                      video: e.target.value,
                    }))
                  }
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                >
                  {availableQualities.video.map((quality) => (
                    <option key={quality} value={quality}>
                      {formatOptionsMap[quality] || `${quality}p`}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Audio Quality
                </label>
                <select
                  value={selectedFormat.audio}
                  onChange={(e) =>
                    setSelectedFormat((prev) => ({
                      ...prev,
                      audio: e.target.value,
                    }))
                  }
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                >
                  {availableQualities.audio.map((quality) => (
                    <option key={quality} value={quality}>
                      {formatOptionsMap[quality] || `${quality} kbps`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => handleDownload("thumbnail")}
                disabled={loading}
                className="p-4 text-white bg-gray-900 hover:bg-gray-800 rounded-lg border border-orange-500 hover:border-orange-400 transition-all font-semibold"
              >
                Download Thumbnail
              </button>
              <button
                onClick={() => handleDownload("video")}
                disabled={loading}
                className="p-4 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all font-semibold"
              >
                Download Video
              </button>
              <button
                onClick={() => handleDownload("audio")}
                disabled={loading}
                className="p-4 text-white bg-gray-900 hover:bg-gray-800 rounded-lg border border-orange-500 hover:border-orange-400 transition-all font-semibold"
              >
                Download Audio
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
// import { VideoInfo } from "@/types";
// import { useEffect, useState } from "react";
// import { Toaster, toast } from "react-hot-toast";

// export default function Home() {
//   const [url, setUrl] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [initialized, setInitialized] = useState(false);
//   const [initError, setInitError] = useState<string | null>(null);
//   const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);

//   useEffect(() => {
//     async function checkInstallation() {
//       try {
//         const response = await fetch("/api/video/check");
//         const data = await response.json();

//         if (!data.isWorking) {
//           setInitError("yt-dlp is not properly installed");
//         }
//         setInitialized(true);
//       } catch (error) {
//         setInitError("Failed to initialize yt-dlp");
//         setInitialized(true);
//       }
//     }
//     checkInstallation();
//   }, []);

//   const fetchVideoInfo = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const infoResponse = await fetch("/api/video/info", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ url }),
//       });

//       if (!infoResponse.ok) {
//         throw new Error("Failed to fetch video info");
//       }

//       const { info } = await infoResponse.json();
//       setVideoInfo(info);
//       toast.success("Video information fetched successfully!");
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDownload = async (type: "thumbnail" | "video" | "audio") => {
//     setLoading(true);
//     try {
//       const downloadResponse = await fetch("/api/video/download", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           url,
//           format: type === "audio" ? "mp3" : "mp4",
//           quality: "1080",
//           type,
//         }),
//       });

//       if (!downloadResponse.ok) {
//         throw new Error("Download failed");
//       }

//       const { filename } = await downloadResponse.json();
//       toast.success(`${type} downloaded successfully to Downloads folder!`);
//     } catch (error: any) {
//       toast.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!initialized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4 text-orange-500">
//             Initializing...
//           </h2>
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
//         </div>
//       </div>
//     );
//   }

//   if (initError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black">
//         <div className="text-center p-8 max-w-md">
//           <h2 className="text-2xl font-bold mb-4 text-red-600">
//             Initialization Error
//           </h2>
//           <p className="text-orange-500 mb-4">{initError}</p>
//           <p className="text-sm text-gray-400">
//             Please ensure yt-dlp is properly installed in the scripts directory.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen p-8 bg-black text-white">
//       <Toaster position={"bottom-right"} />

//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="text-center space-y-4">
//           <h1 className="text-5xl font-bold text-orange-500">
//             YouTube Downloader by{" "}
//             <span
//               className="text-gray-400  font-normal  cursor-pointer
//             "
//             >
//               <a href="https://tlredits.com/" target="_blank">
//                 TLR Studios
//               </a>
//             </span>
//           </h1>
//           <p className="text-gray-400">
//             Download videos, audio, or thumbnails from YouTube
//           </p>
//         </div>

//         <form onSubmit={fetchVideoInfo} className="space-y-6">
//           <div className="space-y-2">
//             <div className="flex gap-2">
//               <input
//                 type="url"
//                 value={url}
//                 onChange={(e) => setUrl(e.target.value)}
//                 className="flex-1 p-4 rounded-lg bg-gray-900 border border-gray-800 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
//                 placeholder="Paste YouTube URL here..."
//                 required
//               />
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className={`px-8 py-4 rounded-lg font-semibold transition-all ${
//                   loading
//                     ? "bg-gray-700 text-gray-400"
//                     : "bg-orange-500 hover:bg-orange-600 text-white"
//                 }`}
//               >
//                 {loading ? "Loading..." : "Fetch Info"}
//               </button>
//             </div>
//           </div>
//         </form>

//         {videoInfo && (
//           <div className="space-y-6 animate-fade-in">
//             <div className="p-6 rounded-lg bg-gray-900 border border-gray-800 space-y-4">
//               <h2 className="text-2xl font-bold text-orange-500">
//                 {videoInfo.title}
//               </h2>
//               <div className="relative aspect-video">
//                 <img
//                   src={videoInfo.thumbnail}
//                   alt={videoInfo.title}
//                   className="w-full h-full object-cover rounded-lg"
//                 />
//               </div>
//               <div className="grid grid-cols-3 gap-4 text-sm">
//                 <div className="p-3 rounded-lg bg-gray-800">
//                   <div className="text-gray-400">Duration</div>
//                   <div className="text-orange-500 font-semibold">
//                     {videoInfo.duration} seconds
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-lg bg-gray-800">
//                   <div className="text-gray-400">Views</div>
//                   <div className="text-orange-500 font-semibold">
//                     {videoInfo.view_count.toLocaleString()}
//                   </div>
//                 </div>
//                 <div className="p-3 rounded-lg bg-gray-800">
//                   <div className="text-gray-400">Likes</div>
//                   <div className="text-orange-500 font-semibold">
//                     {videoInfo.like_count.toLocaleString()}
//                   </div>
//                 </div>
//               </div>
//               <p className="text-gray-400 line-clamp-3">
//                 {videoInfo.description}
//               </p>
//             </div>

//             <div className="grid grid-cols-3 gap-4">
//               <button
//                 onClick={() => handleDownload("thumbnail")}
//                 disabled={loading}
//                 className="p-4 text-white bg-gray-900 hover:bg-gray-800 rounded-lg border border-orange-500 hover:border-orange-400 transition-all font-semibold"
//               >
//                 Download Thumbnail
//               </button>
//               <button
//                 onClick={() => handleDownload("video")}
//                 disabled={loading}
//                 className="p-4 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all font-semibold"
//               >
//                 Download Video
//               </button>
//               <button
//                 onClick={() => handleDownload("audio")}
//                 disabled={loading}
//                 className="p-4 text-white bg-gray-900 hover:bg-gray-800 rounded-lg border border-orange-500 hover:border-orange-400 transition-all font-semibold"
//               >
//                 Download Audio
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
