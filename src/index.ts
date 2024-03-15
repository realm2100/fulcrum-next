/* eslint-disable jsdoc/require-jsdoc */
import ExtendedClient from "./classes/ExtendedClient";

const client = new ExtendedClient({
  intents: [
    "Guilds",
    "GuildMembers",
    "GuildModeration",
    "GuildMessages",
    "MessageContent"
  ]
});

process.on("uncaughtException", (err: string | Error) => {
  client.log("error", err);
});

process.on("unhandledRejection", (err: string | Error) => {
  client.log("error", err);
});

client.on("error", (err: Error) => {
  client.log("error", err);
});

client.login(process.env.BOT_TOKEN);
