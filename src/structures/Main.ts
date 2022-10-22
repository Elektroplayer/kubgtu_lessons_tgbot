import TelegramBot from "node-telegram-bot-api";
import User from "./User.js";
import Group from "./Group.js";
import { readdirSync } from "fs";
import Event from "./Event.js";
import Scene from "./Scene.js";

export default class Main {
    /**
     * Объект бота
     */
    bot:TelegramBot = new TelegramBot(process.env.TOKEN, {polling: true});

    /**
     * Массив с пользователями, чтобы не загружать постоянно данные из БД.
     */
    users:User[] = [];

    /**
     * Массив с группами
     */
    groups:Group[] = [];


    /**
     * Массив с сценами
     */
    scenes:Scene[] = []

    constructor () {
        //this.bot.on();
    }

    run() {
        this.initEvents();
        this.initTimers();
        this.initScenes();
    }

    async initEvents() {
        for (let dirent of readdirSync("./dist/events", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;

            console.log(`Евент ${dirent.name}`);
        
            let eventClass = (await import("../events/" + dirent.name)).default;
            let event:Event = new eventClass();
            //this.bot.on(event.name, event.exec.bind(event));
            this.bot.on(event.name, event.exec.bind(event, this))
        }
    }

    async initScenes() {
        for (let dirent of readdirSync("./dist/scenes", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;

            console.log(`Сцена ${dirent.name}`);
        
            let sceneClass = (await import("../scenes/" + dirent.name)).default;
            let scene:Scene = new sceneClass();
            this.scenes.push(scene);
        }
    }

    initTimers() {
        console.log('Текст')
    }

    async getUser(userId: number) {
        let user = this.users.find(u => u.id == userId)

        if(user) return user
        else {
            let newUser = new User(userId, this);

            await newUser.initGroup()

            this.users.push(newUser);

            return newUser
        }
    }
}