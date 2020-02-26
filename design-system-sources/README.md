# Architecture Front-End

- Bootstrap 4.1.3 avec boilerplate
- BEM pour le nommage des class et id
- SASS pour le CSS
- jQuery ou Vanilla JS selon le besoin
- Accessibilité : RGAA (AA) exigé


# Génération du projet

- Installer NodeJS _(version projet : 8.16.0)_
- Installer NPM _(version projet : 6.4.1)_
- Lancer la commande :
```javascript
npm install --save-dev
```
- Le projet s'installe avec les dépendances node_modules
- Lancer la commande :
```javascript
gulp
```
- Le _gulpfile.js_ est interprété
- Le dossier *__public* est généré
- Dans le dossier *__public*, il y a 2 dossiers (site / design-system)
- - *site* contient les templates générés via le design sytem
- - *design-system* contient les composants du design system 
- Les assets (css, js, img) sont envoyés dans le theme drupal selon le lien référencé dans le _gulpfile.js_


# Si le GULP plante
Faire :

- rm -rf node_modules
- rm -rf package-lock.json
- npm cache clean --force
- npm install

source : https://github.com/gulpjs/gulp/issues/2162#issuecomment-384885950(https://github.com/gulpjs/gulp/issues/2162#issuecomment-384885950)