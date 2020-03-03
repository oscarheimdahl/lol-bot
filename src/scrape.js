const cheerio = require('cheerio');
const axios = require('axios');

scrapeBuild = async (champ, role) => {
  console.log(`https://champion.gg/champion/${champ}/${role}`);
  const scrape = await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then(res => {
      const $ = cheerio.load(res.data);
      let links = $('.build-wrapper')
        .first()
        .children('a');

      let scrape = {
        items: [],
        message: "Here's the most frequent core build:"
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
    });

  return scrape;
};

scrapeRunes = async (champ, role) => {
  const scrape = await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then(res => {
      const $ = cheerio.load(res.data);
      let runes1 = $('.Description__Title-jfHpQH.bJtdXG', '#app');
      let runes2 = $('.Description__Title-jfHpQH.eOLOWg', '#app');
      message = '\n';
      runes1.each(function(i, rune) {
        if (i === 0)
          message +=
            parseRune(
              $(this)
                .contents()
                .text()
            ) + '\n';
        else if (i < 5)
          message +=
            '      ' +
            $(this)
              .contents()
              .text() +
            '\n';
      });
      runes2.each(function(i, rune) {
        if (i === 0)
          message +=
            parseRune(
              $(this)
                .contents()
                .text()
            ) + '\n';
        else if (i < 3)
          message +=
            '      ' +
            $(this)
              .contents()
              .text() +
            '\n';
      });
      message += '⚪\n';
      runes1.each(function(i, rune) {
        if (i > 4 && i < 8)
          message +=
            '      ' +
            $(this)
              .contents()
              .text() +
            '\n';
      });
    });
  return { message };
};

function parseRune(runePage) {
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
  scrapeRunes
};
