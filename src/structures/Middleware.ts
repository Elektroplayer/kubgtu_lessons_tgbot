import { Message } from "node-telegram-bot-api";
import User from "./User.js";

export abstract class Middleware {
    type = 0; // 0 - перед сообщением; 1 - после сообщения

    abstract exec(user: User, msg: Message):void;
}