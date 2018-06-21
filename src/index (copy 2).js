import React from 'react';
import ReactDOM from 'react-dom';
//import Line from 'react-line'; // error
import './index.css';

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
      <button className="intersection" id={id} ref={this.props.iRef}>
      <small>{this.props.id}</small> 
        {/* TODO */}
      </button>
    );
  }
}

/*
class BoardIntersections extends React.Component {
  renderIntersection(i) {
    return <Intersection id={i}/>;
  } 

  render() {
    const status = 'Next player: X';

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
          {this.renderIntersection(16)}
          {this.renderIntersection(17)}
          {this.renderIntersection(18)}
        </div>
        <div className="board-row">
          {this.renderIntersection(19)}
          {this.renderIntersection(20)}
          {this.renderIntersection(21)}
          
        </div>
        <div className="board-row">
          {this.renderIntersection(22)}
          {this.renderIntersection(23)}
          {this.renderIntersection(24)}
        </div>
      </div>
    );
  }
}
*/

class Path extends React.Component {

  render() {
    let id1 = this.props.id1;
    let id2 = this.props.id2; // ...
   
    return (       
        <svg>
            <line x1="0" y1="0" x2="200" y2="200" style={{stroke:"#000000",strokeWidth:"2"}} />
        </svg>
    );
  }
}

class BoardPaths extends React.Component {
 renderBoardPath(id1, id2) {
    return <Path id1={id1} id2={id2}/>;
  }
  render() {
    return (
        <span className="path">
        {this.renderBoardPath('i0','i1')}
        </span>
        // ...
    );
  }     
}


class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      intersections: Array(24).fill(null), // game state
    };
    this.intersections = { e: Array(24).fill(null) } // children
  }

  renderIntersection(i) {
    let intersection = <Intersection id={i} iRef={this.el= this.e = 'i'+i}/>;    
    this.intersections[i] = this.e;
    return intersection;
  } 
  
  componentDidMount() {
    console.log(this.intersections);  
    
    console.log(document.getElementById(this.intersections[0]).style.left);
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
          {this.renderIntersection(16)}
          {this.renderIntersection(17)}
          {this.renderIntersection(18)}
        </div>
        <div className="board-row">
          {this.renderIntersection(19)}
          {this.renderIntersection(20)}
          {this.renderIntersection(21)}
          
        </div>
        <div className="board-row">
          {this.renderIntersection(22)}
          {this.renderIntersection(23)}
          {this.renderIntersection(24)}
        </div>
      </div>
    );
 }
 
 renderBoardPaths() {
    return <BoardPaths />;
 }
    
  render() {
    return (
      <div className="board"> 
          {this.renderBoardIntersections()}
          {this.renderBoardPaths()}          
      </div>
    );
  }     
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <h1>Morabaraba</h1>
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

