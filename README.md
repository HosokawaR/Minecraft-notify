# Minecraft-notify

Notify the entry and exit of Minecraft

## Setup

Set the following environment variables.

```console
LOG_PATH=/opt/minecraft_server/logs/latest.log
WEBHOOK_URL=https://discord.com/api/webhooks/xxxxxxxxxxxxxxxxxxxxxx/slack
ENABLE_COMMENT_NOTIFICATION=1  # 0: disable, 1: enable
```

## Run

```console
deno run --allow-net --allow-read --allow-env --unstable https://raw.githubusercontent.com/HosokawaR/Minecraft-notify/main/main.ts
```

If you want to run it in the background, use `nohup`.

```console
nohup deno run --allow-net --allow-read --allow-env --unstable https://raw.githubusercontent.com/HosokawaR/Minecraft-notify/main/main.ts &
```
