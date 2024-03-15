/* eslint-disable jsdoc/require-jsdoc */
import {
  ChatInputCommandInteraction
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

export default {
  data: {
    name: "restart",
    description: "Restart the bot"
  },
  chatInput: (interaction: ChatInputCommandInteraction): Promise<unknown> => {
    const client = interaction.client as ExtendedClient;
    return new Promise((resolve, reject) => {
      interaction.reply({
        ephemeral: true,
        embeds: [
          {
            title: "Restarting...",
            color: client.accent
          }
        ]
      }).then(() => {
        client.kill();
      }).catch(reject);
    });
  }
};
