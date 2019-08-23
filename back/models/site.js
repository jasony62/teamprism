const {
    DbModel
} = require('../../../tms/model')
const utilities =  global.utilities

class Site extends DbModel {
    async byId(siteId, aOptions = {}) {
		let fields = aOptions.fields && aOptions.fields != "undefined" ? aOptions.fields : '*';
		let cascaded = aOptions.cascaded && aOptions.cascaded != "undefined" ? aOptions.cascaded : '';
        let db = await this.db()
        let dbSelect = db.newSelect('xxt_site', fields)
        dbSelect.where.fieldMatch('id', '=', siteId)
        dbSelect.where.fieldMatch('state', '=', 1)
        let site = await dbSelect.exec()
		if (site && cascaded) {
			cascaded = cascaded.split(",");
			if (cascaded.length) {
			// 	$modelCode = $this->model('code\page');
			// 	foreach ($cascaded as $field) {
			// 		if ($field === 'home_page_name') {
			// 			$site->home_page = $modelCode->lastPublishedByName($siteId, $site->home_page_name, ['fields' => 'id,html,css,js']);
			// 		} else if ($field === 'header_page_name' && $site->header_page_name) {
			// 			$site->header_page = $modelCode->lastPublishedByName($siteId, $site->header_page_name, ['fields' => 'id,html,css,js']);
			// 		} else if ($field === 'footer_page_name' && $site->footer_page_name) {
			// 			$site->footer_page = $modelCode->lastPublishedByName($siteId, $site->footer_page_name, ['fields' => 'id,html,css,js']);
			// 		}
			// 	}
			}
		}

		return site;
	}
}

module.exports = function () {
    return new Site()
}