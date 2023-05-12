const TelegramApi = require('node-telegram-bot-api')
const token = '5761817221:AAEKcsKi8F4hz_IXXiLd_hsFqjie7UNv8sM'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const gameOptions = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: '1', callback_data: '1' },
        { text: '2', callback_data: '2' },
        { text: '3', callback_data: '3' }
      ],
      [
        { text: '4', callback_data: '4' },
        { text: '5', callback_data: '5' },
        { text: '6', callback_data: '6' }
      ],
      [
        { text: '7', callback_data: '7' },
        { text: '8', callback_data: '8' },
        { text: '9', callback_data: '9' }
      ],
      [{ text: '0', callback_data: '0' }]
    ]
  })
}

const gameAgain = {
  reply_markup: JSON.stringify({
    inline_keyboard: [[{ text: 'Играть еще раз', callback_data: '/again' }]]
  })
}

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info', description: 'Информация пока недоступна' },
  { command: '/game', description: 'Игра отгадай число' }
])

const startGame = async chatId => {
  await bot.sendMessage(chatId, 'Загадываю число от 0 до 9...')
  const randomNubmer = Math.floor(Math.random() * 10)
  chats[chatId] = randomNubmer
  await bot.sendSticker(
    chatId,
    'https://tlgrm.ru/_/stickers/524/7a0/5247a074-b842-4bf6-95b7-0bd94ef597bc/7.webp'
  )
  await bot.sendMessage(chatId, 'Отгадывай!', gameOptions)
}

const start = message => {
  bot.on('message', async msg => {
    const text = msg.text
    const chatId = msg.chat.id
    if (text === '/start') {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/524/7a0/5247a074-b842-4bf6-95b7-0bd94ef597bc/10.webp'
      )
      return bot.sendMessage(
        chatId,
        `Добро пожаловать, ${msg.from.first_name} ${msg.from.last_name}!`
      )
    }
    if (text === '/info') {
      return bot.sendMessage(chatId, 'Скоро что-нибудь придумаем!')
    }
    if (text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
  })

  bot.on('callback_query', async msg => {
    console.log(msg)
    const data = msg.data
    const chatId = msg.message.chat.id
    if (data === '/again') {
      return startGame(chatId)
    }
    if (data == chats[chatId]) {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/524/7a0/5247a074-b842-4bf6-95b7-0bd94ef597bc/3.webp'
      )
      return bot.sendMessage(
        chatId,
        `Поздравляю, Вы угадали цифру ${chats[chatId]}!`,
        gameAgain
      )
    } else {
      await bot.sendSticker(
        chatId,
        'https://tlgrm.ru/_/stickers/524/7a0/5247a074-b842-4bf6-95b7-0bd94ef597bc/5.webp'
      )
      return bot.sendMessage(
        chatId,
        `К сожалению, мимо. Бот загадал цифру ${chats[chatId]}!`,
        gameAgain
      )
    }
  })
}

start(console.log('Bot running...'))
