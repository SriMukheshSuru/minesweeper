var board=[];
var rows = 8;
var columns = 8;

var minescount = 15;

var mineslocation =[];
var tilesclicked = 0;//goal is click all times except the bomb ones

var flagenabled = false;
var gameover = false;
window.onload = function(){
    startgame();
}

function setmines(){
    // mineslocation.push("2-3");
    // mineslocation.push("2-2");
    // mineslocation.push("5-6");
    // mineslocation.push("3-4");
    // mineslocation.push("1-1");

    let minesleft = minescount;
    while(minesleft>0){
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);

        let id = r.toString() + "-" + c.toString();

        if(!mineslocation.includes(id)){
            mineslocation.push(id);
            minesleft-=1;
        }
    }
}

function startgame(){
    document.getElementById("mines-count").innerText = minescount;
    document.getElementById("flag-button").addEventListener("click",setflag);
    setmines();

    // populate board
    for(let r=0;r<rows;r++){
        let row = [];
        for(let c=0;c<columns;c++){
            let tile = document.createElement("div");
            tile.id=  r.toString() + "-" + c.toString();
            tile.addEventListener("click",clicktile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
    console.log(board);
}

function setflag(){
    if(flagenabled){
        flagenabled=false;
        document.getElementById("flag-button").style.backgroundColor = "lightgray";
    }else{
        flagenabled=true;
        document.getElementById("flag-button").style.backgroundColor = "darkgray";
    }
}



function clicktile(){
    if(gameover || this.classList.contains("tile-clicked")){
        return;
    }

    let tile = this;
    if(flagenabled){
        if(tile.innerText==""){
            tile.innerText = "🚩";
        }else if (tile.innerText == "🚩"){
            tile.innerText="";
        }
        return;
    }

    if(mineslocation.includes(tile.id)){
        alert("GAME OVER");
        gameover=true;
        revealmines();
        return;
    }

    let coord = tile.id.split("-");
    let r = parseInt(coord[0]);
    let c = parseInt(coord[1]);

    checkmine(r,c);
}


function revealmines(){
    for(let r=0;r<rows;r++){
        for(let c=0;c<columns;c++){
            let tile = board[r][c];
            if(mineslocation.includes(tile.id)){
                tile.innerText="💣";
                tile.style.backgroundColor="red";
            }
        }
    }
}

function checkmine(r,c){
    if(r<0||r>=rows||c<0||c>=columns){
        return;
    }
    if(board[r][c].classList.contains("tile-clicked")){
        return; 
    }

    board[r][c].classList.add("tile-clicked");
    tilesclicked+=1;
    let minesfound = 0;

    minesfound+= checktile(r-1,c-1);
    minesfound+=checktile(r-1,c);
    minesfound+=checktile(r-1,c+1);

    minesfound+=checktile(r,c-1);
    minesfound+=checktile(r,c+1);

    minesfound+=checktile(r+1,c-1);
    minesfound+=checktile(r+1,c);
    minesfound+=checktile(r+1,c+1);
    if(minesfound >0){
        board[r][c].innerText=minesfound;
        board[r][c].classList.add("x"+minesfound.toString());
    }else{
        checkmine(r-1,c-1);
        checkmine(r-1,c);
        checkmine(r-1,c+1);

        checkmine(r,c-1);
        checkmine(r,c+1);

        checkmine(r+1,c-1);
        checkmine(r+1,c);
        checkmine(r+1,c+1);
    }
    if(tilesclicked == (rows*columns) - minescount){
        document.getElementById("mines-count").innerText="You Won!!";
        gameover=true;
    }
}

function checktile(r,c){
    if(r<0||r>=rows||c<0||c>=columns){
        return 0;
    }

    if(mineslocation.includes(r.toString()+"-"+c.toString())){
        return 1;
    }
    return 0;
}



//30min completed