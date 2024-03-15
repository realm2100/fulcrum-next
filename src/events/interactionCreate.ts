import {
  BaseInteraction
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

/**
 * Recieves interactionCreate event and passes it to the interaction handler
 * @example
 * ```ts
 * client.on("interactionCreate", (interaction) => {
 *  interactionCreate(interaction);
 * })
 * ```
 */
export default (interaction: BaseInteraction<"cached">) => {
  const client = interaction.client as ExtendedClient;
  client.handlers.interactionHandler(interaction);
};
