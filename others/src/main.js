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

const app = simplicite.session(); // No explicit URL needed when deployed in Simplicite
//const app = simplicite.session({ url: 'https://demo.dev.simplicite.io' }); // Explicit URL needed for a standalone deployment

app.info('Version: ' + simplicite.constants.MODULE_VERSION);
app.debug(app.parameters);

let prd;

function elt(id, html) {
	const el = document.getElementById('web-demo-' + id);
	if (el && html) el.innerHTML = html;
	return el;
}

app.login({ username: 'website', password: 'simplicite' }).then(function(user) {
	app.debug('Logged in as ' + user.login);
	// Get user's details
	return app.getGrant();
}).then(function(grant) {
	app.debug(grant);
	elt('message', 'Hello ' + grant.getLogin());
	// Get object
	prd = app.getBusinessObject('DemoProduct');
	// Get product object's metadata
	return prd.getMetaData();
}).then(function(metadata) {
	app.debug(metadata);
	elt('product-add').onclick = function() {
		// Create new product
		prd.getForCreate().then(function() {
			console.log(prd.item);
			prd.item.demoPrdSupId = 1;
			prd.item.demoPrdType = 'OTHER';
			prd.item.demoPrdReference = elt('product-ref').value;
			prd.item.demoPrdName = elt('product-name').value;
			var file = elt('product-picture').files[0];
			console.log(file);
			var fr = new FileReader();
			fr.onload = function() {
				if (fr.result) {
					prd.item.demoPrdPicture = { id: 0, name: file.name, type: file.type, content: fr.result };
					console.log(prd.item);
					prd.save().then(function() {
						console.log(prd.item);
					});
				}
			};
			fr.readAsDataURL(file);
		});
	};
	return prd.search({ demoPrdAvailable: true }, { inlineDocuments: [ 'demoPrdPicture' ] });
}).then(function(list) {
	app.debug(list);
	let l = '<div class="fr-grid-row fr-grid-row--gutters">';
	for (const item of list)
		l += '<div class="fr-col-sm-12 fr-col-md-6 fr-col-lg-4">' +
				'<div class="fr-tile fr-enlarge-link fr-tile--horizontal">' +
					'<div class="fr-tile__body">' +
						'<h4 class="fr-tile__title">' + item.demoPrdName + '</h4>' +
						'<h5 class="fr-tile__title">' + item.demoPrdReference + ' (' + prd.getFieldListValue('demoPrdType', item) + ')</h5>' +
						'<p class="fr-tile__desc">' + item.demoPrdDescription + '</p>' +
					'</div>' +
					'<div class="fr-tile__img"><img alt="Picture" src="data:' + item.demoPrdPicture.mime + ';base64,' + item.demoPrdPicture.content + '"/></div>' +
				'</div>' +
			'</div>';
	l += '</div>';
	elt('products', l);
}).catch(function(err) {
	app.log(err);
	elt('message', '<div class="error">Error: ' + err.message + '</div>');
});
