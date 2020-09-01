const cheerio = require('cheerio');
const axios = require('axios');
const notFound = '❌ Champ not found ';

scrapeBuild = async (champ, role) => {
  champ = champ.replace(/\s/g, '');
  console.log(`https://champion.gg/champion/${champ}/${role}`);
  const scrapeAll = await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let links = $('.build-wrapper').first().children('a');

      let scrape = {
        items: [],
        message: "Here's the most frequent core build:",
      };
      links.each((i, link) => {
        let img = link.children[1];
        let imgSrc = img.attribs.src;
        let itemURL = 'http:' + imgSrc;
        scrape.items.push(itemURL);
      });
      if (scrape.items.length < 4) {
        scrape.items = [];
        scrape.message = '\n\n❌ Not enough data this patch ❌';
      }
      return scrape;
    })
    .catch((e) => {
      return { message: notFound };
    });
  return scrapeAll;
};

scrapeRunes = async (champ, role) => {
  champ = champ.replace(/\s/g, '');
  //   let smallSpace = '  ';
  let smallSpace = ' ';
  //   let bigSpace = '        ';
  let bigSpace = '   ';
  await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let runes1 = $('.Description__Title-jfHpQH.bJtdXG', '#app');
      let runes2 = $('.Description__Title-jfHpQH.eOLOWg', '#app');
      message = '\n';
      runes1.each(function (i, _) {
        const runeText = $(this).contents().text();
        if (i === 0) message += parseRuneIcon(runeText) + '\n';
        // else if (i === 1) message += bigSpace + runeText + '\n';
        else if (i < 5) message += bigSpace + runeText + '\n';
      });
      message += '\n';
      runes2.each(function (i, _) {
        const runeText = $(this).contents().text();
        if (i === 0) message += parseRuneIcon(runeText) + '\n';
        // else if (i === 1) message += runeText + '\n';
        else if (i < 3) message += bigSpace + runeText + '\n';
      });
      message += '\n';
      message += '⚪' + smallSpace + '\n';
      runes1.each(function (i, _) {
        const runeText = $(this).contents().text();
        // if (i === 5) message +=  runeText + '\n';
        if (i >= 5 && i < 8) message += bigSpace + runeText + '\n';
      });
    })
    .catch((e) => (message = notFound));
  return { message };
};

function parseRuneIcon(runePage) {
  switch (runePage) {
    case 'Domination':
      return '🔴';
    case 'Precision':
      return '🟡';
    case 'Sorcery':
      return '🟣';
    case 'Resolve':
      return '🟢';
    case 'Inspiration':
      return '🔵';
    default:
      console.log(runePage);
      return '✨';
  }
}

module.exports = {
  scrapeBuild,
  scrapeRunes,
};
