var canvas = document.getElementsByClassName('alpha-sample')[0];

formatAlphaSample(canvas);	


function formatAlphaSample(canvas){
	var i=0; 
	var context = canvas.getContext('2d');
	var rectWidth = calculateRectWidth(canvas.width, canvas.height);
	var rowCount = canvas.width/rectWidth;
	var colCount = canvas.height/rectWidth;
	
	
	while(i < rowCount){			
		var j = 0;
			while(j < colCount){
				context.fillStyle = 'rgb('+ ((i + j) % 2) * 225 + ',' + ((i + j) % 2) * 225 + ',' + ((i + j) % 2) * 225 + ')';
				context.fillRect(i*rectWidth, j*rectWidth, rectWidth, rectWidth);				
				j = j + 1;
			}				
		i = i + 1;
	}	
	
}

function calculateRectWidth(width, height){
	var i = 2;
	
	while(i < width/10){
		if((width % i == 0) && (height % i == 0)){
			break;
		}else{
			i++;
		}
	}
	
	return i * 10;
}