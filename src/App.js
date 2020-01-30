import React, {useReducer, useEffect} from "react";
import "./styles.css";
import Paddle from "./components/Paddle";
import Ball from "./components/Ball";
import Brick from "./components/Brick";

const initialState = { 
  paddle: {
    x: 0
  },
  ball: {
    x: 0,
    y: 400,
    dx: 5,
    dy: -5
  },
  bricks: [
    {bottom: 575, left: 0},
    {bottom: 575, left: 150},
    {bottom: 550, left: 75}]
};

function reducer (state, action) {
  switch (action.type) {
    case "MOVE_PADDLE":
      return { ...state, paddle: action.payload };
    case "MOVE_BALL":
      return { ...state, ball: action.payload}
    default:
      throw new Error();
  }
}



export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleMouse(e) {
    console.log(e.x);
    let boundedX;
    const offset = (window.innerWidth - 500)/2;
    if (e.x - offset < 0) {
      boundedX = 0;
    } else if (e.x - offset > 400) {
      boundedX = 400;
    } else {
      boundedX = e.x - offset;
    }
    dispatch({type: "MOVE_PADDLE", payload: {x: boundedX}});
  }
  
  useEffect(() => {
    window.addEventListener("mousemove", handleMouse)
  }, []);

  // function didCollide(rect1, rect2) {
  //   let x = false;
  //   let y = false;
  //   if (rect1.x < rect2.x + rect2.width &&
  //     rect1.x + rect1.width > rect2.x) {
  //       x = true;
  //   }

  //   if (rect1.y < rect2.y + rect2.height &&
  //     rect1.y + rect1.height > rect2.y) {
  //       y = true;
  //     }
  //   return {x, y};
  // }

  // function paddleCollision(rect1, rect2) {
  //   let ycollision = false;
  //   if((rect2.x < rect1.x) && (rect1.x < rect2.x + rect2.width) || ((rect2.x < rect1.x + rect1.width) && (rect1.x + rect1.width < rect2.x + rect2.width)) && (rect1.y + rect1.dy < rect2.y + rect2.height)) {
  //     ycollision = true;
  //   }
  //   return ycollision;
  // }

  function willCollide(rect1, rect2) {
    let x = false;
    let y = false;
    let xCurr = false;
    let yCurr = false;
    let collided = false;

    const rect1XNext = rect1.x + rect1.dx;
    const rect1YNext = rect1.y + rect1.dy;

    if (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x) {
      xCurr = true;
    }
    if (rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y) {
      yCurr = true;
    }
    if (
      yCurr &&
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x
    ) {
      x = true;
    }
    if (
      xCurr &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      y = true;
    }
    if (
      rect1XNext < rect2.x + rect2.width &&
      rect1XNext + rect1.width > rect2.x &&
      rect1YNext < rect2.y + rect2.height &&
      rect1YNext + rect1.height > rect2.y
    ) {
      collided = true;
    }
    return { x, y, collided };
  }

    useEffect(() => {
        
        const myTimeout = setTimeout(() => {
          let x = state.ball.x;
          let y = state.ball.y;
          let dx = state.ball.dx;
          let dy = state.ball.dy;

          let paddleX = state.paddle.x;

          // if (y < 20) {
          //   return dispatch({
          //     type: "MOVE_BALL",
          //     payload: {
          //       dx: 5,
          //       dy: -5,
          //       x: 0,
          //       y: 580
          //     }
          //   });
          // }

          const ball = {
            x,
            dx,
            y,
            dy,
            width: 20,
            height: 20
          };

          const walls = [
            // left
            {
              x: -100,
              y: 0,
              width: 100,
              height: 600
            },
            // right
            {
              x: 500,
              y: 0,
              width: 100,
              height: 600
            },
            // top
            {
              x: 0,
              y: -100,
              width: 500,
              height: 100
            },
            // bottom
            {
              x: 0,
              y: 600,
              width: 500,
              height: 100
            }
          ];

          // if (x + dx > 500 - 20 || x + dx < 0) {
          //   dx = -dx;
          // }

          // if (y + dy > 600 - 20 || y + dy < 0) {
          //   dy = -dy;
          // }

          // if ((paddleX < x+dx && paddleX + 100 > x+dx) && y < 45) {
          //   dy = -dy;
          // }

          // const paddleCollide = didCollide(
          //   {
          //     x: x + dx,
          //     y: y + dy,
          //     width: 20,
          //     height: 20
          //   },
          //   {
          //     x: paddleX,
          //     y: 20,
          //     width: 100,
          //     height: 25
          //   });

          // if (paddleCollide.x) {
          //   dx = -dx;
          // }

          // if (paddleCollide.y) {
          //   dy = -dy;
          // }

          // if (paddleCollision(
          //   {
          //     x: x,
          //     y: y,
          //     width: 20,
          //     height: 20,
          //     dx: dx,
          //     dy: dy
          //   },
          //   {
          //     x: paddleX,
          //     y: 20,
          //     width: 100,
          //     height: 25
          //   }
          // )) {
          //   dy = -dy;
          // }

          const wallCollisions = walls.map(wall => {
            return willCollide(ball, wall);
          });
    
          if (wallCollisions[0].collided || wallCollisions[1].collided) {
            dx = -dx;
          }
    
          if (wallCollisions[2].collided || wallCollisions[3].collided) {
            dy = -dy;
          }

          const obstacleCols = [
            {
              left: paddleX,
              bottom: 20
            },
            ...state.bricks
          ].map(ob => {
            return willCollide(ball, {
              width: 100,
              height: 25,
              x: ob.left,
              y: ob.bottom
            });
          });

          if (obstacleCols.some(obc => obc.y)) {
            dy = -dy;
          }
          if (obstacleCols.some(obc => obc.x)) {
            dx = -dx;
          }

          dispatch({
            type: "MOVE_BALL",
            payload: {
              dx,
              dy,
              x: x + dx,
              y: y + dy
            }
          });
        },25);
        return () => clearTimeout(myTimeout);
    }, [state.ball])

  const brickList = state.bricks.map((brickObj) => 
    < Brick style={{bottom: brickObj.bottom, left: brickObj.left}} />
  )

  return (
    <div className="container">
      {brickList}

      <Paddle paddleX = {state.paddle.x}/>
      <Ball pos= {state.ball}/>
    </div>
  );
}
