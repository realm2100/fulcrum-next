/* eslint-disable @typescript-eslint/no-explicit-any */

import fs from "fs";
import ExtendedClient from "./ExtendedClient";

export default class DB {
  client: ExtendedClient;
  private database: {
    [key: string]: any
  };
  constructor(client: ExtendedClient) {
    this.client = client;
    this.database = {};
    this.loadFromFile().then((dbStr) => {
      this.database = JSON.parse(dbStr);
    }).catch((err) => {
      this.client.log("error", err);
    });
  }

  public get(path: string): Promise<any> {
    return new Promise((resolve, _reject) => {
      if (!path) {
        this.all().then(resolve);
      }
      path = path.trim();
      const pathSplit = path.split(".").map((x) => {
        return x.trim();
      }).filter((x) => {
        return x;
      });
      let currentDirectory: any = this.database;
      for (let i = 0; i < pathSplit.length; i++) {
        if (currentDirectory[pathSplit[i]]) {
          currentDirectory = currentDirectory[pathSplit[i]];
        } else {
          return resolve(null);
        }
      }
      resolve(currentDirectory);
    });
  }

  public set(path: string, data: any): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      if (!path) {
        resolve(false);
      }
      path = path.trim();
      const pathSplit = path.split(".").map((x) => {
        return x.trim();
      }).filter((x) => {
        return x;
      });
      let currentDirectory: any = this.database;
      for (let i = 0; i < pathSplit.length; i++) {
        if (i == pathSplit.length - 1) {
          currentDirectory[pathSplit[i]] = data;
          break;
        }
        if (currentDirectory[pathSplit[i]] && typeof currentDirectory[pathSplit[i]] !== "object") {
          currentDirectory[pathSplit[i]] = {};
        }
        currentDirectory[pathSplit[i]] = currentDirectory[pathSplit[i]] ?? {};
        currentDirectory = currentDirectory[pathSplit[i]];
      }
      this.saveToFile().then(() => {
        resolve(true);
      }).catch((err) => {
        this.client.log("error", err);
        resolve(false);
      });
    });
  }

  public all(): Promise<string> {
    return new Promise((resolve, _reject) => {
      resolve(JSON.stringify(this.database, null, 2));
    });
  }

  public clear(): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      this.database = {};
      this.saveToFile().then(() => {
        resolve(true);
      }).catch((err) => {
        this.client.log("error", err);
        resolve(false);
      });
    });
  }

  private saveToFile(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        fs.writeFile(`${__dirname}/../db.json`, JSON.stringify(this.database, null, 2), (err) => {
          if (err) {
            reject(err);
          }
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

  private loadFromFile(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(`${__dirname}/../db.json`, (err, data) => {
          if (err) {
            return reject(err);
          }
          resolve(data.toString());
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
