import React from 'react';
import ReactDOM from 'react-dom';
//import Line from 'react-line'; // error
import './index.css';
//import './vendor/bootstrap/css/bootstrap.css';
import {games} from './games.js';
//import './vendor/raphael.min.js'; // error
//import './vendor/react-lineto.js'; // error 'define' is not defined 

/* Standard JS functions for SVG help */
// ref: https://www.beyondjava.net/how-to-connect-html-elements-with-an-arrow-using-svg
function findAbsolutePosition(htmlElement) {
  var x = htmlElement.offsetLeft;
  var y = htmlElement.offsetTop;
  for (var x=0, y=0, el=htmlElement; 
       el != null; 
       el = el.offsetParent) {
         x += el.offsetLeft;
         y += el.offsetTop;
  }
  return {
      "x": x,
      "y": y
  };
}

// ref: https://tzi.fr/js/convert-em-in-px/ 
function getRootElementFontSize(e) {
  // Returns a number
  return parseFloat(
    // of the computed font-size, so in px
    getComputedStyle(
      e
    ).fontSize
  );
}


class Intersection extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      value: null, // -> {this.value} ??    
    };
  }
    
  render() {
    //console.log(this);
    let id = "i"+this.props.id;
    return (       
      <button className="intersection" value={this.props.value} id={id} ref={this.props.iRef} onClick={() => this.props.onClick()}>
      <small>{/*this.props.id*/} {/*this.props.value*/}</small> 
      </button>
    );
  }
}

class BoardGrid extends React.Component {
  render() {
    return (       
        <svg id="boardgrid">
            /* outer */
            <line x1="0.2em" y1="0em" x2="0.2em" y2="22em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="0.2em" y1="22em" x2="23em" y2="22em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="23em" y1="22em" x2="23em" y2="0em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="22em" y1="0.2em" x2="0.2em" y2="0.2em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 3-4-5-13-21-20-19-10-3 */
            <line x1="3em" y1="3.5em" x2="19.6em" y2="3.5em" style={{stroke:"grey",strokeWidth:"4"}} />            
            <line x1="19.6em" y1="3.5em" x2="19.5em" y2="18em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="19.6em" y1="18em" x2="3em" y2="18em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="3.5em" y1="18em" x2="3.5em" y2="3.5em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 6-7-8-12-18-17-16-11-6 */
            <line x1="7.5em" y1="7.25em" x2="15.5em" y2="7.25em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="15.25em" y1="7.25em" x2="15.25em" y2="15em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="15.25em" y1="14.5em" x2="7.5em" y2="14.5em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="7.5em" y1="14.5em" x2="7.5em" y2="7.25em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 9-10-11 */
            <line x1="0em" y1="11em" x2="8em" y2="11em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 12-13-14 */
            <line x1="15em" y1="11em" x2="23em" y2="11em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 1-4-7 */
            <line x1="11.5em" y1="0em" x2="11.5em" y2="7.25em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* 17-20-23 */
            <line x1="11.5em" y1="15em" x2="11.5em" y2="22em" style={{stroke:"grey",strokeWidth:"4"}} />
            /* diagonals */
            <line x1="0em" y1="0em" x2="7.5em" y2="7.25em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="23em" y1="0em" x2="15.25em" y2="7.25em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="23em" y1="22em" x2="15.25em" y2="14.5em" style={{stroke:"grey",strokeWidth:"4"}} />
            <line x1="0em" y1="22em" x2="8em" y2="14.5em" style={{stroke:"grey",strokeWidth:"4"}} />
        </svg>
    );
  }     
}

class PlayerCows extends React.Component {
  render() {  
    let classname = "intersection p"+this.props.player+"_cows";  
    let pieces = this.props.pieces;
    if (pieces.toString().length<2) { pieces = "       "+pieces.toString()+"    "; }
    return (
    /*
      <span className={classname}>
      {pieces}
      </span>*/
      <button className={classname}>{this.props.pieces}</button>       
    );
  }
}

