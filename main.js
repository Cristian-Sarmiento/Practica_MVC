
(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements() {
            let elements = this.bars;
            elements.push(this.ball);
            return elements;
        }
    }
})();
(function () {
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;

        board.ball = this;
        this.kind = "circle";

    }


}());

(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 15;
        // console.log('entra al constructor')
    }

    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "x: " + this.x + " y: " + this.y;
        }
    }

})();

(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.height;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }

    self.BoardView.prototype = {
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.height);
        },
        draw: function () {
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                let el = this.board.elements[i];
                // console.log(el)
                draw(this.ctx, el);
            };
        },
        play: function () {
            this.clean();
            this.draw();
        }
    }

    function draw(ctx, element) {
        // console.log('holas', element)
        // if(element !== null && element.hasOwnProperty("kind")){

        switch (element.kind) {
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
            case "rectangle":
                // console.log('prueba final')
                // console.log(element.x, element.y, element.width, element.height)
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
        }
    }
    // }

})();

let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById('canvas');
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);


document.addEventListener("keydown", function (ev) {
    // console.log(ev.keyCode);
    ev.preventDefault();
    if (ev.keyCode == 87) {
        bar.up();
    }
    else if (ev.keyCode == 83) {
        bar.down();
    }
    else if (ev.keyCode == 73) {
        bar2.up();
    }
    else if (ev.keyCode == 75) {
        bar2.down();
    }
    console.log("" + bar);
    // console.log(bar.toString()); 
})

// window.addEventListener("load", main);
window.requestAnimationFrame(controller);

function controller() {
    // console.log('Hola mundo')
    // console.log(board);
    board_view.play();
    window.requestAnimationFrame(controller);
}