Шибениця (гра)
------
### Структура проекту:
* res/words.json
* res/xarrowFont.otf 
* script.js
* style.css
* index.html

### Запуск:
1) Завантажити усi файли проекту у одну папку
2) Запустити сервер з даної папки або вікрити index.html у браузері  
При запуску без серверу слід використовувати Microsoft Edge чи Firefox. Google chrome блокує доступ до файла зі словами через file://  
 `blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https.`

### Альтернативний запуск:
Перейти за [посиланням](https://antonnnnn13.gitlab.io/hangman/) на gitlab pages

### Cумiснiсть:
#### Гра написана з використанням особливостей ECMAScript6 та адаптована для мобiльних пристроїв.
Працездатнiсть гри була перевiрена на:
* Google Chrome 70
* Google Chrome Android 70
* Microsoft Edge 17
* Mozilla Firefox 63

### База слiв:
База слiв, якi використовує гра, мicтиться у файлi 'res/words.json'.  
Структура файла: {"категорiя_слiв" : ["слово_1", "слово2"]}  
У грi використовуются англомовнi слова без цифер та знакiв.