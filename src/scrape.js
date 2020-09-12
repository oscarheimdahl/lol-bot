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
  const smallSpace = ' ';
  const bigSpace = '   ';
  let message = '';
  await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      let runes1 = $('.Description__Title-jfHpQH.bJtdXG', '#app');
      let runes2 = $('.Description__Title-jfHpQH.eOLOWg', '#app');
      runes1.each(function (i, _) {
        const runeText = $(this).contents().text();
        if (i === 0) message += parseRuneIcon(runeText) + '\n';
        else if (i < 5) message += bigSpace + runeText + '\n';
      });
      message += '\n';
      runes2.each(function (i, _) {
        const runeText = $(this).contents().text();
        if (i === 0) message += parseRuneIcon(runeText) + '\n';
        else if (i < 3) message += bigSpace + runeText + '\n';
      });
      message += '\n';
      message += '⚪' + smallSpace + '\n';
      runes1.each(function (i, _) {
        const runeText = $(this).contents().text();
        if (i >= 5 && i < 8) message += bigSpace + runeText + '\n';
      });
    })
    .catch((e) => (message = notFound));
  return { message };
};

scrapeSkills = async (champ, role) => {
  champ = champ.replace(/\s/g, '');
  await axios
    .get(`https://champion.gg/champion/${champ}/${role}`)
    .then((res) => {
      const $ = cheerio.load(res.data);
      const skillOrder = $('.skill-selections');
      const spans = skillOrder.find('span');
      let found = 0;
      let i = 18;
      let order = {};
      let orderA = {};
      while (found < 18) {
        const span = spans[i.toString()];
        if (span.children && span.children[0]) {
          let m = 0;
          if (span.children[0].data === 'Q') m = 18;
          else if (span.children[0].data === 'W') m = 36;
          else if (span.children[0].data === 'E') m = 54;
          else if (span.children[0].data === 'R') m = 72;
          order[(i - m + 1).toString()] = span.children[0].data;
          found++;
        }
        i++;
      }
      message = buildSkillsPrint(Object.values(order));
    })
    .catch((e) => {
      console.log(e)((message = notFound));
    });
  return { message };
};

function buildSkillsPrint(skills) {
  let skillsPrint = '';
  skillsPrint += '───────────────────────────────────────────────────';
  skillsPrint += buildSkillRow(skills, 'Q', ' Ｑ', ' ・');
  skillsPrint += buildSkillRow(skills, 'W', ' Ｗ', ' ・');
  skillsPrint += buildSkillRow(skills, 'E', ' Ｅ', ' ・');
  skillsPrint += buildSkillRow(skills, 'R', ' Ｒ', ' ・');
  skillsPrint += '\n───────────────────────────────────────────────────\n';
  skillsPrint += shortSkillRow(skills);
  return skillsPrint;
}

function buildSkillRow(skills, spell, spellGlyph, nullGlyph) {
  let skillsPrint = '';
  skillsPrint += '\n';
  for (let i = 0; i < 18; i++) {
    skillsPrint += skills[i] === spell ? spellGlyph : nullGlyph;
  }
  return skillsPrint;
}

function shortSkillRow(skills) {
  const q = skills.lastIndexOf('Q');
  const w = skills.lastIndexOf('W');
  const e = skills.lastIndexOf('E');
  if (q < w && q < e && w < e) return 'Ｑ ➜ Ｗ ➜ Ｅ';
  if (q < w && q < e && e < w) return 'Ｑ ➜ Ｅ ➜ Ｗ';
  if (w < q && w < e && q < e) return 'Ｗ ➜ Ｑ ➜ Ｅ';
  if (w < q && w < e && e < q) return 'Ｗ ➜ Ｅ ➜ Ｑ';
  if (e < q && e < w && w < q) return 'Ｅ ➜ Ｗ ➜ Ｑ';
  if (e < q && e < w && q < w) return 'Ｅ ➜ Ｑ ➜ Ｗ';
}

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
  scrapeSkills,
};
