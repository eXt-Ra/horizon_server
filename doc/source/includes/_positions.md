# Positions

## Get position | numéro de colis

```shell
curl --request GET \
  --url 'http://horizon.jeantettransport.com/api/getpos?parcel_number=1234567890' \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/getpos');
$request->setMethod(HTTP_METH_GET);

$request->setQueryData(array(
  'parcel_number' => '1234567890'
));

$request->setHeaders(array(
  'x-access-token' => 'VOTREACCESSTOKEN'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://horizon.jeantettransport.com/api/getpos?parcel_number=1234567890");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'GET',
  url: 'http://horizon.jeantettransport.com/api/getpos',
  qs: { parcel_number: '1234567890' },
  headers: { 'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

});
```

> Reponse JSON

```json
{
    "idPosition": 2683873,
    "numPosition": "1703006128",
    "refClient": null,
    "nbColis": 2,
    "nbPalette": 1,
    "poids": 0.3,
    "ml": 0,
    "col": 0,
    "colisSurPal": 0,
    "dateImpLiv": "1900-01-01T00:00:00.000Z",
    "clientNom": "DEALTIS",
    "expediteurNom": "DEALTIS",
    "expediteurAdresse": "10 RUE CLAUDE GIRARD",
    "expediteurVille": "VAUX LES PRES",
    "expediteurCp": "25770",
    "chargementNom": "DEALTIS",
    "chargementAdresse": "10 RUE CLAUDE GIRARD",
    "chargementVille": "VAUX LES PRES",
    "chargementCp": "25770",
    "livraisonNom": "PRO A PRO",
    "livraisonAdresse": null,
    "livraisonVille": "ABBANS DESSOUS",
    "livraisonCp": "25320",
    "zoneQuaiTheorique": null,
    "codebarre": [
        {
            "numero": "1703006128001",
            "dateDechargement": "2017-05-19T14:54:18.720Z",
            "dateChargement": "2017-05-18T14:48:33.240Z",
            "dateInventaire": "2017-05-19T14:54:38.116Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        },
        {
            "numero": "1703006128002",
            "dateDechargement": "2017-05-19T14:54:18.723Z",
            "dateChargement": "2017-04-04T13:55:34.960Z",
            "dateInventaire": "2017-05-19T14:57:40.753Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        },
        {
            "numero": "1703006128003",
            "dateDechargement": "2017-05-19T14:54:18.730Z",
            "dateChargement": "2017-04-04T13:55:35.746Z",
            "dateInventaire": "2017-05-19T14:54:38.120Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        }
    ],
    "societe": "STJ25",
    "evenement": [
        {
            "code": "COMPLET",
            "libelle": "COMPLET",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "INVQUAI",
            "libelle": "INVQUAI",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "COMPLET",
            "libelle": "COMPLET",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "AARAVA",
            "libelle": "MOUILLE",
            "date": "2017-05-19T14:21:00.000Z",
            "remarque": null,
            "information": null
        }
    ]
}
```

### HTTP Request

Retourne les informations de la position.

`GET http://horizon.jeantettransport.com/api/getpos`

### Query Parameters

Parameter     | Description                                      | Default
------------- | ------------------------------------------------ | -------
parcel_number | Numéro de colis                                  | /
only_parcel   | Si true, retourne uniquement les infos du colis. | false

## Get position | numéro de position

```shell
curl --request GET \
  --url 'http://horizon.jeantettransport.com/api/getpos?position_number=1234567890' \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/getpos');
$request->setMethod(HTTP_METH_GET);

$request->setQueryData(array(
  'position_number' => '1234567890'
));

$request->setHeaders(array(
  'x-access-token' => 'VOTREACCESSTOKEN'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://horizon.jeantettransport.com/api/getpos?position_number=1234567890");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'GET',
  url: 'http://horizon.jeantettransport.com/api/getpos',
  qs: { position_number: '1234567890' },
  headers: { 'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

});
```

> Reponse JSON