class PlayerLabel extends React.Component {

  render() {
    let classname = "p"+this.props.player+"_label";
    return (
      <span className={classname}>       
      <span className={this.props.active?"status active":"status inactive"}>
      Player {this.props.player}
      </span>
      </span>
    );
  }
}

class Phase extends React.Component {
  
  render() {
    return (       
      <div id="phase">
        Player {this.props.player}&nbsp;{this.props.phase}
      </div>
    );
  }
}

class Message extends React.Component {
  
  render() {
    return (
        <span>       
        {this.props.message}
        </span>
    );
  }
}

class Undo extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (       
      <button className="morabutton" onClick={() => this.props.onClick()}>undo</button>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);
            
    // init state using game state prop passed
    this.state = {
         millPath: this.props.game.millPath,
         intersections: this.props.game.intersections,
         milled: this.props.game.milled,
         white: this.props.game.white,
         black: this.props.game.black,
         player: this.props.game.player,
         phase: this.props.game.phase,
         parentPhase: this.props.game.parentPhase,
         history: null,
         gameon: true,
         message: "",
    }    
  }

  /* check if player has (formed a new) mill */
  playerHasMill(player, intersections) { 
    let millPath = this.state.millPath;    
    let milled = this.state.milled;
    for (var c = 0; c < millPath.length; c++) {
        if (milled[c]) { continue; } 
        if (intersections[millPath[c][0]] === player && intersections[millPath[c][1]] === player && intersections[millPath[c][2]] === player) {
            return true;        
        }
    }
    // else
    return false;
  }
  
  /* helper: check if intersection is in a millPath */
  millPathHasIntersection(millPath, i)  {
    return (millPath[0] === i || millPath[1] === i || millPath[2] === i);
  }
  
  /* helper to check if millPath is milled by any player */
  millPathIsMilled(millPath, intersections) {
    for (var p = 1; p < 3; p++) {
        if (intersections[millPath[0]] === p && intersections[millPath[1]] === p && intersections[millPath[2]] === p) {
            return true;
        }
    } 
    // else
    return false;
  }
  
  /* check for winner */
  winner(phase, player, intersections) {
    // check for win at relevant phases    
    let winner = null;    
    if (phase ===  "Moving the cows a" || phase === "Flying the cows a") {        
        if (this.howManyPieces(1, intersections) < 3) {
            winner = 2;
        } else if (this.howManyPieces(2, intersections) < 3) {
            winner = 1;
        } // else if (!hasMoves(1) ... // else if ...
    }
    return winner;    
  }
  
  /* update all mills according to intersections */
  updateAllMills(intersections) {
    let milled = this.state.milled;
    for (var c = 0; c < milled.length; c++) {
        if (this.millPathIsMilled(this.state.millPath[c], intersections)) {
            milled[c] = true;
        } else {
            milled[c] = false;        
        }
    } 
    this.setState({milled: milled});     
  }
  
  /* return how many pieces player has on board */
  howManyPieces(player, intersections) {   
    let count = 0;
    for (var c = 0; c < intersections.length; c++) {    
        if (intersections[c] === player) { count++; }
    }
    return count;
  }
    
  handleClick(i) {
  
    if (!this.state.gameon) {
        return;
    }

    //copy instead of mutating //immutability is important //?
    const intersections = this.state.intersections.slice();     
    var parentPhase = this.state.parentPhase;
    var phase = this.state.phase;
    var player = this.state.player;
    var white = this.state.white;     
    var black = this.state.black;
    var gameon = this.state.gameon;      
    var message = this.state.message;     
    
    // remember history
    let history = {
        intersections: this.state.intersections,
        milled: this.state.milled,
        player: this.state.player,
        white: this.state.white,
        black: this.state.black,
        parentPhase: this.state.parentPhase,
        phase: this.state.phase,
        history: this.state.history,
    }
    this.setState({history: history});
    
    if (phase === "Placing the cows") {
        if (intersections[i] === 0) { // check if empty
            // place player piece 
            intersections[i] = player;
            // decrement player pieces
            if (player === 1) { black--; }
            if (player === 2) { white--; }        
            // check if mill
            let mill = this.playerHasMill(player, intersections);
            if (mill) {
               this.updateAllMills(intersections);
               // shooting
               parentPhase = "Placing the cows";
               phase = "Shooting a cow";
            } else {
               // toggle player
               player = (player===1)?2:1;                        
               if (white === 0 && black === 0) { // second phase?
                 phase = "Moving the cows a";
               }
            }               
        }
    } else if (phase === "Shooting a cow") {
        if (intersections[i] !== 0) { // check not empty // check opponent?
            intersections[i] = 0;
           // toggle player
           player = (player===1)?2:1;            
           // update milled
           this.updateAllMills(intersections);            
           // cycle, or progress phase
           if (parentPhase === "Placing the cows" && white === 0 && black === 0) { 
                phase = "Moving the cows a";
           } else {
                phase = parentPhase;
           }
        }
    } else if (phase === "Moving the cows a" || phase === "Flying the cows a") {
        if (intersections[i] === player) { // check player piece
            // 'pick up' piece
            intersections[i] = 0;
            // update milled
            this.updateAllMills(intersections);            
           // toggle phase
           phase = (phase === "Flying the cows a")?"Flying the cows b":"Moving the cows b";            
        }        
    }
    else if (phase === "Moving the cows b" || phase === "Flying the cows b") {
        if (intersections[i] === 0) { // check empty
            // place piece
            intersections[i] = player;
            // check if mill
            let mill = this.playerHasMill(player, intersections);
            if (mill) {
                this.updateAllMills(intersections);            
                // shooting
                parentPhase = phase.replace(" b"," a"); // parent phase -> "Placing the cows","Moving the cows a" || "Flying the cows a"
                phase = "Shooting a cow";
            } else {   
               // toggle player
               player = (player===1)?2:1;
            }           
           // cycle phase if not shooting
           if (phase !== "Shooting a cow") {
               //phase = (phase === "Flying the cows b")?"Flying the cows a":"Moving the cows a";
               phase = "Moving the cows a";
           }
       }
    }
    
    // Check for Flying the cows on per-player basis
    if (phase === "Moving the cows a" || phase === "Flying the cows a" ) { 
        if (this.howManyPieces(player, intersections) <= 3) {
            phase = "Flying the cows a";
        } else {
           phase = "Moving the cows a";
        }
    }  

    // output game object to console for copy/paste if required    
    let game = {
        intersections: intersections,
        milled: this.state.milled,
        player: player,
        white: white,
        black: black,
        parentPhase: parentPhase,        
        phase: phase,
        history: /*this.state.history*/ null, // skip history
    }
    console.log(game);         
    
    // mutate board state
    this.setState({intersections: intersections});    
    this.setState({parentPhase: parentPhase});
    this.setState({phase: phase});    
    this.setState({player: player});        
    this.setState({white: white}); 
    this.setState({black: black});
    
    // check winner
    let winner = this.winner(phase, player, intersections);
    if (winner) {
        message = "PLAYER "+winner+" WINS";
        gameon = false;        
        this.setState({message: message});
        this.setState({gameon: gameon});
    }
    // check for draw...
  }
  
  renderIntersection(i) {
    let intersection = <Intersection id={i} iRef={this.el= this.e = 'i'+i} value={this.state.intersections[i]} onClick={() => this.handleClick(i)}/>;
    //this.intersections[i] = this.e;
    return intersection;
  } 
  
  renderPlayerLabel(player, active, pieces) {
    let playerLabel = <PlayerLabel player={player} active={active} pieces={pieces}/>;    
    return playerLabel;
  } 
  
  renderPlayerCows(player, pieces) {
    let playerCows = <PlayerCows player={player} pieces={pieces} />;    
    return playerCows;    
  }  
  
  renderPhase(player, phase) {
    return <Phase player={player} phase={phase}/>;    
  }   
  
  renderMessage(message) {
    return <Message message={message}/>;    
  }     
  
  handleUndoClick() {
    if (this.state.history) {
        this.setState({intersections: this.state.history.intersections});    
        this.setState({phase: this.state.history.phase});    
        this.setState({player: this.state.history.player});        
        this.setState({white: this.state.history.white}); 
        this.setState({black: this.state.history.black});
        this.setState({history: this.state.history.history});    
        // output to console for game saving
        let game = {
            intersections: this.state.intersections,
            milled: this.state.milled,
            player: this.state.player,
            white: this.state.white,
            black: this.state.black,
            parentPhase: this.state.parentPhase,
            phase: this.state.phase,
            history: /*this.state.history*/ null, // skip history
        }
        console.log(game);        
    }
  }
  
  renderUndo() {
    let undo = <Undo onClick={() => this.handleUndoClick()}/>;    
    return undo;
  }   
    
  renderBoardIntersections() {
    return (
      <div id="boardintersections">
        <div className="board-row">
          {this.renderIntersection(0)}
          {this.renderIntersection(1)}
          {this.renderIntersection(2)}
        </div>
        <div className="board-row">
          {this.renderIntersection(3)}
          {this.renderIntersection(4)}
          {this.renderIntersection(5)}
          
        </div>
        <div className="board-row">
          {this.renderIntersection(6)}
          {this.renderIntersection(7)}
          {this.renderIntersection(8)}
        </div>
        <div className="board-row">
          {this.renderIntersection(9)}
          {this.renderIntersection(10)}
          {this.renderIntersection(11)}
          {this.renderIntersection(12)}
          {this.renderIntersection(13)}
          {this.renderIntersection(14)}          
        </div>
        <div className="board-row">
          {this.renderIntersection(15)}        
          {this.renderIntersection(16)}
          {this.renderIntersection(17)}
        </div>
        <div className="board-row">
          {this.renderIntersection(18)}        
          {this.renderIntersection(19)}
          {this.renderIntersection(20)}
          
        </div>
        <div className="board-row">
          {this.renderIntersection(21)}        
          {this.renderIntersection(22)}
          {this.renderIntersection(23)}
        </div>
      </div>
    );
 }
 
 renderBoardGrid() {
    return <BoardGrid />;
 }
    
  render() {
  
    // pass phase to board to modify cursor etc.
    let classname = "board "+this.state.phase.toLowerCase().replace(/ /g,"-");
    
    // {this.renderBoardGrid()} replaced with window.onload SVG
    return (
      <div>
      <div id="status">
      {this.renderPlayerCows(1, this.state.black)}
      {this.renderPlayerLabel(1,(this.state.player===1)?true:false,this.state.black)} 
       vs  {this.renderPlayerLabel(2,(this.state.player===2)?true:false,this.state.white)}
      {this.renderPlayerCows(2, this.state.white)}
      </div>
      <div id="message">
          {this.renderMessage(this.state.message)}
      </div>
      <div id="board" className={classname}> 
          {this.renderBoardIntersections()}
      </div>
      <div id="phase">
         {this.renderPhase(this.state.player, this.state.phase)}
      </div>
      <div id="undo">
        {this.renderUndo()}
      </div>
      </div>
    );
  }     
}

