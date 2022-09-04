import Users from "../models/Users.js";
import Parser from "./Parser.js";

export default class User {
    inst_id = 0;
    kurs = 0;
    group = "";

    /**
     * @type {Parser}
     */
    lessons = null;

    /**
     * @param {String} userID 
     */
    constructor (userID) {
        this.id = userID;
    }

    async getData() {
        let model = await Users.findOne({userID: this.id}).exec();

        if(model && model?.inst_id && model?.kurs && model?.group) {
            this.inst_id = model.inst_id;
            this.kurs = model.kurs;
            this.group = model.group;

            this.lessons = new Parser(this.inst_id, this.kurs, this.group);
        }
    }

    async updateData() {
        this.lessons = new Parser(this.inst_id, this.kurs, this.group);

        let model = await Users.findOne({userID: this.id}).exec();

        if(!model) {
            model = new Users({
                userId: this.id,
                inst_id: this.inst_id,
                kurs: this.kurs,
                group: this.group
            });

            return model.save().catch(err => console.log(err));
        }

        model.inst_id = this.inst_id;
        model.kurs = this.kurs;
        model.group = this.group;

        model.save().catch(err => console.log(err));
    }
}