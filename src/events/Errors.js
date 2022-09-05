import Event from "../structures/Event.js";

export default class PollingErrorsEvent extends Event {
    name = "polling_error";

    exec(err) {
        console.log(err);
    }
}