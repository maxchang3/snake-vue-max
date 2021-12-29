import numbersChar from '@/maps/numbers.json'
import { AnimationX } from '@/utils/animation';
import Matrix from '@/utils/matrix'

export class tinyScreenAni{
    private _MAP:Matrix;
    private tinyScreenAni:AnimationX;
    private tinyTimer: number;
    private slot:Function;

    constructor(MAP:Matrix,slot:Function){
        this._MAP = MAP
        this.tinyScreenAni = new AnimationX([], this._MAP as Matrix)
        this.slot = slot
        this.tinyScreenTime()
        this.tinyTimer = setInterval(this.tinyScreenTime.bind(this),1000) // BIND THIS
    }

    private timeToStirng = ( num:number) => num.toString().padStart(2,'0')

    private tinyScreenTime () {
        this.slot()
        let time = this.timeToStirng((new Date()).getSeconds());
        let [charA,charB]= time.split('');
        this.tinyScreenAni.setPixels([...numbersChar[+charA],...(numbersChar[+charB]).map(({x,y})=>({x,y:y+5}))]);
    }

    private tinyScreenAdder(){

    }

    public clearTimer(){
        clearInterval(this.tinyTimer)
        this.tinyTimer = setInterval(this.tinyScreenAdder.bind(this),1000)
    }
}

export function timeToStirng(num:number) {
    return num.toString().padStart(2,'0')
}