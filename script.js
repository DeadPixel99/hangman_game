(function (w, d) {
    //drawable prop
    function Hangman(ctx) {
        this.ctx = ctx;
        this.currentStep = 0;
        this.drawGallows();
    }
    Hangman.prototype = {
        drawGallows: function () {
            this.ctx.beginPath();
            this.ctx.moveTo(100, 400);
            this.ctx.lineTo(135, 370);
            this.ctx.lineTo(170, 400);
            this.ctx.moveTo(135, 370);
            this.ctx.lineTo(135, 100);
            this.ctx.lineTo(280, 100);
            this.ctx.lineTo(280, 150);
            this.ctx.moveTo(180, 100);
            this.ctx.lineTo(135, 150);
            this.ctx.stroke();
            return this;
        },
        drawHead: function () {
            this.ctx.beginPath();
            this.ctx.arc(280,170,20,0,2*Math.PI);
            this.ctx.stroke();
        },
        drawBody: function () {
            this.ctx.beginPath();
            this.ctx.ellipse(280, 240, 30, 50, 0, 0, Math.PI*2);
            this.ctx.stroke();
        },
        drawHand: function (two) {
            this.ctx.beginPath();
            if(two) {
                this.ctx.moveTo(300, 200);
                this.ctx.lineTo(350, 220);
            } else {
                this.ctx.moveTo(260, 200);
                this.ctx.lineTo(210, 220);
            }
            this.ctx.stroke();
        },
        drawLegs: function (two) {
            this.ctx.beginPath();
            if(two) {
                this.ctx.moveTo(300, 275);
                this.ctx.lineTo(320, 330);
            } else {
                this.ctx.moveTo(260, 275);
                this.ctx.lineTo(240, 330);
            }
            this.ctx.stroke();
        },
        invoke: function () {
            switch (this.currentStep) {
                case 0: {this.drawHead(); break;}
                case 1: {this.drawBody(); break;}
                case 2: {this.drawHand(); break;}
                case 3: {this.drawHand(true); break;}
                case 4: {this.drawLegs(); break;}
                case 5: {this.drawLegs(true); break;}
            }
            return ++this.currentStep;
        },
        clearBody: function () {
            this.currentStep = 0;
            this.ctx.clearRect(0, 0, 500, 500);
            this.drawGallows();
        }
    };

    function classReplace(node, was, became) {
        if(node.classList.contains(was))
            node.classList.remove(was);
        node.classList.add(became);
        return node;
    }

    function getKeyboard(callback) {
        return alphabet.reduce(function (prev, current) {
            let btn = d.createElement('button');
            btn.classList.add('btn-letter', 'btn-primary');
            btn.onclick = function () {
                callback(btn);
            };
            btn.innerText = current;
            prev.appendChild(btn);
            return prev;
        }, d.createElement('div'));
    }

    function openJson(path) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', path, true);
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4) {
                    if(xhr.status == 200)
                        resolve(xhr.responseText);
                    reject(xhr.responseText);
                }
            };
            xhr.send(null);
        });
    }

    function getRandomWord(wordsObj) {
        let rCategory = Object.keys(wordsObj)[Math.floor(Math.random() * Object.keys(wordsObj).length)];
        return [rCategory, wordsObj[rCategory][Math.floor(Math.random() * wordsObj[rCategory].length)].toUpperCase().split('')];
    }

    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
                    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
                    'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    function inGame(wordsData, hangmanObj) {
        const textBox = d.querySelector('.game-logo');
        const gameContainer = d.querySelector('.game-container');

        let words = wordsData;
        let category = '';
        let hangman = hangmanObj;
        let wishedWord = [];
        let userWord = [];
        let inputAllowed = true;
        let keys = getKeyboard(function (e) {
            tryLetter(e);
        });

        hangman.clearBody();
        keys.classList.add('col-3', 'keyboard');
        gameContainer.appendChild(keys);
        guessWord();

        function guessWord() {
            [category, wishedWord] = getRandomWord(words);
            userWord = Array(wishedWord.length).fill('_');
            [userWord[0], userWord[userWord.length-1]] = [wishedWord[0], wishedWord[wishedWord.length-1]];
            setWord();
        }

        function tryLetter(letter) {
            if(!inputAllowed)
                return;
            let index = wishedWord.indexOf(letter.innerText);
            if(index != -1) {
                userWord[index] = letter.innerText;
                textBox.innerText = `Word(${category}): ${userWord.join(' ')}`;
                wishedWord[index] = '';
                if(userWord.indexOf('_') == -1) {
                    inputAllowed = false;
                    setWord('Congrats. You win this time. Let\'s try again?');
                    setTimeout(reset, 5000);
                }
            } else {
                classReplace(letter, 'btn-primary', 'btn-wrong');
                letter.onclick = null;
                hangman.invoke();
                if(hangman.currentStep > 5) {
                    inputAllowed = false;
                    setWord('Ups. Looks like you loose. Try again');
                    setTimeout(reset, 5000);
                }
            }
        }

        function setWord(preset) {
            classReplace(textBox, 'show-header', 'hide-header');
            setTimeout(()=>{
                textBox.innerText = (preset)? preset : `Word(${category}): ${userWord.join(' ')}`;
                classReplace(textBox, 'hide-header', 'show-header');
            }, 1000);
        }
        
        function reset() {
            classReplace(gameContainer, 'show-game-content', 'hide-game-content');
            setTimeout(()=>{
                let newKeys = getKeyboard(tryLetter);
                newKeys.classList.add('col-3', 'keyboard');
                hangman.clearBody();
                d.querySelector('.keyboard').replaceWith(newKeys);
                classReplace(gameContainer, 'hide-game-content', 'show-game-content');
                guessWord();
                inputAllowed = true;
            }, 1000);
        }
    }

    const gameCanvas = d.getElementById('canv');
    const hangman = new Hangman(gameCanvas.getContext('2d'));

    let init = setInterval(function () {
        if(hangman.invoke() == 7) {
            clearInterval(init);
            openJson('./res/words.json').then(data=>{
                let q = d.querySelector('.canvas-container');
                q.style.animation = "move-gallows 2s";
                classReplace(q, 'col-6', 'col-2');
                setTimeout(()=>{
                    inGame(JSON.parse(data), hangman)
                } , 1000) });
        }
    }, 400);



})(window, document);