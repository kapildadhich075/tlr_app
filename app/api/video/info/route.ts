// api/video/info/route.ts

import { NextResponse } from "next/server";
import { YouTubeDownloader } from "../../_utils/youtube-server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const info = await YouTubeDownloader.getVideoInfo(url);
    return NextResponse.json({ info });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
