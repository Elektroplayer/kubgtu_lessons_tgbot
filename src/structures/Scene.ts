import { readdirSync } from "fs";
import Command from "./Command.js";
import Query from "./Query.js";

export default abstract class Scene {
    abstract name: string;
    commands: Command[];
    queryes: Query[]

    constructor() {
        this.commands = [];
        this.queryes = [];

        this.importCommands();
        this.importQueryes();
    }

    async importQueryes() {
        for (let dirent of readdirSync("./dist/scenes/queryes/", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;
        
            let queryClass = (await import("../scenes/queryes/" + dirent.name)).default;
            let query:Query = new queryClass();

            if(query.sceneName == this.name) this.queryes.push(query);
        }
    }

    async importCommands() {
        for (let dirent of readdirSync("./dist/scenes/commands/", {withFileTypes: true})) {
            if (!dirent.name.endsWith(".js")) continue;
        
            let commandClass = (await import("../scenes/commands/" + dirent.name)).default;
            let command:Command = new commandClass();

            if(command.sceneName.length == 0 || command.sceneName.includes(this.name)) this.commands.push(command);
        }
    }
}