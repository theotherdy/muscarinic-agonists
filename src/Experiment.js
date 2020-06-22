import React, { Component } from 'react';
import ControlForm from './ControlForm';
import { VictoryChart, VictoryLine, VictoryTheme, VictoryAxis } from 'victory';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Agonist from './Agonist';

function searchArrayOfObjects(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) {
            return myArray[i];
        }
    }
}

//https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
function gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 6; i += 1) {
        rand += Math.random();
    }
    return rand / 6;
}


class Experiment extends Component {
    
    agonists = [];
    antagonists = [];
    
    randomisation = 0.1; //relative magnitide of allowed randomisation - 1 = 0.5-1.5 * peakResponse

    timeTotal = 180; //seconds
    timeStep = 0.5; //seconds
    timeToPeak = 5; //seconds
    timeWash = 30; //seconds
    timeWashStart = 30; //seconds
    timeDecay = 25; //seconds
    
    associationRateMultiplier = 0; //determines shape of rise to peak

    postWashPlateau = 0; //graph return to this after wash?

    responseData = [];
    
    constructor(props) {
        super(props);
        this.state = {
            responseData: [],
            peakResponse: 1,
        };

        //populate our agonists
        this.agonists.push(new Agonist('acetylcholine',0.00000001,1.2,1,0.000001,100,1,0.1));
    }

    handleSubmit(agonistName, agonistConc){
        let agonist = searchArrayOfObjects(agonistName, this.agonists);

        if(agonist && agonistConc) {

            this.setState({responseData: []});
            this.setState({peakResponse: 1});

            const peakErrorFactor = 1 + (gaussianRand()-0.5)*this.randomisation; //randomisation sampled from roughly normal distribution around mean of 0.5 so take away 0.5 to give a mean of roughly 0
            const peakResponse = peakErrorFactor * (agonist.eMax * agonistConc)/(agonistConc + agonist.eC50)  //Hill Langmuir equation
            this.setState({peakResponse: peakResponse});

            let riseTime = 0;
            if(this.associationRateMultiplier === 0) {
                riseTime = this.timeToPeak;
            } else {
                riseTime = Math.floor(this.timeToPeak/(this.associationRateMultiplier * agonistConc/agonist.eC50));
                if (riseTime <= 0) riseTime = this.timeStep;
            }
            const riseConstant = Math.log(0.001)/riseTime;

            const decayTopTerm = peakResponse * agonist.decayEMax/100 * Math.pow(agonistConc, agonist.decaySlope);
            const decayBottomTerm = Math.pow(agonistConc, agonist.decaySlope) + Math.pow(agonist.decayEC50, agonist.decaySlope);
            const decay = decayTopTerm/decayBottomTerm;
            //const decay = peakResponse * agonist.decayEMax/100 * agonistConc ^ agonist.decaySlope/(agonistConc ^ agonist.decaySlope + agonist.decayEC50 ^ agonist.decaySlope);
            const plateau = peakResponse - decay;
            const decayConstant = agonist.decayRateMultiplier * Math.log(0.0001)/this.timeDecay;
            const washConstant = Math.log(0.01)/this.timeWash;

            let timeElapsed = -20;
            let response = 0;
            let valueJustBeforeWash;
            let tempResponseData = [];
            //let timer;
            
            const intervalTimer = setInterval(()=>{
                const ongoingErrorFactor = 1 + (gaussianRand()-0.5)*this.randomisation;
                if(timeElapsed <= 0) {
                    response = ongoingErrorFactor - 1 //random aound 0;
                } else if (timeElapsed > 0 && timeElapsed <= riseTime && timeElapsed <= this.timeWashStart) {
                    response = ongoingErrorFactor * peakResponse * (1-Math.exp(riseConstant*timeElapsed));
                } else if (timeElapsed <= this.timeWashStart) {
                    response = ongoingErrorFactor * plateau + decay * Math.exp(decayConstant*(timeElapsed-riseTime))
                    if(timeElapsed === this.timeWashStart) {
                        valueJustBeforeWash = response; //remember for decay below
                    }
                } else {
                    response = (ongoingErrorFactor - 1) + this.postWashPlateau/100 * valueJustBeforeWash + (1 - this.postWashPlateau/100) * valueJustBeforeWash * Math.exp(washConstant * (timeElapsed-this.timeWashStart+1));
                }
                tempResponseData.push({x:timeElapsed, y:response});
                this.setState({responseData: tempResponseData});
                timeElapsed += this.timeStep;
                if (timeElapsed > this.timeTotal) clearInterval(intervalTimer);
            }, 1);
            
            /*while (timeElapsed < this.timeTotal){
                const ongoingErrorFactor = 1 + (gaussianRand()-0.5)*this.randomisation;
                if(timeElapsed <= 0) {
                    response = ongoingErrorFactor - 1 //random aound 0;
                } else if (timeElapsed > 0 && timeElapsed <= riseTime && timeElapsed <= this.timeWashStart) {
                    response = ongoingErrorFactor * peakResponse * (1-Math.exp(riseConstant*timeElapsed));
                } else if (timeElapsed <= this.timeWashStart) {
                    response = ongoingErrorFactor * plateau + decay * Math.exp(decayConstant*(timeElapsed-riseTime))
                    if(timeElapsed === this.timeWashStart) {
                        valueJustBeforeWash = response; //remember for decay below
                    }
                } else {
                    response = (ongoingErrorFactor - 1) + this.postWashPlateau/100 * valueJustBeforeWash + (1 - this.postWashPlateau/100) * valueJustBeforeWash * Math.exp(washConstant * (timeElapsed-this.timeWashStart+1));
                }
                tempResponseData.push({x:timeElapsed, y:response});
                //timer = setTimeout(() => {
                //    this.setState({responseData: tempResponseData});
                //  }, 1000);
               timeElapsed += this.timeStep;
            }*/
         
         }
        //alert(agonistName);
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <ControlForm 
                            agonists = {this.agonists}
                            onSubmit = {(agonistName, agonistConc) => this.handleSubmit(agonistName, agonistConc)}
                        />
                    </Col>
                    <Col>
                        <VictoryChart
                            theme={VictoryTheme.material}
                            domain={{ x: [-20, 180], y: [-this.state.peakResponse/10, this.state.peakResponse*1.2] }}
                        >
                            <VictoryAxis tickValues={[-20, 0, 20, 40, 60, 80, 100, 120, 140, 160, 180]}>
                            </VictoryAxis>
                            <VictoryAxis dependentAxis>
                            </VictoryAxis>
                            <VictoryLine
                                style={{
                                    data: { stroke: "#c43a31" },
                                    parent: { border: "1px solid #ccc"}
                                }}
                                data={this.state.responseData}
                                //animate={{
                                //    duration: 2000,
                                //    onLoad: { duration: 1000 }
                                //}}
                            />
                        </VictoryChart>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Experiment;