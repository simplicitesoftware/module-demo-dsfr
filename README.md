<!--
 ___ _            _ _    _ _    __
/ __(_)_ __  _ __| (_)__(_) |_ /_/
\__ \ | '  \| '_ \ | / _| |  _/ -_)
|___/_|_|_|_| .__/_|_\__|_|\__\___|
            |_| 
-->
![](https://docs.simplicite.io//logos/logo250.png)
* * *

`DemoDSFR` module definition
============================

### Introduction

Demo examples for the [DSFR toolkit](https://www.systeme-de-design.gouv.fr)

### Import

To import this module:

- Create a module named `DemoDSFR`
- Set the settings as:

```json
{
	"type": "git",
	"origin": {
		"uri": "https://github.com/simplicitesoftware/module-demo-dsfr.git"
	}
}
```

- Click on the _Import module_ button

### Configure

In order to have the frontend examples working the password for the
webservices-only user `demodsfr` must be `simplicite`.

This can be achieved by importing the following XML:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<simplicite xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.simplicite.fr/base" xsi:schemaLocation="http://www.simplicite.fr/base https://www.simplicite.io/resources/schemas/base.xsd">
<object>
	<name>UserPwd</name>
	<action>update</action>
	<data>
		<usr_login_read>demodsfr</usr_login_read>
		<usr_password>simplicite</usr_password>
	</data>
</object>
</simplicite>
```

`DemoDSFR` external object definition
-------------------------------------

Frontend using the DSFR toolkit


