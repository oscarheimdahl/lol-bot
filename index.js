const Discord = require('discord.js');
const bot = new Discord.Client();
const scrape = require('./scrape');
const { champs, champsLowercase } = require('./champs');

require('dotenv').config();

bot.login(process.env.TOKEN);

bot.on('ready', () => {
  console.log('BOT READY ✌');
});

bot.on('message', async msg => {
  if (msg.content.charAt(0) !== '!') return;
  //the first word without '!'
  if (msg.content.match(/'| |\./)) {
    msg.channel.send(
      'Write champs without space or special character.\nDr. Mundo → drmundo'
    );
    return;
  }

  const firstWord = msg.content.split(' ')[0];
  const champ = firstWord.slice(1, msg.content.length).toLowerCase();
  if (!champsLowercase.includes(champ) && !champs.includes(champ)) return;
  const champIndex = champsLowercase.indexOf(champ);

  console.log('Scraping after ' + champs[champIndex] + ':s build!');
  const res = await scrape(champsLowercase[champIndex]);
  msg.channel.send(res.message, {
    files: res.items
  });
});
