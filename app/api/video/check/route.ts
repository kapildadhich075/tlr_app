import { NextResponse } from "next/server";
import { YouTubeDownloader } from "../../_utils/youtube-server";

export async function GET() {
  try {
    const isWorking = await YouTubeDownloader.checkInstallation();
    return NextResponse.json({ isWorking });
  } catch (error) {
    return NextResponse.json(
      { error: "Installation check failed" },
      { status: 500 }
    );
  }
}
