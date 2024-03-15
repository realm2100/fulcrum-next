import {
  ChatInputCommandInteraction,
  Colors
} from "discord.js";
import ExtendedClient from "../classes/ExtendedClient";

/**
 * Recieves ChatInputCommandInteraction and passes it to the correct command
 * @example
 * ```ts
 * chatInputCommandHandler(interaction);
 * => // client.commands[interaction.commandName].chatInput(interaction);
 * ```
 */
export default (interaction: ChatInputCommandInteraction<"cached">) => {
  const client = interaction.client as ExtendedClient;
  const command = client.commands.get(interaction.commandName);
  if (!command) {
    return interaction.reply({
      content: "존재하지 않는 커맨드입니다.",
      ephemeral: true
    });
  }
  let canRun = true;
  if (command.options?.whitelist) {
    canRun = false;
    if (command.options.whitelist.includes(interaction.user.id)) {
      canRun = true;
    }
  } else if (command.options?.permissions) {
    canRun = false;
    if (interaction.member.permissions.has(command.options.permissions)) {
      canRun = true;
    }
  }
  if (!canRun) {
    return interaction.reply({
      content: "이 커맨드를 사용할 권한이 없습니다.",
      ephemeral: true
    });
  }
  if (command.options?.cooldown) {
    const cooldown = client.cooldowns.get(`${interaction.user.id}-${interaction.commandName}`) ?? 0;
    if (Date.now() < cooldown) {
      return interaction.reply({
        ephemeral: true, embeds: [{
          title: "쿨다운",
          description: `<t:${Math.ceil(cooldown / 1000)}:R>에 다시 시도해주세요.`,
          color: Colors.Yellow
        }]
      });
    }
    client.cooldowns.set(`${interaction.commandName}-${interaction.user.id}`, Date.now() + command.options.cooldown);
  }
  try {
    command.chatInput(interaction).catch((e) => {
      interaction.reply({
        embeds: [{
          title: `Error -> ${interaction.commandName}`,
          description: `\`\`\`js\n${e.toString().slice(0, 2000)}\`\`\``,
          color: Colors.Red
        }],
        components: []
      });
      console.error(interaction.commandName, e);
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      interaction.reply({
        embeds: [{
          title: `Error -> ${interaction.commandName}`,
          description: `\`\`\`js\n${e.message.slice(0, 2000)}\`\`\``,
          color: Colors.Red
        }],
        components: []
      });
      console.error(interaction.commandName, e);
    }
  }
};
