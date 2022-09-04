import { days, daysEven } from "./Utils.js";

export let instKeyboard = [
    [
        {
            "text": "ИНГЭ",
            "callback_data": "settings_inst_495"
        },{
            "text": "ИКСиИБ",
            "callback_data": "settings_inst_516"
        },{
            "text": "ИПиПП",
            "callback_data": "settings_inst_490"
        },{
            "text": "ИЭУБ",
            "callback_data": "settings_inst_29"
        }
    ],[
        {
            "text": "ИСТИ",
            "callback_data": "settings_inst_538"
        },{
            "text": "ИМРИТТС",
            "callback_data": "settings_inst_539"
        },{
            "text": "ИФН",
            "callback_data": "settings_inst_540"
        },{
            "text": "ИТК",
            "callback_data": "settings_inst_541"
        },
    ]
];

export const kursKeyboard = [
    [
        {
            "text": "1",
            "callback_data": "settings_kurs_1"
        },{
            "text": "2",
            "callback_data": "settings_kurs_2"
        },{
            "text": "3",
            "callback_data": "settings_kurs_3"
        },{
            "text": "4",
            "callback_data": "settings_kurs_4"
        },{
            "text": "5",
            "callback_data": "settings_kurs_5"
        },{
            "text": "6",
            "callback_data": "settings_kurs_6"
        },
    ]
];

export const mainKeyboard = [
    [
        {
            text: "Расписание на сегодня",
        },{
            text: "Расписание на завтра",
        }
    ],[
        {
            text: "Выбрать другой день"
        }
    ]
];

export const anotherDay = [
    days.slice().map(elm => { return { text: elm }; }),
    daysEven.slice().map(elm => { return { text: elm }; })
];

export default {
    instKeyboard,
    kursKeyboard,
    mainKeyboard,
    anotherDay
};