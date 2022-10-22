import TelegramBot from "node-telegram-bot-api";
import Main from "./Main.js";

export default abstract class Event {
    //abstract name: (MessageType | 'message') | ('callback_query') | ('inline_query') | ('poll_answer') | 'chat_member' | 'my_chat_member' | "polling_error" | "webhook_error" | "error";

    abstract name: BotEvents;

    abstract exec(main:Main, ...args: any[]): void;
}