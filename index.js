import { config } from 'dotenv'
import { Telegraf, Markup } from 'telegraf'
import fetch from "node-fetch"
import https from "https"
import { parse } from "node-html-parser"

config() // Инициализация переменных среды

class Main {
    /**
     * @param {string[]} args 
     * @param {Number} kurs 
     * @param {Number} semestr 
     * @param {string} group 
     */
    constructor(kurs, semestr, group = '22-КБ-ИВ1') {
        this.URL = `https://elkaf.kubstu.ru/timetable/default/time-table-student-ofo?iskiosk=0&fak_id=516&kurs=${kurs}&gr=${group}&ugod=${new Date().getFullYear()}&semestr=${semestr}`
    }

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

        // console.log(this.dayName(this.day))

        for(let i=1;;i++) {
            if(!this.getLesson(this.even, this.day, i) && i == 1) {
                responseText += '\nПар нет! Передохни:з'
                break
            }
            if(!this.getLesson(this.even, this.day, i)) break

            //console.log('\n' + this.getLesson(this.even, this.day, i))
            responseText += '\n' + this.getLesson(this.even, this.day, i)
        }

        return responseText
    }

    dayName(day) {
        let days = ['ВОСКРЕСЕНЬЕ', 'ПОНЕДЕЛЬНИК', 'ВТОРНИК', 'СРЕДА', 'ЧЕТВЕРГ', 'ПЯТНИЦА', 'СУББОТА']
        return days[day]
    }

    evenWeek() {
        let date  = new Date()
        let now   = date.getTime();
        let today = new Date(date.getFullYear(), date.getMonth(), 0).getTime(); 
        let week  = Math.ceil((now - today) / (1000 * 60 * 60 * 24 * 7)); 
        
        return week%2 == 0
    }

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

const bot = new Telegraf(process.env.TOKEN) // Создание объекта бота
const agent = new https.Agent({ // Для отклонения аутентификации
    rejectUnauthorized: false,
});

const days = ['Нечёт Пн', 'Нечёт Вт', 'Нечёт Ср', 'Нечёт Чт', 'Нечёт Пт', 'Нечёт Сб']
const daysEven = ['Чёт Пн', 'Чёт Вт', 'Чёт Ср', 'Чёт Чт', 'Чёт Пт', 'Чёт Сб']

let main = new Main(1, 1)

function buttons() {
    return Markup.keyboard([
        ['Расписание на сегодня', 'Расписание на завтра'],
        ['Выбрать другой день']
    ]).resize()
}

function anotherDay() {
    return Markup.keyboard([
        days,
        daysEven
    ]).resize()
}

bot.start(async (ctx) => {
    ctx.reply(
        'Здарова. Показываю расписание для группы 22-КБ-ИВ1',
        buttons()
    )
})

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

bot.launch()

// let users = {}

// class User {
//     constructor(userID) {
//         this.userID = userID
//     }

//     async getUserInfo() {
//         this.userInfo = await userSchema.findOne({userID: this.userID}).exec()

//         if(!this.userInfo) {
//             let newUser = new userSchema({
//                 userID: this.userID,
//                 instID: null,
//                 kurs: null,
//                 group: null
//             })

//             await newUser.save().catch(err => console.log(err))

//             this.userInfo = await userSchema.findOne({userID: this.userID}).exec()
//         }

//         return this.userInfo
//     }

//     async test() {
//         this.userInfo.instID = 501
//         this.save().catch(err => console.log(err))
//         this.userInfo.instID = 2
//         this.save().catch(err => console.log(err))
//     }
// }

// // const app = express()
// const bot = new Telegraf(process.env.TOKEN)
// const PORT = process.env.PORT || 3000

// bot.start(async (ctx) => {
//     let user = users[ctx.message.from.id]

//     if(!user) {
//         user = new User(ctx.message.from.id)
//         users[ctx.message.from.id] = user
//     }

//     if(!user.userInfo) await user.getUserInfo()

//     user.test()

//     if(!user.userInfo.instID || !user.userInfo.kurs || !user.userInfo.group) {
//         ctx.reply(
//             'Приветствую, давай знакомиться! \n\nЯ бот, который будет показывать тебе раписание в КубГТУ. Подскажи мне свой институт.',
//             Markup.keyboard([
//                 ['ИКСиИБ']
//             ]).resize()
//         )
//     }
// })

// bot.hears('ИКСиИБ', async (ctx) => {
//     let user = await user.findOne({userID: ctx.message.from.id}).exec()


// })

// function getMainMenu() {
//     return Markup.keyboard([
//         ['Мои задачи', 'Добавить задачу'],
//         ['Смотивируй меня']
//     ]).resize() //.extra()
// }

// bot.on('text', ctx => {
//     ctx.reply('just text')
// })

// bot.on('voice', ctx => {
//     ctx.reply('Какой чудный голос')
// })

// bot.on('sticker', ctx => {
//     ctx.reply('Прикольный стикер')
// })

// bot.on('edited_message', ctx => {
//     ctx.reply('Вы успешно изменили сообщение')
// })

// bot.launch()
// app.listen(PORT, () => console.log(`My server is running on port ${PORT}`))
// mongoose.connect(process.env.MONGO_URI)