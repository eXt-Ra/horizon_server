---
title: API Reference

language_tabs:
  - shell
  - php
  - javascript--node
  - javascript--browser

toc_footers:
  - <a href='#'>Sign Up for a Developer Key</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

includes:
  - positions
  - errors

search: true
---

# Introduction

Bienvenue dans l'api Horizon. Vous pouvez utilisé cette API pour accéder aux API DMS et DCS

Vous pouvez voir les exemples de code en Shell, Ruby, Python et Javascript dans la zone sombre de droite.

# Authentication

> Pour chaque requête, ajoutez l'entête comme ceci :

```shell
curl --request GET \
  --url http://horizon.jeantettransport.com/api/tokentest \
  --header 'x-access-token: VOTREACCESSTOKEN'
```

```php
<?php
$request = new HttpRequest();
$request->setUrl('http://horizon.jeantettransport.com/api/tokentest');
$request->setMethod(HTTP_METH_GET);

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

```javascript--node
var request = require("request");

var options = { method: 'GET',
  url: 'http://horizon.jeantettransport.com/api/tokentest',
  headers: { 'x-access-token': 'VOTREACCESSTOKEN' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

```javascript--browser
const xhr = new XMLHttpRequest();
xhr.withCredentials = true;

xhr.addEventListener("readystatechange", () => {
  if (this.readyState === this.DONE) {
    console.log(this.responseText);
  }
});

xhr.open("GET", "http://horizon.jeantettransport.com/api/tokentest");
xhr.setRequestHeader("x-access-token", "VOTREACCESSTOKEN");
xhr.send(data);
```

> Vous devez remplacer <code>VOTREACCESSTOKEN</code> par votre token de connexion.

Horizon utilise un système de token de connexion. Vous pouvez demander votre token par mail.
Horizon attend que le token soit ajouté pour chaque entête de requête de l'api qui ressemble à la suivante :

`x-access-token: VOTREACCESSTOKEN`

<aside class="notice">
Vous devez remplacer <code>VOTREACCESSTOKEN</code> par votre token de connexion.
</aside>
