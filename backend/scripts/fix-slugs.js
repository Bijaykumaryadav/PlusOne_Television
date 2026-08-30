require('dotenv').config();
const dbConnection = require('../config/db');
const Article = require('../models/article');

const nepaliToLatinMap = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'i', 'उ': 'u', 'ऊ': 'u', 'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai',
  'ओ': 'o', 'औ': 'au', 'ं': '', 'ः': '', 'ँ': '', '़': '', 'ा': '', 'ि': '', 'ी': '', 'ु': '', 'ू': '',
  'े': '', 'ै': '', 'ो': '', 'ौं': 'o', 'ौ': 'au', 'ृ': 'ri', '्': '',
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng', 'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh',
  'ञ': 'ny', 'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n', 'त': 't', 'थ': 'th', 'द': 'd',
  'ध': 'dh', 'न': 'n', 'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm', 'य': 'y', 'र': 'r',
  'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h', 'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gy',
  'ॐ': 'om',
};

const makeSlug = (title = '') => {
  if (!title) return 'article';

  return String(title)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\u0900-\u097f\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'article';
};

const makeEnglishSlug = (title = '') => {
  if (!title) return 'article';

  return String(title)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'article';
};

(async () => {
  try {
    await dbConnection();

    const docs = await Article.find({}).lean();

    let updated = 0;

    for (const doc of docs) {
      const routeTitleNe = doc.routeTitleNe || doc.title || '';
      const routeTitleEn = doc.routeTitleEn || '';

      const base = makeSlug(routeTitleNe);
      const desired = base && base !== 'article' ? base : `article-${doc._id.toString().slice(-6)}`;

      let slug = desired;
      let counter = 1;

      while (await Article.exists({ slug, _id: { $ne: doc._id } })) {
        slug = `${desired}-${counter}`;
        counter += 1;
      }

      const desiredEn = routeTitleEn ? makeEnglishSlug(routeTitleEn) : slug;

      let slugEn = desiredEn;
      let counterEn = 1;

      while (await Article.exists({ slugEn, _id: { $ne: doc._id } })) {
        slugEn = `${desiredEn}-${counterEn}`;
        counterEn += 1;
      }

      if (doc.slug !== slug || doc.slugEn !== slugEn) {
        await Article.findByIdAndUpdate(doc._id, { $set: { slug, slugEn } });
        updated += 1;
      }
    }

    console.log('articles-checked:', docs.length);
    console.log('updated:', updated);
    process.exit(0);
  } catch (error) {
    console.error('Slug migration failed:', error);
    process.exit(1);
  }
})();
