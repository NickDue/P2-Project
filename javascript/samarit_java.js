let rotation = 0;
function rotate(x1,y1,x2,y2) {
    let picture = document.getElementById("picture");
    let angleForVector = calculateVector(x1,y1,x2,y2);
    picture.style.transform = `rotate(${angleForVector.angle}deg)`
    //console.log(calculateVector(x1, y1, x2, x2))

    function calculateVector(x1,y1,x2,y2){      //Udregner vektor mellem to punkter (mellem rapportør og samarit)
        let vector = {
            distance : 0.0, 
            angle : 0.0
        };
    
        vec = [0,0];
        vec[0] = x2 - x1;
        vec[1] = y2 - y1;
    
        vector.angle = calculateAngleVector(vec);
        vector.distance = distanceBetweenPoints(x1,y1,x2,y2);
        console.log("Distance: " + vector.distance, "Angle: " + vector.angle);
        return vector;
    }
    
    function calculateAngleVector(vec){ // Udregner vinklen mellem to vektorer - Vektoren givet i calculate vektor og en arbitrær vektor langs Y-aksen
        let x1 = 0;
        let y1 = 1;
        let x2 = vec[0];
        let y2 = vec[1];
    
        n = (x1 * x2 + y1 * y2) / (Math.sqrt(Math.pow(x1, 2) + Math.pow(y1, 2)) * Math.sqrt(Math.pow(x2, 2) + Math.pow(y2, 2)));
        radians = Math.acos(n);
    
        angle = radiansToDegrees(radians); 

        if (vec[0] < 0) angle = angle * (-1);
        return angle;
    }
    
    function radiansToDegrees(angle) {  //Udregner fra radianer til grader
        let pi = Math.PI;
        return angle * (180/pi);
    }
    
    function distanceBetweenPoints(x1, y1, x2, y2){ //Udregner afstanden mellem to punkter i et koordinat system
        let dist = Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
        
        return dist;
    }
}