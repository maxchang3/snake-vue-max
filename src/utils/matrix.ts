export type matrix = any[][]
export type coordinate = {
    x: number,
    y: number
}
export default class Matrix{
    public value: matrix = Array();

    constructor(row: number, column: number) {
        this.initMatrix(row,column)
    }

    private initMatrix(row: number, column: number){
        this.value = Array()
        for (let i = 0; i < column; i++) {
            this.value.push(Array(row).fill(0))
        }
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    opposite(row: number, column: number){
        this.value[row][column] = this.value[row][column] === 1 ? 0 : 1;
    }

    async readMap(mapName: string): Promise<matrix> {
        return (await import(`../maps/${mapName}.json`)).map
    }

    async readChar(charMapName:string): Promise<coordinate[]>{
        return (await import(`../maps/${charMapName}.json`))
    }

    async drawFromTemp(template: matrix) {
        for (let row = 0; row < template.length; row++) {
            for (let column = 0; column < template[row].length; column++) {
                this.value[row][column] = template[row][column]
                await this.sleep(1)
            }
        }
    }

    async lineByLine(){
        for(let row = 0; row<this.value.length;row++){
            this.value[row] = Array(this.value[row].length).fill(1)
            await this.sleep(300/this.value.length)
        }
        this.initMatrix(this.value[0].length,this.value.length)
    }
}