class Game extends React.Component {

  constructor(props) {
    super(props);

    // paths
    let path =[ [0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[9,10],[10,11],[12,13],[13,14],[15,16],[16,17],[18,19],[19,20],[21,22],[22,23],[0,9],[9,21],[3,10],[10,18],[6,11],[11,15],[1,4],[4,7],[16,19],[19,22],[8,12],[12,17],[5,13],[13,20],[2,14],[14,23],[0,3],[3,6],[2,5],[5,8],[21,18],[18,15],[23,20],[20,17] ];
    
    // available paths for mills
   let millPath = [ [0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[8,12,17],[5,13,20],[2,14,23],[1,4,7],[16,19,22],[0,3,6],[2,5,8],[17,20,23],[15,18,21] ];       

    // defaults
    this.game = {};
    this.game.intersections = Array(24).fill(0);
    this.game.milled = Array(20).fill(false); 
    this.game.parentPhase = null;
    this.game.phase = "Placing the cows"; // || "Shooting a cow 1" || "Shooting a cow 2" || "Moving the cows a" || "Moving the cows b"|| "Flying the cows a" || "Flying the cows b"
    this.game.player = 1; // 1 || 2
    // pieces to put down
    this.game.white = 12; 
    this.game.black = 12;
        
    /* saved games in games.js */
    //this.game = games.nearlymovingcows; 

    // add paths    
    this.game.millPath = millPath;
    this.game.path = path;    
  }
  
  
  componentDidMount() {      
  
    //let intersections = document.querySelectorAll('.intersection');
    // thanks https://stackoverflow.com/a/288731/9978941
    //let bounds = intersections[0].getBoundingClientRect();
    // ...
    
    // resort to plain js and svg for connector lines
    window.onload = function() {
    
    let path =[ [0,1],[1,2],[3,4],[4,5],[6,7],[7,8],[9,10],[10,11],[12,13],[13,14],[15,16],[16,17],[18,19],[19,20],[21,22],[22,23],[0,9],[9,21],[3,10],[10,18],[6,11],[11,15],[1,4],[4,7],[16,19],[19,22],[8,12],[12,17],[5,13],[13,20],[2,14],[14,23],[0,3],[3,6],[2,5],[5,8],[21,18],[18,15],[23,20],[20,17] ];
        var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute('id','svg');        
        for (var p = 0; p < path.length; p++) {
            var line = document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('id','p'+p);
            let e1 = findAbsolutePosition(document.getElementById('i'+path[p][0]));
            let e2 = findAbsolutePosition(document.getElementById('i'+path[p][1]));
            // add intersection size and stroke offsets
            let offset = getRootElementFontSize(document.getElementById('i'+path[p][0])) - 2;
            
            line.setAttribute('x1',e1.x+offset+"px");
            line.setAttribute('y1',e1.y+offset+"px");
            line.setAttribute('x2',e2.x+offset+"px");
            line.setAttribute('y2',e2.y+offset+"px");
            line.setAttribute("stroke", "grey")
            line.setAttribute("stroke-width", "4px")            
            svg.append(line);            
        }

        document.getElementsByTagName('body')[0].appendChild(svg);    
    }
    
    // legacy HACK for mac
    //window.onload = function() {
     //   if (window.navigator.userAgent.indexOf("Macintosh") > -1) {
      //      document.getElementById('boardgrid').style.fontSize = "84.5%";
        //    document.getElementById('boardgrid').style.marginTop = "-25em";        
         //   document.getElementById('boardgrid').style.marginLeft = "-12em";        
       // }
    //}
 }

  render() {  

    return (
      <div className="game">
        <h1>Morabaraba</h1>
        <div className="game-board">
          <Board game={this.game} />
        </div>
        <br/>        
        <div id="rules">
        <p><a href="https://en.wikipedia.org/wiki/Morabaraba#Gameplay" target="_blank"><button className="morabutton">rules</button></a></p>
        </div>        
      </div>
    );
    /* Ref: https://stackoverflow.com/questions/27934238/rendering-raw-html-with-reactjs */    
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
/*window.onload = function() {
    console.log("window.onload ");
//    let intersections = document.querySelector('.intersection');
  //  console.log(intersections.length);      
}
*/

