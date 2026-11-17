import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

/**
 * Mounts the tool into every element with class "ats-visa-checklist" (or id "ats-visa-checklist").
 * In WordPress, the shortcode only needs to output:
 *   <div class="ats-visa-checklist" data-quote-url="https://…/get-a-quote/"></div>
 *
 * Supported data attributes:
 *   data-quote-url            link for the translation quote button
 *   data-brand                brand name shown under the button
 *   data-default-destination  au | uk | us (pre-selects a country, handy for country pages)
 */
function mount(el) {
  if (el.dataset.atsvcMounted) return;
  el.dataset.atsvcMounted = '1';
  const config = {
    quoteUrl: el.dataset.quoteUrl || 'https://australiantranslationservices.com.au/',
    brand: el.dataset.brand || 'AustralianTranslationServices',
    defaultDestination: el.dataset.defaultDestination || null,
  };
  createRoot(el).render(
    <StrictMode>
      <App config={config} />
    </StrictMode>,
  );
}

function init() {
  document.querySelectorAll('.ats-visa-checklist, #ats-visa-checklist').forEach(mount);
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
