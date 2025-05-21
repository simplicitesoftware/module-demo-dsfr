/*  ___ _            _ _    _ _
 * / __(_)_ __  _ __| (_)__(_) |_ ___
 * \__ \ | '  \| '_ \ | / _| |  _/ -_)
 * |___/_|_|_|_| .__/_|_\__|_|\__\___|
 *             |_|
 * This example is using the Simplicite node.js & browser JavaScript API
 */
'use strict';

import './styles.less';
import '@gouvfr/dsfr/dist/dsfr.min.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-system/icons-system.css';
import '@gouvfr/dsfr/dist/utility/icons/icons-user/icons-user.css';

import simplicite from 'simplicite';

const sessionParams = { debug: true };
if (import.meta.env.VITE_DEMO_URL)
  sessionParams.url = import.meta.env.VITE_DEMO_URL;

const authtoken = sessionStorage.getItem('_authtoken');
if (authtoken) {
  sessionParams.endpoint = 'ui';
  sessionParams.authtoken = authtoken;
  sessionParams.ajaxkey = sessionStorage.getItem('_ajaxkey');
} else
  sessionParams.endpoint = 'api';
// eslint-disable-next-line no-console
console.log('Session parameters', sessionParams);

const app = simplicite.session(sessionParams);
app.info(`Version: ${simplicite.constants.MODULE_VERSION}`);

let prd;

function elt(id, html) {
  const el = document.getElementById(`dsfr-demo-${id}`);
  if (el && typeof html === 'string') el.innerHTML = html;
  return el;
}

function error(err) {
  app.error(err);
  elt('message',
    `<div class="fr-alert fr-alert--error">\
      <div class="fr-container">\
        <div class="fr-alert__body">\
          <h3 class="fr-alert__title">Erreur</h3>\
          <p>${err.message || err.messages.join(',')}</p>\
        </div>\
      </div>\
    </div>`);
}

function quit(url) {
  sessionStorage.removeItem('_authtoken');
  sessionStorage.removeItem('_ajaxkey');
  window.location.replace(url);
}

async function display() {
  if (authtoken) {
    const grant = await app.getGrant();
    app.debug('Grant', grant);

    let b = elt('user');
    b.innerHTML = `${grant.getFirstName()} ${grant.getLastName()}`;
    b.style.display = 'flex';

    // TODO: propose all user scopes
    for (const scope of [ 'Home', 'DemoAdminHome', 'DemoUserHome' ]) {
      if (grant.hasScope(scope)) {
        b = elt('home', );
        b.style.display = 'flex';
        b.onclick = () => quit(`/ui?scope=${scope}`);
        break;
      }
    }

    b = elt('logout');
    b.style.display = 'flex';
    b.onclick = () => quit('/logout');
  }

  prd = app.getBusinessObject('DemoProduct');
  const metadata = await prd.getMetaData();
  app.debug('Product metadata', metadata);

  const list = await prd.search({ demoPrdAvailable: true }, { inlineDocuments: [ 'demoPrdPicture' ] });
  let l = '';
  for (const item of list) {
    const img = item.demoPrdPicture ? `<img alt="${item.demoPrdName}" src="data:${item.demoPrdPicture.mime};base64,${item.demoPrdPicture.content}"/>` : '';
    l += `<div class="fr-col-sm-12 fr-col-md-6 fr-col-lg-4">\
      <div class="fr-tile fr-enlarge-link fr-tile--horizontal">\
        <div class="fr-tile__body">\
          <h4 class="fr-tile__title">${item.demoPrdName} (${item.demoPrdSupId__demoSupCode})</h4>\
          <h5 class="fr-tile__title">${item.demoPrdReference} (${prd.getFieldListValue('demoPrdType', item)})</h5>\
          <p class="fr-tile__desc">${item.demoPrdDescription || 'No description'}</p>\
        </div>\
        <div class="fr-tile__img">${img}</div>\
      </div>\
    </div>`;
  }
  elt('products', `<div class="fr-grid-row fr-grid-row--gutters">${l}</div>`);
  if (prd.metadata.create) {
    elt('product-add').onclick = async () => {
      const item = await prd.getForCreate();
      app.debug(item);
      prd.item.demoPrdSupId = 1; // TODO: choose supplier
      prd.item.demoPrdType = 'OTHER';
      prd.item.demoPrdReference = elt('product-ref').value;
      prd.item.demoPrdName = elt('product-name').value;
      var file = elt('product-picture').files[0];
      if (file) {
        prd.item.demoPrdPicture = await new simplicite.Doc().load(file);
        app.debug(prd.item);
        save();
      } else
        save();
    };
    elt('product-form').style.display = 'block';
  }
}

async function save() {
  try {
    elt('message', '');
    await prd.save();
    display();
  } catch (err) { error(err); }
}

(async () => {
  try {
    display();
  } catch (err) { app.error(err); }
})();
