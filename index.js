require("dotenv").config();


const express = require("express");
const cors = require("cors");
const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

const app = express();
app.use(cors());

const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

app.get("/", (req, res) => {
  res.send("Agora token server is running");
});

app.get("/rtc-token", (req, res) => {
  const channelName = req.query.channelName;
  const uid = Number(req.query.uid || 0);

  if (!APP_ID || !APP_CERTIFICATE) {
    return res.status(500).json({
      error: "Missing AGORA_APP_ID or AGORA_APP_CERTIFICATE",
    });
  }

  if (!channelName) {
    return res.status(400).json({
      error: "channelName is required",
    });
  }

  const role = RtcRole.PUBLISHER;
  const expireTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expireTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return res.json({
    appId: APP_ID,
    token,
    channelName,
    uid,
    expiresIn: expireTimeInSeconds,
  });
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Agora token server running on port ${PORT}`);
});