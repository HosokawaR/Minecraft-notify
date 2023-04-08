import * as tail from "https://deno.land/x/tail@1.1.0/mod.ts";

const webhookUrl = Deno.env.get("WEBHOOK_URL");
const logPath = Deno.env.get("LOG_PATH");
const enableCommentNotification = Boolean(
  Deno.env.get("ENABLE_COMMENT_NOTIFICATION"),
);

if (!webhookUrl) throw new Error("WEBHOOK_URL is not set.");
if (!logPath) throw new Error("LOG_PATH is not set.");

const sendWebhook = async (message: string) => {
  await fetch(webhookUrl, {
    method: "POST",
    body: JSON.stringify({
      text: message,
    }),
  });
};

let t: tail.Tail | undefined = undefined;

const watch = async () => {
  t?.stop();
  t = new tail.Tail(logPath);

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

    const commentMatched = line.match(/.*?thread\/INFO]: <(.*?)> (.*)/);
    if (enableCommentNotification && commentMatched) {
      const playerName = commentMatched[1];
      const comment = commentMatched[2];
      sendWebhook(`${playerName} 「${comment}」`);
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
