import { ActivityType } from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

/**
 * Fires when the client is ready
 * @example
 * none
 */
export default (client: ExtendedClient) => {
  // client.uploadCommands();
  client.user?.setPresence({
    activities: [{
      name: "the stars",
      type: ActivityType.Watching
    }],
    status: "idle"
  });
};
