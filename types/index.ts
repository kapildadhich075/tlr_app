// types/index.ts
export interface VideoInfo {
  title: string;
  description: string;
  duration: number;
  view_count: number;
  like_count: number;
  thumbnail: string;
  formats: Array<{
    format_id: string;
    ext: string;
    resolution: string;
    filesize: number;
  }>;
}

export interface DownloadOptions {
  url: string;
  format?: string;
  quality?: string;
  type: "video" | "audio";
}
