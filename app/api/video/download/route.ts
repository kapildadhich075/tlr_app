// Example: /api/video/download

import { NextResponse } from "next/server";
import { YouTubeDownloader } from "../../_utils/youtube-server";

export async function POST(req: Request) {
  try {
    const { url, format, quality, type } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const filename = await YouTubeDownloader.downloadVideo({
      url,
      format,
      quality,
      type,
    });

    return NextResponse.json({
      success: true,
      filename,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
