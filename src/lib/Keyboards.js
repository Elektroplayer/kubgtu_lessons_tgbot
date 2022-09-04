import { days, daysEven } from "./Utils.js";

export let instKeyboard = [
    [
        {
            "text": "ИКСиИБ",
            "callback_data": "settings_inst_516"
        }
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