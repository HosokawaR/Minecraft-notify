import * as tail from "https://deno.land/x/tail@1.1.0/mod.ts";
import { LOG_PATH, WEBHOOK_URL } from "./config.ts";

const sendWebhook = async (message: string) => {
  await fetch(WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      text: message,
    }),
  });
};

let t: tail.Tail | undefined = undefined;

const watch = async () => {
  t?.stop();
  t = new tail.Tail(LOG_PATH);

  for await (const line of t.start()) {
    const joinMatched = line.match(/.*?thread\/INFO]: (.*?) joined/);
    if (joinMatched) {
      const playerName = joinMatched[1];
      sendWebhook(`${playerName} joined the Minecraft server.`);
    }
    const leftMatched = line.match(/.*?thread\/INFO]: (.*?) left/);
    if (leftMatched) {
      const playerName = leftMatched[1];
      sendWebhook(`${playerName} left the Minecraft server.`);
    }
  }
};

// Workaround
// Minecraft server log file is regenerated every day.
// However, tail() dose not work for files created after the tail instance is created.
setInterval(async () => {
  await watch();
}, 1000 * 60 * 10);

await watch();
