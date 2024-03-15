import {
  BaseInteraction
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

/**
 * Recieves BaseInteraction and passes it to the correct handler
 * @example
 * ```ts
 * interactionHandler(interaction: ChatInputCommandInteraction);
 * => // chatInputCommandHandler(interaction);
 * ```
 */
export default (interaction: BaseInteraction<"cached">) => {
  const client = interaction.client as ExtendedClient;
  if (interaction.isChatInputCommand()) {
    client.handlers.chatInputCommandHandler(interaction);
  } /* else if (interaction.isAutocomplete()) {
    client.handlers.autocompleteHandler(interaction);
  } else if (interaction.isButton()) {
    client.handlers.buttonHandler(interaction);
  } else if (interaction.isAnySelectMenu()) {
    client.handlers.selectMenuHandler(interaction);
  } else if (interaction.isModalSubmit()) {
    client.handlers.modalSubmitHandler(interaction);
  }*/
};
