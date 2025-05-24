class Vector{
    constructor(x=0, y=0){
        this.x = x;
        this.y = y;
    }

    add(u){
        if(typeof u == "number")
            return new Vector(this.x + u, this.y + u);
        return new Vector(this.x + u.x, this.y + u.y);
    }
    
    mul(u){
        if(typeof u == "number")
            return new Vector(this.x * u, this.y * u);
        return new Vector(this.x * u.x, this.y * u.y);
    }
    floor(){
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
}

export { Vector }