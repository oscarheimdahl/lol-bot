const Discord = require('discord.js');
const bot = new Discord.Client();
const scrape = require('./scrape');
const { champsUppercase, champsLowercase, champsNick } = require('./champs');

require('dotenv').config();

bot.login(process.env.TOKEN);

bot.on('ready', () => {
  console.log('BOT READY ✌');
});

bot.on('message', async msg => {
  if (msg.content.slice(0, 6) !== '!build') return;
  const champ = msg.content.slice(7, msg.content.length).toLowerCase();
  if (!champFound(champ)) {
    msg.channel.send('Champ not found');
    return;
  }
  const champIndex = getChampIndex(champ);
  msg.channel.send(
    'Scraping champion.gg for the build of ' + champsUppercase[champIndex]
  );
  const res = await scrape(champsLowercase[champIndex]);
  msg.channel.send(res.message, {
    files: res.items
  });
});

champFound = champ => {
  return (
    champsLowercase.includes(champ) ||
    champsUppercase.includes(champ) ||
    champsNick.includes(champ)
  );
};

getChampIndex = champ => {
  let i = champsLowercase.indexOf(champ);
  if (i > 0) return i;
  i = champsUppercase.indexOf(champ);
  if (i > 0) return i;
  i = champsNick.indexOf(champ);
  return i;
};
