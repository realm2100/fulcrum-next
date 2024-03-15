/* eslint-disable jsdoc/require-jsdoc */
import {
  ChatInputCommandInteraction
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

export default {
  data: {
    name: "test",
    description: "test command"
  },
  chatInput: (interaction: ChatInputCommandInteraction): Promise<unknown> => {
    const client = interaction.client as ExtendedClient;
    return new Promise((resolve, reject) => {
      interaction.reply("test");
    });
  }
};
