import Event from "../structures/Event.js"
import Main from "../structures/Main.js";

export default class MessageEvent extends Event {
    name = "polling_error" as BotEvents;

    exec(main:Main, err: Error): void {
        console.log(err)
    }

}

