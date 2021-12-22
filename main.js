
(function (){
 self.Board = function(width, height){
    this.width = width;
    this.height = height;
    this.playing = false;
    this.game_over = false;
    this.bars = [];
    this.ball = null;
}

self.Board.prototype = {
    get elements (){
        let elements = this.bars;
        elements.push(this.ball);
        return elements;
    }
}
})();

(function(){
self.Bar = function(x,y,width,height,board){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.board = board;
    this.board.bars.push(this);
    this.kind = "rectangle";
    this.speed = 10;
    // console.log('entra al constructor')
}

self.Bar.prototype = {
    down: function(){
        this.y += this.speed;
    },
    up: function(){
        this.y -= this.speed;
    },
    toString: function(){
        return "x: " + this.x + " y: " +this.y;
    }
}

})();

(function (){
self.BoardView = function(canvas, board){
    this.canvas = canvas;
    this.canvas.width = board.width;
    this.canvas.height = board.height;
    this.board = board;
    this.ctx = canvas.getContext("2d");
}

self.BoardView.prototype = { 
    draw: function (){
        for (let i = this.board.elements.length - 1; i >=0; i--){
            let el = this.board.elements[i];
            // console.log(el)
            draw(this.ctx, el);
        };
    }
}

function draw(ctx, element){
    // console.log('holas', element)
    if(element !== null && element.hasOwnProperty("kind")){
       
        switch(element.kind){
            case "rectangle":
                // console.log('prueba final')
                // console.log(element.x, element.y, element.width, element.height)
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
    }
    }
}

})();

let board = new Board(800, 400);
let bar = new Bar(20,100,40,100,board);
let bar2 = new Bar(735,100,40,100,board);
let canvas = document.getElementById('canvas');
let board_view = new BoardView(canvas, board);

document.addEventListener("keydown", function(ev){
    // console.log(ev.keyCode);
    if(ev.keyCode == 87){   
        bar.up();
    }
    else if(ev.keyCode == 83){
        bar.down();
    }
    console.log(""+bar); 
    // console.log(bar.toString()); 
})

window.addEventListener("load", main);

function main(){
console.log('Hola mundo')
console.log(board);
board_view.draw();
}