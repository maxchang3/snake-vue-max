import Matrix, { coordinate } from "@/utils/matrix"
import { AnimationX } from '@/utils/animation';

// EMPTY value in the middle 
// to judge if the direction opposite by making a difference between two directions' value
// 通过预留中间的空值，来使两个相反方向的差的绝对值为1，从而判断。
export enum direction {
    UP, DOWN, EMPTY, LEFT, RIGHT
}

interface snake {
    head: coordinate,
    direction: direction,
    body: coordinate[],
    scores: number
}

export class Snake {
    private _snake: snake = {
        head: { x: 0, y: 0 },
        direction: direction.DOWN,
        body: [],
        scores: 0
    }
    private MAX_SIZE: [number, number] = [0, 0]
    private _MAP: Matrix;
    private _Anime: AnimationX;
    private _steps: number = 0;
    private _steps_before: number = 0;
    public snake: snake = this._snake;
    public food: coordinate = { x: 0, y: 0 }

    constructor(x: number = 0, y: number = 0, mapSize: [number, number], MAP: Matrix) {
        this.initSnake(x, y)
        this.MAX_SIZE = mapSize.map((n) => n - 1) as [number, number]
        this._MAP = MAP
        this.generateFood()
        this._Anime = new AnimationX([{ ...this.snake.head }, ...this.snake.body, this.food], this._MAP)
    }

    initSnake(x: number, y: number) {
        this.snake = this._snake
        this.snake.head = { x, y }
        this.snake.body = [];
    }

    drawToMap(pixels: coordinate[]) {
        this._Anime.setPixels(pixels)
    }

    setDirection(value: string) {
        let newDirection = direction[value as keyof typeof direction]
        let difference = Math.abs(newDirection - this.snake.direction)
        if (Math.abs(difference) === 1 || difference === 0) return;
        if (this._steps_before == this._steps) this.move() // when change direction fast 
        this.snake.direction = newDirection
        this._steps_before = this._steps;

    }

    generateFood() {
        const getRndInteger = (min: number, max: number) => {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        let x = getRndInteger(0, this.MAX_SIZE[0]);
        let y = getRndInteger(0, this.MAX_SIZE[1]);
        this.food = { x, y }
    }

    move() {
        const snakeHeadBefore: coordinate = { ...this.snake.head }
        const moveForward = {
            [direction.UP]: () => this.snake.head.x--,
            [direction.DOWN]: () => this.snake.head.x++,
            [direction.RIGHT]: () => this.snake.head.y++,
            [direction.LEFT]: () => this.snake.head.y--,
            [direction.EMPTY]: () => null,
        };
        moveForward[this.snake.direction]();
        // boundary check 
        let { x, y } = this.snake.head;
        (["x", "y"] as const).forEach((XY, index) => {
            let currentHead = this.snake.head[XY]
            let revisedValue: number = currentHead
            const closeToBorder = () => {
                this.snake.head.x = XY === "x" ? revisedValue : x
                this.snake.head.y = XY === "y" ? revisedValue : y
            }
            if (currentHead > this.MAX_SIZE[index]) { revisedValue = 0; closeToBorder() };
            if (currentHead < 0) { revisedValue = this.MAX_SIZE[index]; closeToBorder() };
            if (this.snake.head.x == this.food.x && this.snake.head.y == this.food.y) {
                this.snake.body.push({ x: 0, y: 0 }) // in the end it will be poped
                this.snake.scores++
                this.generateFood()
            }
        })
        let gameOver: boolean = false
        for (let { x: x0, y: y0 } of this.snake.body) {
            if (x == x0 && y == y0) {
                gameOver = true
                break
            }
        }
        // snake body follow the head
        // 'cause the head has been checked and fixed, the body is no need to repeat it
        this.snake.body = [snakeHeadBefore, ...this.snake.body]
        this.snake.body.pop()
        this.drawToMap([{ ...this.snake.head }, ...this.snake.body, this.food])
        this._steps++;
        return gameOver
    }


}