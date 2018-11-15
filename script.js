(function (w, d) {

    const hangman = new Hangman();
    const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
        'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    let init = setInterval(()=>{
        if(hangman.invoke() == 7) {
            clearInterval(init);
            let q = d.querySelector('.canvas-container');
            q.style.animation = "move-gallows 2s";
            classReplace(q, 'flex-max', 'flex-third');
            openJson('./res/words.json')
                .then(data=>{
                    setTimeout(()=>{ inGame(JSON.parse(data), hangman) } , 1000)
                })
                .catch(()=>{
                    setTimeout(()=>{ popUp('Error loading words', true); } , 1000)
                });
        }
    }, 400);


    function inGame(wordsData, hangmanObj) {
        const textBox = d.querySelector('.game-logo');
        const gameContainer = d.querySelector('.game-container');

        let words = wordsData;
        let category = '';
        let hangman = hangmanObj;
        let wishedWord = [];
        let userWord = [];
        let inputAllowed = true;
        let keys = getKeyboard(tryLetter);

        hangman.clearBody();
        keys.classList.add('flex-half', 'keyboard');
        gameContainer.appendChild(keys);
        guessWord();


        function guessWord() {
            [category, wishedWord] = getRandomWord(words);
            userWord = Array(wishedWord.length).fill('_');
            [userWord[0], userWord[userWord.length-1]] = [wishedWord.splice(0,1,''), wishedWord.splice(-1,1,'')];
            [wishedWord[0], wishedWord[wishedWord.length-1]] = ['', ''];
            setWord();
        }


        function tryLetter(letter) {
            if(!inputAllowed) return;

            let index = wishedWord.indexOf(letter.innerText);
            if(index != -1) {
                userWord[index] = letter.innerText;
                textBox.innerText = `Word(${category}):\n ${userWord.join(' ')}`;
                wishedWord[index] = '';
                if(userWord.indexOf('_') == -1) {
                    reset('Congrats. You win this time. Let\'s try again?');
                }
            } else {
                classReplace(letter, 'btn-primary', 'btn-wrong');
                letter.onclick = null;
                hangman.invoke();
                if(hangman.currentStep > 5) {
                    reset('Ups. Looks like you loose. Try again');
                }
            }
        }


        function setWord(preset) {
            classReplace(textBox, 'show-header', 'hide-header');
            setTimeout(()=>{
                textBox.innerText = (preset)? preset : `Word(${category}):\n ${userWord.join(' ')}`;
                classReplace(textBox, 'hide-header', 'show-header');
            }, 1000);
        }


        function reset(infoMsg) {
            inputAllowed = false;
            classReplace(gameContainer, 'show-game-content', 'hide-game-content');
            classReplace(textBox, 'show-header', 'hide-header');
            popUp(infoMsg);
            setTimeout(()=>{
                let newKeys = getKeyboard(tryLetter);
                newKeys.classList.add('flex-half', 'keyboard');
                hangman.clearBody();
                d.querySelector('.keyboard').replaceWith(newKeys);
                classReplace(gameContainer, 'hide-game-content', 'show-game-content');
                guessWord();
                inputAllowed = true;
            }, 5000);
        }
    }


    function classReplace(node, was, became) {
        if(node.classList.contains(was)) {
            node.classList.remove(was);
        }
        if(became) {
            node.classList.add(became);
        }
        return node;
    }


    function getKeyboard(callback) {
        return alphabet.reduce(function (prev, current) {
            let btn = d.createElement('button');
            btn.classList.add('btn-primary');
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


    function popUp(msg,endless) {
        let popUp = d.createElement('h1');
        popUp.innerText = msg;
        popUp.classList.add('pop-up');
        d.body.appendChild(popUp);
        if(!endless) {
            setTimeout(()=>{ classReplace(popUp, '', 'hide') }, 5000);
            setTimeout(()=>{ document.body.removeChild(popUp)}, 6000);
        }
    }

    //drawable prop
    function Hangman() {
        let gallows = document.querySelector('svg').children;

        this.currentStep = 0;

        this.drawHead = function () {
            classReplace(gallows[1], 'invisible');
        };

        this.drawBody = function () {
            classReplace(gallows[2], 'invisible');
        };

        this.drawHand = function (second) {
            if(second) {
                classReplace(gallows[4], 'invisible');
            } else {
                classReplace(gallows[3], 'invisible');
            }
        };

        this.drawLeg = function (second) {
            if(second) {
                classReplace(gallows[6], 'invisible');
            } else {
                classReplace(gallows[5], 'invisible');
            }
        };

        this.clearBody = function () {
            this.currentStep = 0;
            for(let i = 1; i < gallows.length; i++) {
                gallows[i].classList.add('invisible');
            }
        };

        this.invoke = function () {
            switch (this.currentStep) {
                case 0: {this.drawHead(); break;}
                case 1: {this.drawBody(); break;}
                case 2: {this.drawHand(); break;}
                case 3: {this.drawHand(true); break;}
                case 4: {this.drawLeg(); break;}
                case 5: {this.drawLeg(true); break;}
            }
            return ++this.currentStep;
        }
    }


})(window, document);