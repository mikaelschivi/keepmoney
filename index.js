const TelegramBot = require('node-telegram-bot-api');
const Dotenv = require('dotenv').config();

const TOKEN = process.env.telegram_API_key;

const bot = new TelegramBot( TOKEN, { polling: true } );

bot.on('polling_error', (error) => {
    console.log('error :', error);  // => 'EFATAL'
  });


bot.on('message', (msg) => {
    if( msg.chat.username != 'wyaiaeham' ) return;
    // console.log(msg)
    console.log(msg.chat.username, msg.date);
    // console.log(`text: ${msg.text} -- date: ${msg.date} -- typeof ${typeof msg.text}`);
    const wordArray = msg.text.split(" ");
    for( const word of wordArray ) {
      console.log(word)
    }
  });