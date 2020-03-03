const Discord = require('discord.js');
const bot = new Discord.Client();
const { scrapeBuild, scrapeRunes } = require('./scrape');
const { champsUppercase, champsLowercase, champsNick } = require('./champs');

require('dotenv').config();

bot.login(process.env.TOKEN);

bot.on('ready', () => {
  console.log('BOT READY ✌');
  bot.user
    .setActivity('!build [champ]', { type: 'PLAYING' })
    .then()
    .catch(console.error);
});

bot.on('message', msg => {
  let res = '';
  const words = msg.content.toLowerCase().split(' ');
  if (words[0] === '!build') sendBuild(msg, words);
  else if (words[0] === '!runes') sendRunes(msg, words);
});

sendBuild = async (msg, words) => {
  const champ = words[1];
  const role = getRole(words[2]);
  if (!champFound(champ)) {
    msg.channel.send('Champ not found');
    return;
  }
  const champIndex = getChampIndex(champ);
  const info =
    'Scraping champion.gg for the build of ' + champsUppercase[champIndex];
  console.log(info);
  msg.channel.send(info);
  const res = await scrapeBuild(champsLowercase[champIndex], role);
  msg.channel.send(res.message, {
    files: res.items
  });
};

sendRunes = async (msg, words) => {
  const champ = words[1];
  const role = getRole(words[2]);
  if (!champFound(champ)) {
    msg.channel.send('Champ not found');
    return;
  }
  const champIndex = getChampIndex(champ);
  const info =
    'Scraping champion.gg for the runes of ' + champsUppercase[champIndex];
  console.log(info);
  msg.channel.send(info);
  const res = await scrapeRunes(champsLowercase[champIndex], role);
  msg.channel.send(res.message);
};
// scrapeRunes('janna', '');
getRole = role => {
  const top = ['top', 'topp'];
  const jungle = ['jungle', 'jung', 'jg', 'jgl'];
  const middle = ['mid', 'middle'];
  const adc = ['adc', 'marksman', 'bot'];
  const support = ['support', 'supp', 'sup'];
  if (top.includes(role)) return 'top';
  if (jungle.includes(role)) return 'jungle';
  if (middle.includes(role)) return 'middle';
  if (adc.includes(role)) return 'adc';
  if (support.includes(role)) return 'support';
  return '';
};

champFound = champ => {
  return champsLowercase.includes(champ) || champsNick.includes(champ);
};

getChampIndex = champ => {
  let i = champsLowercase.indexOf(champ);
  if (i > 0) return i;
  i = champsUppercase.indexOf(champ);
  if (i > 0) return i;
  i = champsNick.indexOf(champ);
  return i;
};
