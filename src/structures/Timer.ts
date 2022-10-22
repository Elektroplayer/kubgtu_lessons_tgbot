import Main from "./Main.js";

export default abstract class Timer {
    /**
     * Время в милисекундах
     */
    abstract time: number;
    main: Main

    constructor(main: Main) {
        this.main = main
    }

    abstract exec(): void;
}