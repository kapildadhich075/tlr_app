import { NextResponse } from "next/server";

import { YouTubeDownloader } from "../../_utils/youtube-server";

// /api/video/qualities
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    const qualities = await YouTubeDownloader.getAvailableQualities(url);
    return NextResponse.json(qualities);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
