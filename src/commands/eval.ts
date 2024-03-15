/* eslint-disable jsdoc/require-jsdoc */
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Colors
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";
import Bun from "bun";

export default {
  data: {
    name: "eval",
    description: "Evaluate some code",
    options: [
      {
        name: "code",
        description: "code to evaluate",
        type: ApplicationCommandOptionType.String,
        required: true
      },
      {
        name: "ephemeral",
        description: "whether to make results ephemeral",
        type: ApplicationCommandOptionType.Boolean,
        required: false
      }
    ],
  },
  options: {
    whitelist: ["285229678443102218"],
    guilds: ["1176759489366589550"]
  },
  chatInput: (interaction: ChatInputCommandInteraction): Promise<unknown> => {
    return new Promise((_resolve, reject) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const client = interaction.client as ExtendedClient;
      const code = interaction.options.getString("code", true);
      interaction.deferReply({
        ephemeral: interaction.options.getBoolean("ephemeral", false) ?? true
      }).then(async() => {
        try {
          const startTime = Bun.nanoseconds();
          let evaled = await eval(code);
          const endTime = Bun.nanoseconds() - startTime;
          if (typeof evaled !== "string") {
            evaled = require("util").inspect(evaled);
          } else {
            evaled = `${evaled}`;
          }
          let timeString = `${endTime}ns`;
          if (endTime > 1_000) {
            timeString = `${endTime / 1_000_000}ms`;
          }
          interaction.editReply({
            embeds: [{
              title: "Eval Success",
              fields: [{
                name: "Input",
                value: `\`\`\`ts\n${code}\`\`\``,
                inline: false
              },
              {
                name: "Output",
                value: `\`\`\`ts\n${evaled.slice(0, 1000)}\`\`\``,
                inline: false
              }],
              footer: {
                text: timeString
              },
              color: Colors.Blue
            }]
          });
        } catch (e) {
          interaction.editReply({
            embeds: [{
              title: "Eval Failed",
              fields: [{
                name: "Input",
                value: `\`\`\`ts\n${code}\`\`\``,
                inline: false
              },
              {
                name: "Error",
                value: `\`\`\`ts\n${(e instanceof Error ? `${e.message}\n${e.stack}` : e as string).slice(0, 1000)}\`\`\``,
                inline: false
              }],
              color: Colors.Red
            }]
          });
        }
      }).catch((e) => {
        reject(e);
      });
    });
  },
};
