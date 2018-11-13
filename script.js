(function (w, d) {

function Hangman(ctx) {
    this.ctx = ctx;
    this.currentStep = 0;
}

Hangman.prototype = {
    drawGallows: function () {
        this.ctx.fillStyle = "black";
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
        this.ctx.moveTo(260, 200);
        this.ctx.lineTo(210, 220);
        if(two) {
            this.ctx.moveTo(300, 200);
            this.ctx.lineTo(350, 220);
        }
        this.ctx.stroke();
    },
    drawLegs: function (two) {
        this.ctx.beginPath();
        this.ctx.moveTo(260, 275);
        this.ctx.lineTo(240, 330);
        if(two) {
            this.ctx.moveTo(300, 275);
            this.ctx.lineTo(320, 330);
        }
        this.ctx.stroke();
    },
    invoke: function () {
        switch (this.currentStep) {
            case 0: {this.drawGallows(); break;}
            case 1: {this.drawHead(); break;}
            case 2: {this.drawBody(); break;}
            case 3: {this.drawHand(); break;}
            case 4: {this.drawHand(true); break;}
            case 5: {this.drawLegs(); break;}
            case 6: {this.drawLegs(true); break;}
        }
        return ++this.currentStep;
    }
};




let canv = d.getElementById('canv');

let h = new Hangman(canv.getContext('2d'));

setInterval(function () {
    h.invoke();
}, 1000)

})(window, document);