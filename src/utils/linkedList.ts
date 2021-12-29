import { coordinate } from "@/utils/matrix"

interface link{
    coord:coordinate
    next?: link | null,
    front?:link | null
}
export class LinkedList{
    private _basic:link =  {
        coord:{x:0,y:0},
        next:null,
        front:null
    }
    public head:link =  this._basic
    public tail:link= this._basic

    constructor(coord:coordinate,length:number){
        this.init(coord,length)
    }
    
    get list(){
        let node = this.head
        let list:coordinate[] = []
        while (node.next) {
            list.push(node.coord)
            node = node.next
        }
        return list
    }

    init(coord:coordinate,length:number){
        this.head.coord = {...coord}
        let node = this.head
        for (let i = 0; i < length; i++) {
            let {x,y} ={...node.coord}
            node = node.next = { coord:{x, y:y - 1},next:null,front:node}
        }
        this.tail = node
    }

    insert(coord:coordinate){
        this.head.next = {coord,front:this.head,next:this.head.next};
        ((this.head.next as link).next as link).front = this.head.next;
    }

    pushTail(coord:coordinate){
        let newTail:link = {coord,front:this.tail,next:null}
        this.tail.next =  newTail
        this.tail = newTail
    }

    deleteTail(){
        this.tail = this.tail.front as link
        this.tail.next = null
    }
}
