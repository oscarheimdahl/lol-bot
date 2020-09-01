const Discord = require('discord.js');
const bot = new Discord.Client();
const { scrapeBuild, scrapeRunes } = require('./scrape');
const { champsNicknames } = require('./champs');

require('dotenv').config();

bot.login(process.env.TOKEN);

bot.on('ready', () => {
  console.log('BOT READY ✌');
  bot.user
    .setActivity('!build [champ]', { type: 'PLAYING' })
    .then()
    .catch(console.error);
});

bot.on('message', (msg) => {
  const words = msg.content.toLowerCase().split(' ');
  const champ = getChamp(words[1]);
  const role = getRole(words[2]);
  if (words[0] === '!build') sendBuild(msg, champ, role);
  else if (words[0] === '!runes') sendRunes(msg, champ, role);
});

sendRunes = async (msg, champ, role) => {
  msg.channel.send(`Scraping champion.gg for the runes of *${champ}*`);
  const res = await scrapeRunes(champ, role);
  msg.channel.send('```' + res.message + '```');
};

sendBuild = async (msg, champ, role) => {
  msg.channel.send(`Scraping champion.gg for the build of *${champ}*`);
  const res = await scrapeBuild(champ, role);
  msg.channel.send(res.message, {
    files: res.items,
  });
};

getRole = (role) => {
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

getChamp = (name) => {
  const champ = champsNicknames[name];
  if (champ) return champ;
  return name;
};
