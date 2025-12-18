import express from "express";
import ytdlp from "yt-dlp-exec";
import fs from "fs";

const app = express();
app.use(express.json());

// YouTube → MP4
app.post("/download", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "No URL" });

  try {
    const file = `video_${Date.now()}.mp4`;

    await ytdlp(url, {
      format: "mp4",
      output: file
    });

    res.json({
      mp4: `https://${req.headers.host}/${file}`
    });

    // 5 daqiqadan keyin o‘chirish
    setTimeout(() => {
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }, 5 * 60 * 1000);

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Download failed" });
  }
});

// Statik fayllar
app.use(express.static(process.cwd()));

app.listen(process.env.PORT || 3000, () =>
  console.log("Downloader running")
);
