import Matrix, { coordinate } from "@/utils/matrix";

export class AnimationX {
    private _currentPixels: coordinate[] = [];
    private _lastPixels: coordinate[] = [];
    private _MAP: Matrix;
    constructor(pixels: coordinate[], MAP: Matrix) {
        this._currentPixels = pixels.map(a => {return {...a}})
        this._MAP = MAP
        this.setPixels()
    }
    private differ (left:coordinate[], right:coordinate[]) {
        const compareFunction = (leftValue:coordinate,rightValue:coordinate)=>{
            let {x:x1,y:y1} = leftValue
            let {x:x0,y:y0} = rightValue
            return x1 == x0 && y1 ==y0
        }
        return left.filter(leftValue =>
            !right.some(rightValue =>
            compareFunction(leftValue,rightValue)
        ))
    }
    setPixels(newPixels?: coordinate[]) {
        if(newPixels){
            this._lastPixels = this._currentPixels
            this._currentPixels = newPixels
            let newDraw = this.differ(newPixels,this._lastPixels)
            let newClear = this.differ(this._lastPixels,newPixels)
            for (let { x: x0, y: y0 } of newDraw) {
                this._MAP.value[x0][y0] = 1
            }
            for (let { x: x0, y: y0 } of newClear) {
                this._MAP.value[x0][y0] = 0
            }
        }else{
            for (let { x: x0, y: y0 } of this._currentPixels) {
                this._MAP.value[x0][y0] = 1
            }
        }

    }



}