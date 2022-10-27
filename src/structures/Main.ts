import { readdirSync } from "fs";
import Event from "./Event.js";
import Scene from "./Scene.js";
import Cache from "../lib/Cache.js";

export default class Main {
    scenesNames = ["main", "settings"];

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
            Cache.bot.on(event.name, event.exec)
        }
    }

    async initScenes() {
        this.scenesNames.forEach(sceneName => {
            console.log(`Сцена ${sceneName}`);

            Cache.scenes.push(new Scene(sceneName));
        })
    }

    initTimers() {
        console.log('Таймеры')
    }
}