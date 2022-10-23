import User from "./User.js";
import { Message } from "node-telegram-bot-api";

export default abstract class Command {
    abstract name: string[];
    abstract sceneName: string[];

    abstract exec(user: User, msg: Message): void;
}