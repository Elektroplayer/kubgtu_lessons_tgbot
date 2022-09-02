import { config } from 'dotenv'
import { Telegraf, Markup } from 'telegraf'
import fetch from "node-fetch"
import https from "https"
import { parse } from "node-html-parser"

config() // Инициализация переменных среды

// Класс парсера делал отдельно. Потом было удобнее просто его вставить почти без изменений, чем убирать класс и строить обычные функции
class Main {
    /**
     * @param {number} fakid ID факультета
     * @param {number} kurs Курс
     * @param {number} semestr Семестр
     * @param {string} group Полный номер группы
     */
    constructor(fakid, kurs, semestr, group = '22-КБ-ИВ1') { // Конструктор делает ссылку, к которой будем обращаться
        this.URL = `https://elkaf.kubstu.ru/timetable/default/time-table-student-ofo?iskiosk=0&fak_id=${fakid}&kurs=${kurs}&gr=${group}&ugod=${new Date().getFullYear()}&semestr=${semestr}`
    }

    /**
     * Возвращает строку с парами в указанный день
     * Без аргументов даёт пары в сегодняшний день
     * @param {number} day 
     * @param {boolean} week 
     * @returns {string}
     */
    async getLessons(day = new Date().getDay(), week = this.evenWeek()) {
        this.even = week ? 2 : 1
        this.day  = day

        if(this.day>7) {
            this.day = 0
            this.even = this.even == 1 ? 2 : 1
        }

        let res = await fetch(this.URL, {
            headers: {
                'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
            },
            agent
        })

        let text = await res.text()
        this.root = parse(text)

        let responseText = `<b>${this.dayName(this.day)} / ${this.even == 2 ? 'Чётная' : 'Нечётная'} неделя</b>\n`

        for(let i=1;;i++) {
            if(!this.getLesson(this.even, this.day, i) && i == 1) {
                responseText += '\nПар нет! Передохни:з'
                break
            }
            if(!this.getLesson(this.even, this.day, i)) break

            responseText += '\n' + this.getLesson(this.even, this.day, i)
        }

        return responseText
    }

    /**
     * Возвращает строку с днём недели по номеру этого дня недели
     * @param {number} day 
     * @returns {string}
     */
    dayName(day) {
        let days = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА']
        return days[day]
    }

    /**
     * Возвращает true если неделя чётная
     * @returns {boolean}
     */
    evenWeek() {
        let date  = new Date()
        let now   = date.getTime();
        let today = new Date(date.getFullYear(), date.getMonth(), 0).getTime(); 
        let week  = Math.ceil((now - today) / (1000 * 60 * 60 * 24 * 7)); 
        
        return week%2 == 0
    }

    /**
     * Возвращает строку с информацией об одной указанной паре
     * @param {number} week 
     * @param {number} day 
     * @param {number} num 
     * @returns {string}
     */
    getLesson(week, day, num) {
        if(!this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)) return null

        return this.root.querySelector(`#collapse_n_${week}_d_${day}_i_${num}`)
        .querySelector('.panel-body')
        .childNodes
        .filter(elm => elm?.constructor?.name == 'HTMLElement')
        .reduce((text, elm) => {
            return text + '  ' + elm.text + '\n'
        }, this.root.querySelector(`#heading_n_${week}_d_${day}_i_${num}`).text.trim() + '\n' )
    }
}

const bot    = new Telegraf(process.env.TOKEN) // Создание объекта бота
const agent  = new https.Agent({ rejectUnauthorized: false }) // Для отклонения аутентификации
let main     = new Main(516, 1, 1) // Класс парсера

// Нужно для самих кнопок и чтобы они нажимались
const days = ['Нечёт Пн', 'Нечёт Вт', 'Нечёт Ср', 'Нечёт Чт', 'Нечёт Пт', 'Нечёт Сб']
const daysEven = ['Чёт Пн', 'Чёт Вт', 'Чёт Ср', 'Чёт Чт', 'Чёт Пт', 'Чёт Сб']

function buttons() { // Возвращает обычные кнопки
    return Markup.keyboard([
        ['Расписание на сегодня', 'Расписание на завтра'],
        ['Выбрать другой день']
    ]).resize()
}

function anotherDay() { // Возвращает кнопки, которые используются для выбора дня
    return Markup.keyboard([
        days,
        daysEven
    ]).resize()
}

// При вводе команды /start
bot.start(async (ctx) => {
    ctx.reply(
        'Здарова. Показываю расписание для группы 22-КБ-ИВ1.',
        buttons()
    )
})

// Остальное при вводе текста
bot.hears('Расписание на сегодня', async (ctx) => {
    let text = await main.getLessons()
    ctx.replyWithHTML(text, buttons())
})

bot.hears('Расписание на завтра', async (ctx) => {
    let text = await main.getLessons(new Date().getDay() + 1)
    ctx.replyWithHTML(text, buttons())
})

bot.hears('Выбрать другой день', async (ctx) => {
    ctx.replyWithHTML('Выбери день', anotherDay())
})

// Это сделано для выбора конкретного дня
days.forEach((elm, i) => {
    bot.hears(elm, async (ctx) => {
        let text = await main.getLessons(i + 1, false)
        ctx.replyWithHTML(text, buttons())
    })
})

daysEven.forEach((elm, i) => {
    bot.hears(elm, async (ctx) => {
        let text = await main.getLessons(i + 1, true)
        ctx.replyWithHTML(text, buttons())
    })
})

// Это если человек херню сморозил
bot.on('text', ctx => {
    ctx.reply('Не понял тебя, попробуй ещё раз', buttons())
})

bot.launch() // Запуск бота