```json
{
    "idPosition": 2683873,
    "numPosition": "1703006128",
    "refClient": null,
    "nbColis": 2,
    "nbPalette": 1,
    "poids": 0.3,
    "ml": 0,
    "col": 0,
    "colisSurPal": 0,
    "dateImpLiv": "1900-01-01T00:00:00.000Z",
    "clientNom": "DEALTIS",
    "expediteurNom": "DEALTIS",
    "expediteurAdresse": "10 RUE CLAUDE GIRARD",
    "expediteurVille": "VAUX LES PRES",
    "expediteurCp": "25770",
    "chargementNom": "DEALTIS",
    "chargementAdresse": "10 RUE CLAUDE GIRARD",
    "chargementVille": "VAUX LES PRES",
    "chargementCp": "25770",
    "livraisonNom": "PRO A PRO",
    "livraisonAdresse": null,
    "livraisonVille": "ABBANS DESSOUS",
    "livraisonCp": "25320",
    "zoneQuaiTheorique": null,
    "codebarre": [
        {
            "numero": "1703006128001",
            "dateDechargement": "2017-05-19T14:54:18.720Z",
            "dateChargement": "2017-05-18T14:48:33.240Z",
            "dateInventaire": "2017-05-19T14:54:38.116Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        },
        {
            "numero": "1703006128002",
            "dateDechargement": "2017-05-19T14:54:18.723Z",
            "dateChargement": "2017-04-04T13:55:34.960Z",
            "dateInventaire": "2017-05-19T14:57:40.753Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        },
        {
            "numero": "1703006128003",
            "dateDechargement": "2017-05-19T14:54:18.730Z",
            "dateChargement": "2017-04-04T13:55:35.746Z",
            "dateInventaire": "2017-05-19T14:54:38.120Z",
            "quiDechargement": "RVANARDO",
            "quiChargement": "RVANARDO",
            "quiInventaire": "RVANARDO",
            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
        }
    ],
    "societe": "STJ25",
    "evenement": [
        {
            "code": "COMPLET",
            "libelle": "COMPLET",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "INVQUAI",
            "libelle": "INVQUAI",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "COMPLET",
            "libelle": "COMPLET",
            "date": "2017-05-19T14:54:00.000Z",
            "remarque": null,
            "information": null
        },
        {
            "code": "AARAVA",
            "libelle": "MOUILLE",
            "date": "2017-05-19T14:21:00.000Z",
            "remarque": null,
            "information": null
        }
    ]
}
```

### HTTP Request

Retourne les informations de la position.

`GET http://horizon.jeantettransport.com/api/getpos`

### Query Parameters

Parameter       | Description                                 | Default
--------------- | ------------------------------------------- | -------
position_number | Numéro de position                          | /
exclude_parcel  | Si true, supprime les infos des colis.      | false
exclude_event   | Si true, supprime les infos des évènements. | false

## Get positions | numéro de groupage

```shell
curl --request GET \
  --url 'http://horizon.jeantettransport.com/api/getpos?groupage_number=1234567890' \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/getpos');
$request->setMethod(HTTP_METH_GET);

$request->setQueryData(array(
  'groupage_number' => '1234567890'
));

$request->setHeaders(array(
  'x-access-token' => 'VOTREACCESSTOKEN'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://horizon.jeantettransport.com/api/getpos?groupage_number=1234567890");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'GET',
  url: 'http://horizon.jeantettransport.com/api/getpos',
  qs: { groupage_number: '1234567890' },
  headers: { 'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

});
```

> Reponse JSON

```json
[
	{
	    "idPosition": 2683873,
	    "numPosition": "1703006128",
	    "refClient": null,
	    "nbColis": 2,
	    "nbPalette": 1,
	    "poids": 0.3,
	    "ml": 0,
	    "col": 0,
	    "colisSurPal": 0,
	    "dateImpLiv": "1900-01-01T00:00:00.000Z",
	    "clientNom": "DEALTIS",
	    "expediteurNom": "DEALTIS",
	    "expediteurAdresse": "10 RUE CLAUDE GIRARD",
	    "expediteurVille": "VAUX LES PRES",
	    "expediteurCp": "25770",
	    "chargementNom": "DEALTIS",
	    "chargementAdresse": "10 RUE CLAUDE GIRARD",
	    "chargementVille": "VAUX LES PRES",
	    "chargementCp": "25770",
	    "livraisonNom": "PRO A PRO",
	    "livraisonAdresse": null,
	    "livraisonVille": "ABBANS DESSOUS",
	    "livraisonCp": "25320",
	    "zoneQuaiTheorique": null,
	    "codebarre": [
	        {
	            "numero": "1703006128001",
	            "dateDechargement": "2017-05-19T14:54:18.720Z",
	            "dateChargement": "2017-05-18T14:48:33.240Z",
	            "dateInventaire": "2017-05-19T14:54:38.116Z",
	            "quiDechargement": "RVANARDO",
	            "quiChargement": "RVANARDO",
	            "quiInventaire": "RVANARDO",
	            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
	        },
	        {
	            "numero": "1703006128002",
	            "dateDechargement": "2017-05-19T14:54:18.723Z",
	            "dateChargement": "2017-04-04T13:55:34.960Z",
	            "dateInventaire": "2017-05-19T14:57:40.753Z",
	            "quiDechargement": "RVANARDO",
	            "quiChargement": "RVANARDO",
	            "quiInventaire": "RVANARDO",
	            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
	        },
	        {
	            "numero": "1703006128003",
	            "dateDechargement": "2017-05-19T14:54:18.730Z",
	            "dateChargement": "2017-04-04T13:55:35.746Z",
	            "dateInventaire": "2017-05-19T14:54:38.120Z",
	            "quiDechargement": "RVANARDO",
	            "quiChargement": "RVANARDO",
	            "quiInventaire": "RVANARDO",
	            "zoneDeQuai": "P.6 TREPILLOT PALETTE"
	        }
	    ],
	    "societe": "STJ25",
	    "evenement": [
	        {
	            "code": "COMPLET",
	            "libelle": "COMPLET",
	            "date": "2017-05-19T14:54:00.000Z",
	            "remarque": null,
	            "information": null
	        },
	        {
	            "code": "INVQUAI",
	            "libelle": "INVQUAI",
	            "date": "2017-05-19T14:54:00.000Z",
	            "remarque": null,
	            "information": null
	        },
	        {
	            "code": "COMPLET",
	            "libelle": "COMPLET",
	            "date": "2017-05-19T14:54:00.000Z",
	            "remarque": null,
	            "information": null
	        },
	        {
	            "code": "AARAVA",
	            "libelle": "MOUILLE",
	            "date": "2017-05-19T14:21:00.000Z",
	            "remarque": null,
	            "information": null
	        }
	    ]
	}
]
```

