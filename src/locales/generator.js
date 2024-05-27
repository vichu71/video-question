const es = require("./es.json");
const en = require("./en.json");
const eu = require("./eu.json");
const ca = require("./ca.json");
const gl = require("./gl.json");
const locales = {
  'Castellano': es,
  'English': en,
  'Euskara': eu,
  'Català': ca,
  'Galego': gl,
}

const fd = ';';
const ld = '\n';

const names = Object.keys(es);

const langs = Object.keys(locales);
const res = 'Nombre' + fd + langs.join(fd) + ld + names.map((name) => name + fd + langs.map((lang) => locales[lang][name]).join(fd)).join(ld);

console.log(res);
