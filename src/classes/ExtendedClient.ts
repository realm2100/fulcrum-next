import fs from "fs";

import {
  AnySelectMenuInteraction,
  ApplicationCommand,
  ApplicationCommandData,
  AutocompleteInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  Client,
  ClientOptions,
  Collection,
  Colors,
  ModalSubmitInteraction,
  PermissionResolvable,
  Snowflake
} from "discord.js";
import DB from "./db";

export type Command = {
  data: ApplicationCommandData
  options?: {
    whitelist?: string[];
    permissions?: PermissionResolvable[];
    guilds?: string[];
    cooldown?: number;
  }
  chatInput: (interaction: ChatInputCommandInteraction) => Promise<unknown>;
  button?: (interaction: ButtonInteraction) => Promise<unknown>;
  selectMenu?: (interaction: AnySelectMenuInteraction) => Promise<unknown>;
  modalSubmit?: (interaction: ModalSubmitInteraction) => Promise<unknown>;
  autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>;
}

export type Event = (...args: unknown[]) => Promise<unknown>;
export type Handler = (...args: unknown[]) => Promise<unknown>;

export default class ExtendedClient extends Client {
  kill: () => void;
  commands: Collection<string, Command>;
  cooldowns: Collection<string, number>;
  handlers: {
    [key: string]: Handler
  };
  events: {
    [key: string]: Event
  };
  db: DB;
  accent: number;

  public constructor(options: ClientOptions) {
    super(options);
    // eslint-disable-next-line jsdoc/require-jsdoc
    this.kill = () => {
      process.exit(0);
    };
    this.commands = new Collection();
    this.cooldowns = new Collection();
    this.handlers = {};
    this.events = {};
    this.db = new DB(this);
    this.accent = 15761185;

    this.loadEvents().then(() => {
      for (const event in this.events) {
        this.on(event, (...args) => {
          this.events[event](...args);
        });
        this.loadCommands().catch((err) => {
          this.log("error", err);
        });
        this.loadHandlers().catch((err) => {
          this.log("error", err);
        });
      }
    }).catch((err) => {
      this.log("error", err);
    });
  }

  public log(type: "log" | "warn" | "error", data: string | Error): void {
    if (!type) {
      return;
    }
    console[type](data);
    if (!this.user) {
      return console.warn("ClientUser unavailable, logging to console instead");
    }
    this.users.fetch("285229678443102218").then((user) => {
      user.send({
        embeds: [{
          title: `${type.toUpperCase()}`,
          description: `\`\`\`ts\n${(data instanceof Error ? `${data.message}\n${data.stack}` : data).slice(0, 4000)}\`\`\``,
          color: {
            log: Colors.Grey,
            warn: Colors.Yellow,
            error: Colors.Red
          }[type],
          timestamp: new Date().toISOString()
        }]
      }).catch(() => {
        console.error("Failed to send log to owner.");
      });
    });
  }

  public uploadCommands(): Promise<Collection<Snowflake, ApplicationCommand>> {
    return new Promise((resolve, reject) => {
      const commands = this.commands.map((command) => {
        return command.data;
      });
      this.application?.commands.set(commands).then((cmds) => {
        return resolve(cmds);
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  public loadCommands(): Promise<typeof this.commands> {
    return new Promise((resolve, reject) => {
      fs.readdir("./src/commands", (err, files) => {
        if (err) {
          return reject(err);
        }
        for (const file of files) {
          if (file.endsWith(".ts")) {
            try {
              const command: Command = require(`../commands/${file}`).default;
              this.commands.set(command.data.name, command);
            } catch (e) {
              return reject(e);
            }
          }
        }
        return resolve(this.commands);
      });
    });
  }

  private loadEvents(): Promise<typeof this.events> {
    return new Promise((resolve, reject) => {
      fs.readdir("./src/events", (err, files) => {
        if (err) {
          return reject(err);
        }
        for (const file of files) {
          if (file.endsWith(".ts")) {
            try {
              const event: Event = require(`../events/${file}`).default;
              this.events[file.replace(".ts", "")] = event;
            } catch (e) {
              return reject(e);
            }
          }
        }
        return resolve(this.events);
      });
    });
  }

  private loadHandlers(): Promise<typeof this.handlers> {
    return new Promise((resolve, reject) => {
      fs.readdir("./src/handlers", (err, files) => {
        if (err) {
          return reject(err);
        }
        for (const file of files) {
          if (file.endsWith(".ts")) {
            try {
              const handler: Handler = require(`../handlers/${file}`).default;
              this.handlers[file.replace(".ts", "")] = handler;
            } catch (e) {
              return reject(e);
            }
          }
        }
        return resolve(this.handlers);
      });
    });
  }
}
