const TelegramBot = require('node-telegram-bot-api');
const Dotenv = require('dotenv').config();
const GoogleSpreadsheetAPI = require('./google-api');

const TOKEN = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot( TOKEN, { polling: true } );
const GoogleAPI = new GoogleSpreadsheetAPI();

let formatTimeStamp = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // format date starting with 0
  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedHours = hours < 10 ? '0' + hours : hours;
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  return { day:`${formattedDay}`, month:`${formattedMonth}`, hour:`${formattedHours}`, min:`${formattedMinutes}`};
}

let clearChat = async (msg) => {
  for (let i = msg.message_id; i >= 0; i--) {
    console.log('[Telegram] deleting message with id:', i);
    try {
      await bot.deleteMessage(msg.chat.id, i);
      console.log('[Telegram] success!!');  
    } catch (error) {
      console.log('[Telegram] end (0).');
      
      return;
    }
  }
  console.log('[Telegram] end (1).');
  return;
};

bot.on('polling_error', (error) => {
  console.log('error :', error.code);  // => 'EFATAL'
  return;
});

let pastMsg;
bot.on('message', async (msg) => {
  if( msg.chat.id != process.env.TELEGRAM_CHAT_ID ) return;
  
  const text = msg.text;
  const date = formatTimeStamp(msg.date)
  const printDate = `${date.day}/${date.month} ${date.hour}:${date.min}`

  if( text == undefined ) {
    console.log(msg, printDate)
    return;
  }
  
  if( text == '/cc' ) clearChat(msg);
  
  if( text == '/msg' ){
    try{
      bot.sendMessage(msg.chat.id, JSON.stringify(msg));
      console.log('[Telegram]', msg);
      return; 
    } catch(error){
      console.error('[Telegram] ERROR ON SENDING MESSAGE:', error);
    }
  }
  
  if( text == '/registrar' ){
    try{
      bot.sendMessage(msg.chat.id, 'Que compra gostaria de registrar? Utilize o formato: item valor. :-)');
    } catch(error) {
      console.error('[Telegram] ERROR ON SENDING MESSAGE:', error);
    }
  }

  if( pastMsg == '/registrar' ) {
    try{
      pastMsg = text;
   
      await GoogleAPI.getDocumentInfo();
      
      const wordArray = text.split(" ");
      const data = { name: wordArray[0], value: wordArray[1], date: printDate };
      
      await GoogleAPI.getInfoAboutCell();
      await GoogleAPI.addRow(1, data);
      bot.sendMessage( msg.chat.id, `Compra: (${wordArray[0]} R$ ${wordArray[1]} ${printDate}) registrada em ${GoogleAPI.doc.title}. :)`);
  
      return;
    } catch(error) {
      console.error('[Telegram] ERROR IN REGISTERING:', error);
      return;
    }
  }

  console.log(`[Telegram] ${msg.chat.username} at ${printDate} ->  ${text}`);
  pastMsg = text;
});