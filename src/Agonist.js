class Agonist {
    
    name;
    /* Drug parameters */
    eC50;  //EC50
    eMax; //Emax
    hillSlope; //nH
    decayEC50;  //seems to be calculated in D24!!
    decayEMax;
    decaySlope; //Decay nH
    decayRateMultiplier;
    
    constructor(name, eC50, eMax, hillSlope, decayEC50, decayEMax, decaySlope, decayRateMultiplier) {
        this.name = name; 
        this.eC50 = eC50; 
        this.eMax = eMax;
        this.hillSlope = hillSlope;
        this.decayEC50 = decayEC50;
        this.decayEMax = decayEMax;
        this.decaySlope = decaySlope; 
        this.decayRateMultiplier = decayRateMultiplier;
    }
}

export default Agonist; 