import { CallbackQuery } from "node-telegram-bot-api";
import Main from "./Main.js";
import User from "./User.js";

export default abstract class Query {
    abstract name: string[];
    abstract sceneName: string;

    abstract exec(main: Main, user: User, query: CallbackQuery): void;
}