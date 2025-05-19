package com.simplicite.dispositions.DemoDSFR;

import com.simplicite.util.AppLog;
import com.simplicite.util.Tool;
import com.simplicite.util.tools.HTMLTool;
import com.simplicite.util.tools.Parameters;

/**
 * DSFR disposition
 */
public class DemoDSFR extends com.simplicite.util.Disposition {
	private static final long serialVersionUID = 1L;

	@Override
	public String display(Parameters params) {
		try {
			return HTMLTool.jsBlock(
				"sessionStorage.setItem('demo-authtoken', '" + Tool.toJS(getGrant().getAuthToken()) + "');" +
				"document.location.replace('" + HTMLTool.getExternalObjectURL("DemoDSFR") + "/index.html');");
		} catch (Exception e) {
			AppLog.error(null, e, getGrant());
			return e.getMessage();
		}
	}
}