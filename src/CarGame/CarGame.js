import React from 'react';

var Tick;

export class CarGame extends React.Component {
  state = {
    kilometer : 0,
    heroLoc: 0,
    enemyLoc : 0,
    enemyType : 0,
    enemySpeed : 0,
    gameState : 0,
    gameStart :0,
    gameOver : 0,
    aniEnd : true,
    superMode :0,
    godMode : 0,
    hasSuper : 0,
  };

  enemyRef = React.createRef()

  gameTick = (state) => {
    var crash = 620, heroLoc, enemyLoc, trs, dis, kilometer = 0;
    if (state) {
      Tick = setInterval( () => {
        trs = window.getComputedStyle(this.enemyRef.current, null).getPropertyValue("transform");
        dis = trs.split(",")[5].replace(")", "");
        heroLoc = this.state.heroLoc;
        enemyLoc = this.state.enemyLoc;

        if (dis > crash && dis < (crash + 220) && heroLoc === enemyLoc) {
          if (this.state.superMode === 1) {
            this.superBuff();
          } else {
            this.gameOver();
          }
        }
        kilometer++;
        this.setState({ kilometer: kilometer });
        if (kilometer % 1000 === 0) {
          this.superMode();
        }
      }, 10)
    } else {
      clearInterval(Tick);
    }
  };

  gameOver = () => {
    this.setState({ gameState: 1 });
    this.setState({ gameOver: 1 })
    this.gameTick(false);
  };

  gameRestart = () => {
    this.gameStart();
  };


  gameStart = () => {
    this.setState({
      kilometer : 0,
      heroLoc : 0,
      enemyLoc: 0,
      enemyType : 0,
      enemySpeed : 0,
      gameState : 1,
      gameStart :1,
      gameOver : 0,
      aniEnd : true,
      superMode :0,
      godMode : 0,
      hasSuper : 0,
    });
    this.createEnemy();
    this.gameTick(true);
  };

  gameHandle = (event) => {
    if (this.state.gameState === 1) {

      switch (event.keyCode) {
        case 37:
          this.setState({ heroLoc: 0 });
          break;
        case 39:
          this.setState({ heroLoc: 1 });
          break;
        case 32:
          if (this.state.hasSuper === 1) {
            this.setState({ superMode: 1 });
            this.setState({ hasSuper: 0 });
          }
          break;
      }
    }
  };

  mobileSuper = () => {
    if (this.state.hasSuper === 1) {
      this.setState({ superMode: 1 });
      this.setState({ hasSuper: 0 });
    }
  };

  superBuff = () => {
    this.setState({ godMode: 1 });
    setTimeout(() => {
      this.setState({ godMode: 0 });
    }, 1000);
  };

  superMode = () => {
    this.setState({ hasSuper: 1 });
    setTimeout(() => {
      this.setState({ superMode: 0 });
    }, 5000);
  };

  createEnemy  = () => {
    var _this = this;
    var enemyClass,
      enemyLoc,
      enemySpeed,
      enemyType,
      animationEnd = true;

    setInterval(() => {
      if (this.state.aniEnd && this.state.gameState == 1) {
        this.setState({ aniEnd: false });
        enemyType = Math.floor(Math.random() * 3);
        enemyLoc = Math.round(Math.random());
        enemySpeed = Math.floor(Math.random() * 3);
        this.setState({ enemyLoc: enemyLoc });
        this.setState({ enemyType: enemyType });
        this.setState({ enemySpeed: enemySpeed });
      }
    }, 1000);


    this.enemyRef.current.addEventListener("webkitAnimationEnd", () => {
      this.setState({ aniEnd: true })
    })
  };

  componentDidMount = () => {
    window.addEventListener("keydown", this.gameHandle, false);
    window.addEventListener("devicemotion", (event) => {
      var eventaccelerationIncludingGravity = event.accelerationIncludingGravity;
      if (this.state.gameState == 1) {
        if (eventaccelerationIncludingGravity.x < -1) {
          this.setState({ heroLoc: 0 });
        } else if (eventaccelerationIncludingGravity.x > 1) {
          this.setState({ heroLoc: 1 });
        }
      }
    }, false);
  };

  componentDidUpdate(prevProps, prevState, snapshot) {

    if(this.props.value.x != prevProps.value.x){
      const keyCode = this.props.value.x > 500 ? 39 : 37;
      this.gameHandle({keyCode})
    }
  }

  render = () => {
    var state = this.state;
    
    var enemyCls = state.gameStart == 0 || state.aniEnd ? "enemy" : ("enemy enemy" + state.enemyType + " speed" + state.enemySpeed + " loc" + state.enemyLoc);
    var boardCls;
    
    if (state.gameOver == 1) {
      boardCls = "board crashed";
    } else if (state.superMode == 1) {
      boardCls = "board superMode";
    } else {
      boardCls = "board";
    }

    
    console.log("CarGame::render -> state.heroLoc", state.heroLoc);
    return (
      <div className={boardCls}>
        <div className={state.gameStart === 1 ? "roadbed roadRun" : "roadbed"}></div>
        <div className={state.gameStart === 1 ? "road roadPlay" : "road"}>
          <div className={state.heroLoc === 0 ? "hero left" : "hero right"} onClick={this.mobileSuper}>
            <div className="body"></div>
            <span className="light"></span>
          </div>
          <div className={enemyCls} ref={this.enemyRef}>
            <div className={state.godMode === 1 ? "body chunge" : "body"}></div>
          </div>
          <p className={state.hasSuper === 1 ? "helpsp show" : "helpsp"}>Good！</p>
        </div>
        <span className={state.gameState === 0 ? "start" : "start hide"} onClick={this.gameStart}>
          Start
        </span>
        <span className="kilo">{state.kilometer}</span>
        <div className="failbub">
          <span className="retry" onClick={this.gameRestart}>Restart</span>
        </div>

      </div>
    )
  }
}