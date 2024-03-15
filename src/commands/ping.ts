/* eslint-disable jsdoc/require-jsdoc */
import {
  ChatInputCommandInteraction,
  Colors
} from "discord.js";

export default {
  data: {
    name: "ping",
    description: "Ping the bot"
  },
  chatInput: (interaction: ChatInputCommandInteraction): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      const wsPing = interaction.client.ws.ping == -1 ? 200 : interaction.client.ws.ping;
      const rtPing = Date.now() - interaction.createdTimestamp;
      const avg = (wsPing + rtPing) / 2;
      let status: string = "Good";
      let color: number = Colors.Blue;
      if (avg >= 250) {
        status = "Normal";
        color = Colors.Green;
        if (avg >= 300) {
          status = "Bad";
          color = Colors.Yellow;
          if (avg >= 500) {
            status = "Very Bad";
            color = Colors.Red;
          }
        }
      }

      interaction.reply({
        embeds: [
          {
            title: `🏓 Ping [${status}]`,
            fields: [
              {
                name: "WebSocket",
                value: `\`\`\`ts\n${wsPing}ms\`\`\``,
                inline: false
              },
              {
                name: "RealTime",
                value: `\`\`\`ts\n${rtPing}ms\`\`\``,
                inline: false
              }
            ],
            color: color
          }
        ]
      }).catch(reject);
    });
  }
};
