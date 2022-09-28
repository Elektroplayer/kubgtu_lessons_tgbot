import Users from "../models/Users.js";
import Group from "./Group.js";
// eslint-disable-next-line no-unused-vars
import Main from "./Main.js";

export default class User {
    inst_id = 0;
    kurs = 0;
    group = "";
    dbResponse = null;
    count = 20;

    /**
     * @type {Group | null}
     */
    groupClass = null;

    /**
     * Класс пользователя
     * @param {String} userID 
     * @param {Main} main
     */
    constructor (userID, main) {
        this.id = userID;
        this.main = main;
    }

    /**
     * Возвращает строку с парами в указанный день
     * Без аргументов даёт пары в сегодняшний день
     * @param {number} day 
     * @param {boolean} week 
     * @returns {string | null}
    */
    async getSchedule(day = new Date().getDay(), week = new Date().getWeek()%2==0) {
        if(!this.group) return null;
        if(!this.groupClass.dbResponse || new Date() - this.groupClass.dbResponse.updateDate > 1000 * 60 * 60 * 24) {
            let r = await this.groupClass.getDbResponse();
            if (r != 0) return "Произошла ошибка! Повторите попытку позже!";
        }

        let daySchedule = this.groupClass.dbResponse.data.find(elm => elm.daynum == day && elm.even == week)?.schedule ?? [];
        let out = "";

        daySchedule.forEach(elm => {
            out += `\n${elm.number} пара: ${elm.name} [${elm.paraType}]\n  Время: ${elm.time}`;
            if(elm.teacher) out += `\n  Преподаватель: ${elm.teacher}`;
            if(elm.auditory) out += `\n  Аудитория: ${elm.auditory}`;
            if(elm.percent) out += `\n  Процент группы: ${elm.percent}`;
            if(elm.flow) out += "\n  В лекционном потоке";
            if(elm.remark) out += `\n  Примечание: ${elm.remark}`;

            out += "\n";
        });

        return `<b>${this.groupClass.parser.dayName(day)} / ${week ? "Чётная" : "Нечётная"} неделя</b>\n` + (!out ? "\nПар нет! Передохни:з" : out);
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
            
            if(!this.main.groups.find(elm => elm.name == this.group)) this.main.groups.push(new Group(this.inst_id, this.kurs, this.group));

            this.groupClass = this.main.groups.find(elm => elm.name == this.group);
            
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
        if(!this.main.groups.find(elm => elm.name == this.group)) this.main.groups.push(new Group(this.inst_id, this.kurs, this.group));

        this.groupClass = this.main.groups.find(elm => elm.name == this.group);

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