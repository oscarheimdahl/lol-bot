const cheerio = require('cheerio');
const axios = require('axios');

module.exports = async champ => {
  const scrape = await axios
    .get(`https://champion.gg/champion/${champ}`)
    .then(res => {
      const $ = cheerio.load(res.data);
      let links = $('.build-wrapper')
        .first()
        .children('a');

      let scrape = {
        items: [],
        message: 'Most frequent core build on ' + champ.toUpperCase()
      };
      links.each((i, link) => {
        let img = link.children[1];
        let imgSrc = img.attribs.src;
        let itemURL = 'http:' + imgSrc;
        scrape.items.push(itemURL);
      });
      if (scrape.items.length < 4)
        scrape.message += '\n\n❌ Not yet complete for this patch! ❌';
      return scrape;
    });

  return scrape;
};
