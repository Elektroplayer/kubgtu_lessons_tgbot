import { readdirSync } from "fs";
import Event from "./Event.js";
import Scene from "./Scene.js";
import Cache from "../lib/Cache.js";

export default class Main {
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
        for (let dirent of readdirSync("./dist/scenes", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;

            console.log(`Сцена ${dirent.name}`);
        
            let sceneClass = (await import("../scenes/" + dirent.name)).default;
            let scene:Scene = new sceneClass();
            Cache.scenes.push(scene);
        }
    }

    initTimers() {
        console.log('Таймеры')
    }
}