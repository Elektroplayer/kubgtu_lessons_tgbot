import Users from "../models/Users.js";
import Parser from "./Parser.js";

export default class User {
    inst_id = 0;
    kurs = 0;
    group = "";

    /**
     * Класс, реализующий парсинг расписания
     * @type {Parser | null}
     */
    lessons = null;

    /**
     * Класс пользователя
     * @param {String} userID 
     */
    constructor (userID) {
        this.id = userID;
    }

    /**
     * Реализует восстановление данных их БД
     */
    async getData() {
        let model = await Users.findOne({userId: this.id}).exec();

        if(model && model?.inst_id && model?.kurs && model?.group) {
            this.inst_id = model.inst_id;
            this.kurs = model.kurs;
            this.group = model.group;

            this.lessons = new Parser(this.inst_id, this.kurs, this.group);
        }
    }

    /**
     * Локально очищает данные
     */
    clearData() {
        this.inst_id = 0;
        this.kurs = 0;
        this.group = "";
    }

    /**
     *  Обновление данных на БД
     */
    async updateData() {
        this.lessons = new Parser(this.inst_id, this.kurs, this.group);

        let model = await Users.findOne({userId: this.id}).exec();

        if(!model) {
            model = new Users({
                userId: this.id,
                inst_id: this.inst_id,
                kurs: this.kurs,
                group: this.group
            });
        } else {
            model.inst_id = this.inst_id;
            model.kurs = this.kurs;
            model.group = this.group;
        }

        model.save().catch(err => console.log(err));
    }
}