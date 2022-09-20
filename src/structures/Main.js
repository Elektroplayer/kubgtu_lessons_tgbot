import { readdirSync } from "fs";
import TelegramBot from "node-telegram-bot-api";
import UserStructure from "./User.js";
// eslint-disable-next-line no-unused-vars
import Command from "./Command.js";
// eslint-disable-next-line no-unused-vars
import Group from "./Group.js";

export default class Main {
    /**
     * Объект бота
     */
    bot = new TelegramBot(process.env.TOKEN, {polling: true});

    /**
     * Массив с командами
     * @type {Command[]}
     */
    commands = [];

    /**
     * Массив с пользователями, чтобы не загружать постоянно данные из БД.
     * @type {UserStructure[]}
     */
    users = [];

    /**
     * Массив с группами
     * @type {Group[]}
     */
    groups = [];

    /**
     * Загружает команды в бота
     */
    async loadCommands() {
        for (let dirent of readdirSync("./src/commands/", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;
        
            let commandClass = (await import("../commands/" + dirent.name)).default;
            let command = new commandClass();
            this.commands.push(command);
        }
    }

    /**
     * Загружает ивенты в бота
     */
    async loadEvents() {
        for (let dirent of readdirSync("./src/events/", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;
        
            let eventClass = (await import("../events/" + dirent.name)).default;
            let event = new eventClass(this);
            this.bot.on(event.name, event.exec.bind(event));
        }
    }

    /**
     * Возвращает пользователя. Если его нет, создаёт и добавляет его в массив.
     * @param {string} userId 
     * @returns {UserStructure}
     */
    async getUser(userId) {
        let user = this.users.find(u => u.id == userId);

        if(!user) {
            user = new UserStructure(userId, this);
            await user.getData();

            this.users.push(user);
        }

        return user;
    }
}