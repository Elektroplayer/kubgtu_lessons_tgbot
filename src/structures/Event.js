// eslint-disable-next-line no-unused-vars
import Main from "./Main.js";

export default class Event {
    /**
     * Имя ивента
     * @type {string}
     */
    name = "";

    /**
     * Класс ивента
     * @param {Main} main 
     */
    constructor(main) {
        this.main = main;
    }

    exec() {
        console.log("Перепроверь бота");
    }
}