import React from 'react';
import ReactDOM from 'react-dom';
//import Line from 'react-line'; // error
import './index.css';
//import './vendor/bootstrap/css/bootstrap.css';
import {games} from './games.js';

class Intersection extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
      value: null, // -> {this.value} ??
    };
  }
  
  render() {
    let id = "i"+this.props.id;
    return (       
      <button className="intersection" value={this.props.value} id={id} ref={this.props.iRef} onClick={() => this.props.onClick()}>
      <small>{this.props.id} {/*this.props.value*/}</small> 
        {/* TODO */}
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

class Undo extends React.Component {

 constructor(props) {
    super(props);
    this.state = {
    };
  }
  
  render() {
    return (       
      <button onClick={() => this.props.onClick()}>Undo</button>
    );
  }
}

class Board extends React.Component {

  constructor(props) {
    super(props);

    // available paths for mills
   let path = [ [0,1,2],[3,4,5],[6,7,8],[9,10,11],[12,13,14],[15,16,17],[18,19,20],[21,22,23],[0,9,21],[3,10,18],[6,11,15],[8,12,17],[5,13,20],[2,14,23],[1,4,7],[16,19,22],[0,3,6],[2,5,8],[17,20,23],[15,18,21] ];   
            
    // init state from game state prop passed
    this.state = {
         path: path,
         intersections: this.props.game.intersections,
         milled: this.props.game.milled,
         white: this.props.game.white,
         black: this.props.game.black,
         player: this.props.game.player,
         phase: this.props.game.phase,
         history: null,
    }    
  }

  /* check if player has (formed a new) mill */
  playerHasMill(player, intersections) {
    let path = this.state.path;    
    let milled = this.state.milled;
    for (var c = 0; c < path.length; c++) {
        if (milled[c]) { continue; } 
        if (intersections[path[c][0]] === player && intersections[path[c][1]] === player && intersections[path[c][2]] === player) {
            milled[c] = true;
            this.setState({milled: milled});
            return true;        
        }
    }
    // else
    return false;
  }
  
  /* helper: check if intersection is in a path */
  pathHasIntersection(path, i)  {
    return (path[0] === i || path[1] === i || path[2] === i);
  }
  
  /* modify milled memory, cancel/clear remembered mills if cow shot (or moved?) */
  updateMills(i, intersection) {
    let milled = this.state.milled;
    for (var c = 0; c < milled.length; c++) {
        if (milled[c] && this.pathHasIntersection(this.state.path[c],i) && intersection === 0) { 
            milled[c] = false;
        }
    }
    this.setState({milled: milled});
  }
  
  handleClick(i) {

    //copy instead of mutating //immutability is important //?
    const intersections = this.state.intersections.slice();     
    var phase = this.state.phase;
    var player = this.state.player;
    var white = this.state.white;     
    var black = this.state.black; 
    
    // remember history
    let history = {
        intersections: this.state.intersections,
        milled: this.state.milled,
        player: this.state.player,
        white: this.state.white,
        black: this.state.black,
        phase: this.state.phase,
        history: this.state.history,
    }
    this.setState({history: history});    
    
    // TODO Flying the cows
    if (phase === "Placing the cows") {
        if (intersections[i] === 0) { // check if empty
            // place player piece 
            intersections[i] = player;
            // decrement player pieces
            if (player === 1) { white--; }
            if (player === 2) { black--; }        
            // check if mill
            let mill = this.playerHasMill(player, intersections);
            if (mill) {
               this.updateMills(i, intersections[i]);
               // shooting
               phase = "Shooting a cow 1";
            } else {
               // toggle player
               player = (player===1)?2:1;                        
               if (white === 0 && black === 0) { // second phase?
                 phase = "Moving the cows a";
               }
            }               
        }
    } else if (phase === "Shooting a cow 1" || phase === "Shooting a cow 2" ) {
        if (intersections[i] !== 0) { // check not empty // check opponent?
            intersections[i] = 0;
           // toggle player
           player = (player===1)?2:1;            
           // update milled
           this.updateMills(i, intersections[i]);            
           // revert or progress phase
           if (phase === "Shooting a cow 1" && white === 0 && black === 0) { // second phase?
                phase = "Moving the cows a";
           } else {           
               phase = (phase === "Shooting a cow 1")?"Placing the cows":"Moving the cows a";
           }
        }
    } else if (phase === "Moving the cows a" || phase === "Flying the cows a") {
        if (intersections[i] === player) { // check player piece
            // 'pick up' piece
            intersections[i] = 0;
            // update milled
            this.updateMills(i, intersections[i]);
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
                this.updateMills(i, intersections[i]);
                // shooting
                phase = "Shooting a cow 2";
            } else {   
               // toggle player
               player = (player===1)?2:1;
            }           
           // toggle phase
           if (phase !== "Shooting a cow 2") {
               phase = (phase === "Flying the cows b")?"Flying the cows a":"Moving the cows a";
           }
       }
    }
    // check for Flying the cows...

    // output game object to console for copy/paste if required    
    let game = {
        intersections: intersections,
        milled: this.state.milled,
        player: player,
        white: white,
        black: black,
        phase: phase,
        history: /*this.state.history*/ null, // skip history
    }
    console.log(game);  
    
    // mutate
    this.setState({intersections: intersections});    
    this.setState({phase: phase});    
    this.setState({player: player});        
    this.setState({white: white}); 
    this.setState({black: black});                   
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
      <div>
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
    return (
      <div>
      <div id="status">
      {this.renderPlayerCows(1, this.state.white)}
      {this.renderPlayerLabel(1,(this.state.player===1)?true:false,this.state.white)} 
       vs  {this.renderPlayerLabel(2,(this.state.player===2)?true:false,this.state.black)}
      {this.renderPlayerCows(2, this.state.black)}      
      </div>
      <div className="board"> 
          {this.renderBoardIntersections()}
          {this.renderBoardGrid()}          
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

    // defaults
    /*
      this.intersections = Array(25).fill(0); // game state
      this.milled = Array(20).fill(false); // paths used in a mill      
      this.phase = "Placing the cows"; // || "Shooting a cow 1" || "Shooting a cow 2" || "Moving the cows a" || "Moving the cows b"|| "Flying the cows a" || "Flying the cows b"
      this.player = 1; // 1 || 2
      this.white = 12;
      this.black = 12;
    */
    this.game = {};
    this.game.intersections = Array(24).fill(0);
    this.game.milled = Array(20).fill(false); 
    this.game.phase = "Placing the cows"; // || "Shooting a cow 1" || "Shooting a cow 2" || "Moving the cows a" || "Moving the cows b"|| "Flying the cows a" || "Flying the cows b"
    this.game.player = 1; // 1 || 2
    this.game.white = 12;
    this.game.black = 12;    
    
    /* saved games in games.js */
    //this.game = games.nearlymovingcows; 
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
        <p><a href="https://en.wikipedia.org/wiki/Morabaraba#Gameplay" target="_blank">[rules]</a></p>
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

