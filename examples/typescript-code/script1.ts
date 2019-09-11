// First function
interface IMyInterface{
    name:string
    lastname:string
    year:number
}

abstract class MyAbstract{
    constructor(protected name:string, protected lastname:string) {

    }
}


class MyMario extends MyAbstract{
    constructor(protected  year:number){
        super("Mario","Rossi")
    }
}
