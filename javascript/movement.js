
//for at imitere en samarits bevægelsesmønster, vil der være en sandsynlighed for at samaritten laver afvigelse på ruten. 


function movement(destinationX,destinationY,originX,originY){

    let dice = 0;
    let coords = [0,0];
    coords[0] = destinationX - originX;
    coords[1] = destinationY - originY;
    let dist = distanceBetweenPoints(originX,originY,destinationX,destinationY);
    let enhedsvektorX = (1/(dist))*coords[0];
    let enhedsvektorY = (1/(dist))*coords[1];
    let position = [originX,originY];
    let distance = 1000;
    while(distance > 5) {  //Når origin har ramt destination.
    //for(i = 0 ; i < 1000 ; i++) {
        dice = randomDice();
        if (dice <= 98) {
            distance = distanceBetweenPoints(position[0],position[1],destinationX,destinationY)
            position[0] += enhedsvektorX;
            position[1] += enhedsvektorY;
            console.log(distance);
            }
        else {     
            position[0] += enhedsvektorX*Math.random()*51;
            position[1] += enhedsvektorY*Math.random()*51;
            dist = distanceBetweenPoints(position[0],position[1],destinationX,destinationY);
            enhedsvektorX = (1/(dist))*(destinationX-position[0]);
            enhedsvektorY = (1/(dist))*(destinationY-position[1]);
            console.log("check here");
            }
    }
}


function distanceBetweenPoints(x1, y1, x2, y2){ //Udregner afstanden mellem to punkter i et koordinat system
    let dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
    
    return dist;
}


function randomDice(){      
    number = Math.random()*101;// giver mellem 0 og 1 --  dvs max 1, og vores max er 20
    //console.log(number);
    return number;
}
