import Scene from "./Scene.js";
import Group from "./Group.js";
import Users from "../models/Users.js";
import Main from "./Main.js";

export default class User {
    /**
     * ID человека
     */
    id: number;

    /**
     * Сцена с командами
     */
    scene?: Scene;

    /**
     * Группа человека
     */
    group?: Group;

    /**
     * Используется для временного хранения данных при настройке
     */
    dataBuffer: {
        id: number,
        inst_id?: number,
        kurs?: number
    }[] = []

    main: Main;

    /**
     * Класс человека в котором содержится класс группы
     */
    constructor(userId:string | number, main: Main) {
        this.id = +userId;
        this.main = main;
    }

    /**
     * Инициализация группы
     */
    async initGroup() {
        let userData = await Users.findOne({userId: this.id}).exec()

        if(!userData) return;

        if(userData.inst_id && userData.kurs && userData.group) this.setGroup(userData.group, userData.kurs, userData.inst_id)
    }

    /**
     * Обновление данных
     */
    async updateData(opt: { instId: number, kurs: number, group: string }) {
        let userData = await Users.findOne({userId: this.id}).exec()

        if(userData) {
            userData.inst_id = opt.instId;
            userData.kurs = opt.kurs;
            userData.group = opt.group;

            userData.save().catch(console.log);
        } else {
            new Users({
                userId: this.id,
                inst_id: opt.instId,
                kurs: opt.kurs,
                group: opt.group
            }).save().catch(console.log);
        }

        this.setGroup(opt.group, opt.kurs, opt.instId)
    }

    /**
     * Устновка текущей группы у человека
     */
    setGroup(group:string, kurs: number | string, inst_id:number | string) {
        let groupClass = this.main.groups.find(g => g.name == group)

        if(!groupClass) {
            let newGroup = new Group(group, +kurs, +inst_id);

            this.main.groups.push(newGroup);

            this.group = newGroup;
        } else this.group = groupClass;
    }
}