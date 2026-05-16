import fs from 'fs';

const p = new URL('../messages/fr.json', import.meta.url);
const j = JSON.parse(fs.readFileSync(p, 'utf8'));

Object.assign(j.common, {
  viewServices: 'Parcourir les ressources numériques',
  getStarted: 'Voir les kits',
  contactUs: 'Support produit',
  companyName: 'DigiScaler LLC',
});

j.nav.services = 'Ressources';
j.nav.getStarted = 'Voir les kits';
j.nav.faq = 'FAQ';

Object.assign(j.footer, {
  tagline:
    'Ressources numériques premium téléchargeables pour les entreprises en ligne.',
  digitalDelivery:
    "Tous les produits sont des téléchargements numériques. Aucun envoi physique n'est fourni. L'accès est livré électroniquement après l'achat.",
  links: { ...j.footer.links, services: 'Ressources' },
  copyright: 'DigiScaler LLC. Tous droits réservés.',
  disclaimer:
    "DigiScaler LLC est une marque américaine de produits numériques premium. Les ressources sont des outils éducatifs ; nous ne garantissons pas de chiffre d'affaires, de classement ou de résultats commerciaux spécifiques.",
});

fs.writeFileSync(p, `${JSON.stringify(j, null, 2)}\n`);
