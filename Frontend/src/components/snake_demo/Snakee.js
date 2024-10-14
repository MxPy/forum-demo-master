import React, { useState, useEffect, useCallback,forwardRef, useImperativeHandle } from "react";
import Snake from "./Snake";
import Food from "./Food";
import "./Appp.css";

const getRandomFood = () => {
    let min = 1;
    let max = 98;
    let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
    return [x, y];
};

const initialState = {
    food: getRandomFood(),
    direction: "RIGHT",
    speed: 100,
    snakeDots: [
        [0, 0],
        [0, 2],
    ],
};

const SnakeGame = forwardRef(({ onGameOver }, ref) => {
    const [state, setState] = useState(initialState);

    const moveSnake = useCallback(() => {
        let dots = [...state.snakeDots];
        let head = dots[dots.length - 1];

        switch (state.direction) {
            case "RIGHT":
                head = [head[0] + 2, head[1]];
                break;
            case "LEFT":
                head = [head[0] - 2, head[1]];
                break;
            case "DOWN":
                head = [head[0], head[1] + 2];
                break;
            case "UP":
                head = [head[0], head[1] - 2];
                break;
        }

        dots.push(head);
        dots.shift();
        setState(prevState => ({
            ...prevState,
            snakeDots: dots
        }));
    }, [state.snakeDots, state.direction]);

    useEffect(() => {
        const gameInterval = setInterval(moveSnake, state.speed);
        return () => clearInterval(gameInterval);
    }, [state.speed, moveSnake]);

    useEffect(() => {
        checkIfOutOfBounds();
        checkIfCollapsed();
        checkIfEat();
    }, [state.snakeDots]);

    const checkIfOutOfBounds = () => {
        let head = state.snakeDots[state.snakeDots.length - 1];
        if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
            gameOver();
        }
    };

    const checkIfCollapsed = () => {
        let snake = [...state.snakeDots];
        let head = snake[snake.length - 1];
        snake.pop();
        snake.forEach(dot => {
            if (head[0] === dot[0] && head[1] === dot[1]) {
                gameOver();
            }
        });
    };

    const checkIfEat = () => {
        let head = state.snakeDots[state.snakeDots.length - 1];
        let food = state.food;
        if (head[0] === food[0] && head[1] === food[1]) {
            setState(prevState => ({
                ...prevState,
                food: getRandomFood()
            }));
            enlargeSnake();
            increaseSpeed();
        }
    };

    const enlargeSnake = () => {
        let newSnake = [...state.snakeDots];
        newSnake.unshift([]);
        setState(prevState => ({
            ...prevState,
            snakeDots: newSnake
        }));
    };

    const increaseSpeed = () => {
        if (state.speed > 10) {
            setState(prevState => ({
                ...prevState,
                speed: prevState.speed - 20
            }));
        }
    };

    const gameOver = () => {
        onGameOver(state.snakeDots.length - 2);
        setState(initialState);
    };

    const onKeyDown = (e) => {
        e = e || window.event;
        switch (e.keyCode) {
            case 37:
                setState(prevState => ({ ...prevState, direction: "LEFT" }));
                break;
            case 38:
                setState(prevState => ({ ...prevState, direction: "UP" }));
                break;
            case 39:
                setState(prevState => ({ ...prevState, direction: "RIGHT" }));
                break;
            case 40:
                setState(prevState => ({ ...prevState, direction: "DOWN" }));
                break;
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
        };
    }, []);
    
    useImperativeHandle(ref, () => ({
        onUp: () => setState(prevState => ({ ...prevState, direction: "UP" })),
        onDown: () => setState(prevState => ({ ...prevState, direction: "DOWN" })),
        onLeft: () => setState(prevState => ({ ...prevState, direction: "LEFT" })),
        onRight: () => setState(prevState => ({ ...prevState, direction: "RIGHT" }))
    }));
    


    return (
        <div className="game-area">
            <Snake snakeDots={state.snakeDots} />
            <Food dot={state.food} />
        </div>
    );
});

export default SnakeGame;