### HTTP Request

Retourne les positions d'un groupage.

`GET http://horizon.jeantettransport.com/api/getpos`

### Query Parameters

Parameter       | Description                                               | Default
--------------- | --------------------------------------------------------- | -------
groupage_number | Numéro de groupage                                        | /
exclude_parcel  | Si true, supprime les infos des colis des positions.      | false
exclude_event   | Si true, supprime les infos des évènements des positions. | false

## Get positions | nom du chauffeur

```shell
curl --request GET \
  --url 'http://horizon.jeantettransport.com/api/getpos?driver_name=JDOE' \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/getpos');
$request->setMethod(HTTP_METH_GET);

$request->setQueryData(array(
  'driver_name' => 'JDOE'
));

$request->setHeaders(array(
  'x-access-token' => 'VOTREACCESSTOKEN'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://horizon.jeantettransport.com/api/getpos?driver_name=JDOE");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'GET',
  url: 'http://horizon.jeantettransport.com/api/getpos',
  qs: { driver_name: 'JDOE' },
  headers: { 'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

});
```

> Reponse JSON

```json
[
  {
      "idPosition": 2683873,
      "numPosition": "1703006128",
      "refClient": null,
      "nbColis": 2,
      "nbPalette": 1,
      "poids": 0.3,
      "ml": 0,
      "col": 0,
      "colisSurPal": 0,
      "dateImpLiv": "1900-01-01T00:00:00.000Z",
      "clientNom": "DEALTIS",
      "expediteurNom": "DEALTIS",
      "expediteurAdresse": "10 RUE CLAUDE GIRARD",
      "expediteurVille": "VAUX LES PRES",
      "expediteurCp": "25770",
      "chargementNom": "DEALTIS",
      "chargementAdresse": "10 RUE CLAUDE GIRARD",
      "chargementVille": "VAUX LES PRES",
      "chargementCp": "25770",
      "livraisonNom": "PRO A PRO",
      "livraisonAdresse": null,
      "livraisonVille": "ABBANS DESSOUS",
      "livraisonCp": "25320",
      "zoneQuaiTheorique": null,
      "codebarre": [
          {
              "numero": "1703006128001",
              "dateDechargement": "2017-05-19T14:54:18.720Z",
              "dateChargement": "2017-05-18T14:48:33.240Z",
              "dateInventaire": "2017-05-19T14:54:38.116Z",
              "quiDechargement": "RVANARDO",
              "quiChargement": "RVANARDO",
              "quiInventaire": "RVANARDO",
              "zoneDeQuai": "P.6 TREPILLOT PALETTE"
          },
          {
              "numero": "1703006128002",
              "dateDechargement": "2017-05-19T14:54:18.723Z",
              "dateChargement": "2017-04-04T13:55:34.960Z",
              "dateInventaire": "2017-05-19T14:57:40.753Z",
              "quiDechargement": "RVANARDO",
              "quiChargement": "RVANARDO",
              "quiInventaire": "RVANARDO",
              "zoneDeQuai": "P.6 TREPILLOT PALETTE"
          },
          {
              "numero": "1703006128003",
              "dateDechargement": "2017-05-19T14:54:18.730Z",
              "dateChargement": "2017-04-04T13:55:35.746Z",
              "dateInventaire": "2017-05-19T14:54:38.120Z",
              "quiDechargement": "RVANARDO",
              "quiChargement": "RVANARDO",
              "quiInventaire": "RVANARDO",
              "zoneDeQuai": "P.6 TREPILLOT PALETTE"
          }
      ],
      "societe": "STJ25",
      "evenement": [
          {
              "code": "COMPLET",
              "libelle": "COMPLET",
              "date": "2017-05-19T14:54:00.000Z",
              "remarque": null,
              "information": null
          },
          {
              "code": "INVQUAI",
              "libelle": "INVQUAI",
              "date": "2017-05-19T14:54:00.000Z",
              "remarque": null,
              "information": null
          },
          {
              "code": "COMPLET",
              "libelle": "COMPLET",
              "date": "2017-05-19T14:54:00.000Z",
              "remarque": null,
              "information": null
          },
          {
              "code": "AARAVA",
              "libelle": "MOUILLE",
              "date": "2017-05-19T14:21:00.000Z",
              "remarque": null,
              "information": null
          }
      ]
  }
]
```

