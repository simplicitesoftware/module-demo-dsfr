/*  ___ _            _ _    _ _
 * / __(_)_ __  _ __| (_)__(_) |_ ___
 * \__ \ | '  \| '_ \ | / _| |  _/ -_)
 * |___/_|_|_|_| .__/_|_\__|_|\__\___|
 *             |_|
 * This example is using the Simplicite node.js & browser JavaScript API
 */
'use strict';

import styles from './styles.less';
import simplicite from 'simplicite';

const app = simplicite.session(process.env.WEBPACK_APP_URL ? { url: process.env.WEBPACK_APP_URL, debug: true } : {});

app.info(`Version: ${simplicite.constants.MODULE_VERSION}`);
app.debug(app.parameters);

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

async function display() {
	const list = await prd.search({ demoPrdAvailable: true }, { inlineDocuments: [ 'demoPrdPicture' ] });
	let l = '';
	for (const item of list) {
		const img = item.demoPrdPicture ? `<img alt="Picture" src="data:${item.demoPrdPicture.mime};base64,${item.demoPrdPicture.content}"/>` : '';
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
		const user = await app.login({ username: 'demodsfr', password: 'simplicite' });
		app.debug(`Connecté en tant que ${user.login}`);
		const grant = await app.getGrant();
		app.debug(grant);
		app.info(`Bonjour ${grant.getFirstname()} ${grant.getLastname()}`);
		prd = app.getBusinessObject('DemoProduct');
		const metadata = await prd.getMetaData();
		app.debug(metadata);
		elt('product-add').onclick = async () => {
			const item = await prd.getForCreate();
			app.debug(item);
			prd.item.demoPrdSupId = 1; // TODO: choosable supplier
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
		display();
	} catch (err) { error(err); }
})();
