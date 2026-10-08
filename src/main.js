import '@lucabonaldo/design/fonts.css';
import '@lucabonaldo/design/index.css';
import './styles/main.css';
import { initTheme, initReveal } from '@lucabonaldo/design';
import { onReady } from './scripts/dom.js';
import { initFields } from './scripts/field.js';

onReady(function () {
  var year = document.getElementById('year');
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
  initTheme();
  initReveal();
});
initFields();
