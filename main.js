
(function () {
    self.Board = function (width, height) {
        this.width = width;
        this.height = height;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }
    self.Board.prototype = {
        get elements() {
            let elements = this.bars.map(function (bar) { return bar; });
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
        this.speed_y = 5;
        this.speed_x = 13;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI / 12;
        this.speed = 13;

        board.ball = this;
        this.kind = "circle";
    }
    self.Ball.prototype = {
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width() {
            return this.radius * 2;
        },
        get height() {
            return this.radius * 2;
        },
        collision: function (bar) {
            // reacciona a la colision con una barra que recibe como parametro
            let relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;
            let normalized_intersect_y = relative_intersect_y / (bar.height / 2);
            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) this.direction = -1;
            else this.direction = 1;
        }
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
                draw(this.ctx, el);
            };
        },
        check_collisions: function () {
            for (let i = this.board.bars.length - 1; i >= 0; i--) {
                let bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            };
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }
    function hit(a, b) {
        let hit = false;
        // colisiones horizontales
        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            // coliciones verticales
            if (b.y + b.height >= a.y && b.y < a.y + a.height)
                hit = true;
        }
        // coliciones de a con b
        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height)
                hit = true;
        }
        // coliciones de b con a
        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height)
                hit = true;
        }
        return hit;
    }
    function draw(ctx, element) {
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
})();

let board = new Board(800, 400);
let bar = new Bar(20, 100, 40, 100, board);
let bar2 = new Bar(735, 100, 40, 100, board);
let canvas = document.getElementById('canvas');
let board_view = new BoardView(canvas, board);
let ball = new Ball(350, 100, 10, board);

document.addEventListener("keydown", function (ev) {
    // console.log(ev.keyCode);
    if (ev.keyCode == 87) {
        ev.preventDefault();
        bar.up();
    }
    else if (ev.keyCode == 83) {
        ev.preventDefault();
        bar.down();
    }
    else if (ev.keyCode == 73) {
        ev.preventDefault();
        bar2.up();
    }
    else if (ev.keyCode == 75) {
        ev.preventDefault();
        bar2.down();
    }
    else if (ev.keyCode == 32) {
        ev.preventDefault();
        board.playing = !board.playing;
    }
    console.log("" + bar);
    // console.log(bar.toString()); 
})
board_view.draw();
// window.addEventListener("load", main);
window.requestAnimationFrame(controller);

function controller() {
    // console.log('Hola mundo')
    // console.log(board);
    board_view.play();
    window.requestAnimationFrame(controller);
}