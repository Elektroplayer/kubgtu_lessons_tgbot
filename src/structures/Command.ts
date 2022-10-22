import User from "./User.js";
import Main from "./Main.js";
import { Message } from "node-telegram-bot-api";

export default abstract class Command {
    abstract name: string[];
    abstract sceneName: string[];

    abstract exec(main: Main, user: User, msg: Message): void;
}