### HTTP Request

Retourne les positions d'un groupage.

`GET http://horizon.jeantettransport.com/api/getpos`

### Query Parameters

Parameter       | Description                                               | Default
--------------- | --------------------------------------------------------- | -------
driver_name | Nom du chauffeur | /
exclude_parcel  | Si true, supprime les infos des colis des positions.      | false
exclude_event   | Si true, supprime les infos des évènements des positions. | false
date   | Si rensigné, renvoi le groupage de la date renseigné | Date du jour | /

## Update position

```shell
curl --request POST \
  --url http://horizon.jeantettransport.com/api/updatepos \
  --header 'content-type: application/json' \
  --header 'x-access-token: VOTREACCESSTOKEN' \
  --data '[\n      {\n        "field":"expediteurNom",\n        "value": "Transporteur"\n      },{\n        "field":"refClient",\n        "value": "859678"\n      }\n    ]\n'
  ```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/updatepos');
$request->setMethod(HTTP_METH_POST);

$request->setHeaders(array(
  'content-type' => 'application/json',
  'x-access-token' => 'VOTREACCESSTOKEN'
));

$request->setBody('[
      {
        "field":"expediteurNom",
        "value": "Transporteur"
      },{
        "field":"refClient",
        "value": "859678"
      }
    ]
');

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var data = JSON.stringify([
  {
    "field": "expediteurNom",
    "value": "Transporteur"
  },
  {
    "field": "refClient",
    "value": "859678"
  }
]);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "http://horizon.jeantettransport.com/api/updatepos");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");
xhr.setRequestHeader("content-type", "application/json");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'POST',
  url: 'http://horizon.jeantettransport.com/api/updatepos',
  headers:
   { 'content-type': 'application/json',
     'x-access-token': 'VOTREACCESSTOKEN' },
  body:
   [ { field: 'expediteurNom', value: 'Transporteur' },
     { field: 'refClient', value: '859678' } ],
  json: true };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### HTTP Request

Update d'une position.

`POST http://horizon.jeantettransport.com/api/updatepos`

### Body
`
[
  {
    "field":"nomDuChamp",
    "value": "nouvelleValeur"
  },{
    ...
  }
]
`

## Delete position

```shell
curl --request POST \
  --url 'http://horizon.jeantettransport.com/api/deletepos?position_num=1758459675' \
  --header 'content-type: application/json' \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/deletepos');
$request->setMethod(HTTP_METH_POST);

$request->setQueryData(array(
  'position_num' => '1758459675'
));

$request->setHeaders(array(
  'content-type' => 'application/json',
  'x-access-token' => 'VOTREACCESSTOKEN'
));

try {
  $response = $request->send();

  echo $response->getBody();
} catch (HttpException $ex) {
  echo $ex;
}
```

```javascript--browser
var data = JSON.stringify(false);

var xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", function () {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("POST", "http://horizon.jeantettransport.com/api/deletepos?position_num=1758459675");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");
xhr.setRequestHeader("content-type", "application/json");

xhr.send(data);
```

```javascript--node
var request = require("request");

var options = { method: 'POST',
  url: 'http://horizon.jeantettransport.com/api/deletepos',
  qs: { position_num: '1758459675' },
  headers:
   { 'content-type': 'application/json',
     'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});

```

### HTTP Request

Suppression d'une position.

`POST http://horizon.jeantettransport.com/api/deletepos`

### Query Parameters

Parameter       | Description                                               | Default
--------------- | --------------------------------------------------------- | -------
position_number | Numéro de la position à supprimer | /
