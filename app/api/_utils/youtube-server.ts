import { exec } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";
import https from "https";

export interface DownloadOptions {
  url: string;
  format?: string;
  quality?: string;
  type: "video" | "audio" | "thumbnail";
}

export class YouTubeDownloader {
  private static ytDlpPath = path.join(
    process.cwd(),
    "scripts",
    os.platform() === "win32" ? "yt-dlp.exe" : "yt-dlp"
  );

  private static readonly VIDEO_QUALITY_MAP: { [key: string]: string } = {
    "2160": "bestvideo[height<=2160]+bestaudio/best[height<=2160]",
    "1440": "bestvideo[height<=1440]+bestaudio/best[height<=1440]",
    "1080": "bestvideo[height<=1080]+bestaudio/best[height<=1080]",
    "720": "bestvideo[height<=720]+bestaudio/best[height<=720]",
    "480": "bestvideo[height<=480]+bestaudio/best[height<=480]",
    "360": "bestvideo[height<=360]+bestaudio/best[height<=360]",
  };

  private static readonly AUDIO_QUALITY_MAP: { [key: string]: string } = {
    "320": "bestaudio[abr<=320]",
    "256": "bestaudio[abr<=256]",
    "192": "bestaudio[abr<=192]",
    "128": "bestaudio[abr<=128]",
    "96": "bestaudio[abr<=96]",
  };

  private static getDownloadDir(): string {
    return path.join(os.homedir(), "Downloads");
  }

  private static executeCommand(
    command: string
  ): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      exec(
        command,
        { maxBuffer: 1024 * 1024 * 10 },
        (error, stdout, stderr) => {
          if (error) {
            console.error("Command execution error:", error);
            reject(error);
            return;
          }
          resolve({ stdout, stderr });
        }
      );
    });
  }

  private static downloadFile(url: string, destination: string): Promise<void> {
    return new Promise((resolve, reject) => {
      https
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download: ${response.statusCode}`));
            return;
          }

          const fileStream = fs.createWriteStream(destination);
          response.pipe(fileStream);

          fileStream.on("finish", () => {
            fileStream.close();
            resolve();
          });

          fileStream.on("error", (error) => {
            fs.unlink(destination, () => {});
            reject(error);
          });
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  }

  static async checkInstallation(): Promise<boolean> {
    try {
      if (!fs.existsSync(this.ytDlpPath)) {
        return false;
      }
      const command = `"${this.ytDlpPath}" --version`;
      await this.executeCommand(command);
      return true;
    } catch (error) {
      return false;
    }
  }

  static async getVideoInfo(url: string) {
    const command = `"${this.ytDlpPath}" -j "${url}"`;
    const { stdout } = await this.executeCommand(command);
    return JSON.parse(stdout);
  }

  static async getAvailableFormats(url: string) {
    const command = `"${this.ytDlpPath}" -F "${url}"`;
    const { stdout } = await this.executeCommand(command);
    return stdout;
  }

  static async downloadVideo(options: DownloadOptions) {
    const { url, format = "mp4", quality = "1080", type } = options;
    const downloadDir = this.getDownloadDir();

    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }

    if (type === "thumbnail") {
      const videoInfo = await this.getVideoInfo(url);
      const thumbnailUrl = videoInfo.thumbnail;
      const thumbnailPath = path.join(
        downloadDir,
        `${videoInfo.title}_thumbnail.jpg`
      );
      await this.downloadFile(thumbnailUrl, thumbnailPath);
      return thumbnailPath;
    }

    const outputTemplate = path.join(downloadDir, "%(title)s.%(ext)s");
    let command = `"${this.ytDlpPath}" `;

    if (type === "audio") {
      const audioQuality =
        this.AUDIO_QUALITY_MAP[quality] || this.AUDIO_QUALITY_MAP["128"];
      command += `-f "${audioQuality}" -x --audio-format ${format} `;
      if (quality) {
        command += `--audio-quality ${quality}k `;
      }
    } else {
      const videoQuality =
        this.VIDEO_QUALITY_MAP[quality] || this.VIDEO_QUALITY_MAP["1080"];
      command += `-f "${videoQuality}" `;
      command += `--merge-output-format ${format} `;
    }

    command += `--output "${outputTemplate}" "${url}"`;

    const { stderr } = await this.executeCommand(command);
    const match = stderr.match(/\[download\] Destination: (.+?)[\n\r]/);

    if (!match) {
      throw new Error("Could not determine output filename");
    }

    return match[1];
  }

  static async getAvailableQualities(url: string): Promise<{
    video: string[];
    audio: string[];
  }> {
    try {
      const formats = await this.getAvailableFormats(url);

      // Parse the formats output to determine available qualities
      // This is a simplified version - you might want to parse the actual output
      return {
        video: Object.keys(this.VIDEO_QUALITY_MAP),
        audio: Object.keys(this.AUDIO_QUALITY_MAP),
      };
    } catch (error) {
      console.error("Error getting available qualities:", error);
      return {
        video: ["1080", "720", "480", "360"],
        audio: ["320", "192", "128", "96"],
      };
    }
  }
}
