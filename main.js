var selectObj = document.getElementById('model-select');
selectObj.addEventListener('change', switchControls);

var editMode = false;
var editModeCont;
var editModeValue;

	function switchControls(){
		var hide = (selectObj.value == 'hsl') ? 'rgb' : 'hsl';
		var showElem = document.getElementById(selectObj.value)
		var hideElem = document.getElementById(hide);

		hideElem.classList.add('hidden');
		showElem.classList.remove('hidden');
	}
	
	function colorOutput(model){
			
			var color;
			var c1, c2, c3;
			
			if(model == 'hsl'){
				color = {
					h : document.getElementById('h-input').value,
					s : document.getElementById('s-input').value,
					l : document.getElementById('l-input').value,
					a : document.getElementById('a-input').value
				};
				
			}else{
				color = {
					r : document.getElementById('r-input').value,
					g : document.getElementById('g-input').value,
					b : document.getElementById('b-input').value,
					a : document.getElementById('a-input').value
				};				
			}
			
			c1 = model.substring(0,1);
			c2 = model.substring(1,2);
			c3 = model.substring(2,3);
			
			var alpha = document.getElementById('a-input').value;
			document.getElementById('a-value').innerHTML = alpha;
			
			printValues(color, model, document.getElementById(c1 + '-value'), document.getElementById(c2 + '-value'), document.getElementById(c3 + '-value'));
						
			var colorValue = colorString(color, model);
			
			paintColor(document.getElementById('color-output'), colorValue);
			
			document.getElementById(model + '-value').innerHTML = colorValue;
			
			var convertColor = (model == 'hsl') ? hsl2rgb(color) : rgb2hsl(color);
			
			convertColor.a = color.a;
			
			c1 = (model == 'hsl') ? 'r' : 'h';
			c2 = (model == 'hsl') ? 'g' : 's';
			c3 = (model == 'hsl') ? 'b' : 'l';
			
			var convertModel = (model == 'hsl') ? 'rgb' : 'hsl';
			
			printValues(convertColor, convertModel, document.getElementById(c1 + '-value'), document.getElementById(c2 + '-value'), document.getElementById(c3 + '-value'));
			
			document.getElementById(c1 + '-input').value = convertColor[c1];
			document.getElementById(c2 + '-input').value = convertColor[c2];
			document.getElementById(c3 + '-input').value = convertColor[c3];			
			
			var convertColorValue = colorString(convertColor, convertModel);			
			document.getElementById(convertModel + '-value').innerHTML = convertColorValue;
			
			var hexColor = (model == 'hsl') ? rgb2hex(convertColor) : rgb2hex(color);
			document.getElementById('hex-value').innerHTML = hexColor;
			
			styleSliders();
	}
	
	function printValues(color, model, c1Elem, c2Elem, c3Elem){	
		
		var hundred = (model == 'hsl') ? 100 : 1;
		
		c1Elem.innerHTML = Math.round(color[model.substring(0,1)]);
		c2Elem.innerHTML = Math.round(color[model.substring(1,2)] * hundred);
		c3Elem.innerHTML = Math.round(color[model.substring(2)] * hundred);
	}
	
	function colorString(color, model){
		var percent = (model == 'hsl') ? '%' : '';
		var hundred = (model == 'hsl') ? 100 : 1;
		
		return model + 'a(' + Math.round(color[model.substring(0,1)]) + ',' + Math.round(color[model.substring(1,2)] * hundred) + percent + ','
			   + Math.round(color[model.substring(2)] * hundred) + percent + ',' + color.a + ')';
	}
	
	function paintColor(divElem, colorValue){		
		divElem.style.backgroundColor = colorValue;	
	}
	
	function rgb2hsl(colorRGB){
		//As learned from http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
		var colorHSL = {h: 0, s:0, l: 0, a: 0};
		
		var rp = colorRGB.r / 255;
		var gp = colorRGB.g / 255;
		var bp = colorRGB.b / 255;
		
		var cMin = Math.min(rp, gp, bp);
		var cMax = Math.max(rp, gp, bp);
		
		var delta = cMax - cMin;
		
		colorHSL.l = (cMin + cMax) / 2;
		
		if(delta == 0){
			colorHSL.s = 0;
			colorHSL.h = 0;
		}else{
			colorHSL.s = delta / (1- Math.abs(2 * colorHSL.l - 1));
			
			switch(cMax){
				case rp:
					colorHSL.h = 60 * (((gp - bp) / delta) % 6);
				break;
				case gp:
					colorHSL.h = 60 * (((bp - rp) / delta) + 2);
				break;
				case bp:
					colorHSL.h = 60 * (((rp - gp) / delta) + 4);
				break;
			}
		}
		
		if(colorHSL.h < 0) colorHSL.h += 360;
		
		return colorHSL;
	}
	
	function hsl2rgb(colorHSL){
		//As learned from http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
		var colorRGB = {r: 0, g: 0, b: 0, a: 0};
		
		var c = (1 - Math.abs(2 * colorHSL.l - 1)) * colorHSL.s;
		var x = c * (1 - Math.abs(((colorHSL.h / 60) % 2) - 1));
		var m = colorHSL.l - (c / 2);
		
		var cp = {rp: 0, gp: 0, bp: 0};
		
		if(colorHSL.h >= 0 && colorHSL.h < 60){    cp.r = c; cp.g = x; cp.b = 0; }
		if(colorHSL.h >= 60 && colorHSL.h < 120){  cp.r = x; cp.g = c; cp.b = 0; }
		if(colorHSL.h >= 120 && colorHSL.h < 180){ cp.r = 0; cp.g = c; cp.b = x; }
		if(colorHSL.h >= 180 && colorHSL.h < 240){ cp.r = 0; cp.g = x; cp.b = c; }
		if(colorHSL.h >= 240 && colorHSL.h < 300){ cp.r = x; cp.g = 0; cp.b = c; }
		if(colorHSL.h >= 300 && colorHSL.h <= 360){ cp.r = c; cp.g = 0; cp.b = x; }
		
		
		colorRGB.r = (cp.r + m) * 255;		
		colorRGB.g = (cp.g + m) * 255;		
		colorRGB.b = (cp.b + m) * 255;		
		
	
		return colorRGB;
	}
	
	function rgb2hex(color){
	
		var zero;
		var hex;
		var hexString = '#';
		
		hex =  hexValue(Math.round(color.r));
		zero = (hex.length < 2) ? '0' : '';		
		hexString += zero + hex;
		
		hex =  hexValue(Math.round(color.g));
		zero = (hex.length < 2) ? '0' : '';		
		hexString += zero + hex;
		
		hex =  hexValue(Math.round(color.b));
		zero = (hex.length < 2) ? '0' : '';		
		hexString += zero + hex;
		
		return hexString;
	}
	
	function hexValue(n){
		var hex = '';
		var hexDigits = '0123456789ABCDEF';
		
		do{
		
			hex = hexDigits.substr(n % 16, 1) + hex;			
			n = Math.floor(n / 16);		
		
		}while(n > 0);
		
		return hex;
	}
	
	function adjustAlpha(){
		var alpha = document.getElementById('a-input').value;
		
		document.getElementById('color-output').style.opacity = alpha;
		document.getElementById('a-value').innerHTML = alpha;
	}
	
	function styleSliders(){
		
		var hBackground = 'linear-gradient(90deg,';
		var sBackground = 'linear-gradient(90deg,';
		var lBackground = 'linear-gradient(90deg,';
		
		var rBackground = 'linear-gradient(90deg,';
		var gBackground = 'linear-gradient(90deg,';
		var bBackground = 'linear-gradient(90deg,';
		
		var aBackground = 'linear-gradient(90deg,';		
		
		for(var i=0; i<=360; i++){
			color = {
				h: i,
				s: document.getElementById('s-input').value,
				l: document.getElementById('l-input').value,
				a: document.getElementById('a-input').value
			};
			
			hBackground += colorString(color, 'hsl');
			
			if(i < 360) hBackground += ',';
		}
		
		for(var i=0; i<=100; i++){
			sColor = {
				h: document.getElementById('h-input').value,
				s: i/100,
				l: document.getElementById('l-input').value,
				a: document.getElementById('a-input').value
			};
			
			lColor = {
				h: document.getElementById('h-input').value,
				s: document.getElementById('s-input').value,
				l: i/100,
				a: document.getElementById('a-input').value
			}
			
			aColor = {
				h: document.getElementById('h-input').value,
				s: document.getElementById('s-input').value,
				l: document.getElementById('l-input').value,
				a: i/100
			}
			
			sBackground += colorString(sColor, 'hsl');
			lBackground += colorString(lColor, 'hsl');
			
			aBackground += colorString(aColor, 'hsl');
			
			if(i < 100){ sBackground += ','; lBackground += ','; aBackground += ',';}
		}
		
		for(var i=0; i<=255; i++){
			rColor = {
				r: i,
				g: document.getElementById('g-input').value,
				b: document.getElementById('b-input').value,
				a: document.getElementById('a-input').value
			};
			
			gColor = {
				r: document.getElementById('r-input').value,
				g: i,
				b: document.getElementById('b-input').value,
				a: document.getElementById('a-input').value
			};
			
			bColor = {
				r: document.getElementById('r-input').value,
				g: document.getElementById('b-input').value,
				b: i,
				a: document.getElementById('a-input').value
			};
			
			rBackground += colorString(rColor, 'rgb');
			gBackground += colorString(gColor, 'rgb');
			bBackground += colorString(bColor, 'rgb');
			
			if(i < 255){ rBackground += ','; gBackground += ','; bBackground += ','; }
		}
		
		hBackground += ')';
		sBackground += ')';
		lBackground += ')';
		
		rBackground += ')';
		gBackground += ')';
		bBackground += ')';	
		
		aBackground += ')';		

		
		document.getElementById('h-input').style.background = hBackground;
		document.getElementById('s-input').style.background = sBackground;
		document.getElementById('l-input').style.background = lBackground;
		
		document.getElementById('r-input').style.background = rBackground;
		document.getElementById('g-input').style.background = gBackground;
		document.getElementById('b-input').style.background = bBackground;
		
		document.getElementById('a-input').style.background = aBackground;
	}
	
	function saveColor(){
	
	editMode = false;
	var savedColorsCont = document.getElementById('saved-colors');
	
		if(savedColorsCont.childElementCount <=5){
			
			
			var outputColor = document.getElementById('color-output').style.backgroundColor;
			console.log(outputColor);
				
			//Create HTML for new color
			
			//Main container
			var container = document.createElement('div');
			container.classList.add('saved-clr-container');
			
			//Main element
			var elem = document.createElement('div');
			elem.classList.add('saved-clr');
			elem.style.backgroundColor = outputColor;
			elem.style.opacity = outputColor.a;
			
			//Canvas for alpha sample
			var alphaCanvas = document.createElement('canvas');
			alphaCanvas.classList.add('alpha-sample');
			alphaCanvas.width = 96;
			alphaCanvas.height = 96;
			formatAlphaSample(alphaCanvas);
			
			container.appendChild(alphaCanvas);
			
			//Option buttons container 
			var options = document.createElement('div');
			options.classList.add('options');
			
			//Close Button
			var closeButton = document.createElement('div');
			closeButton.classList.add('close-btn');
			closeButton.classList.add('btn');
			var closeIcon = document.createElement('i');
			closeIcon.classList.add('material-icons');
			closeIcon.innerHTML = '&#xe5cd;';
			
			closeButton.addEventListener('click', function(){
				savedColorsCont.removeChild(container);
			});
			
			
			closeButton.appendChild(closeIcon);
			options.appendChild(closeButton);
			
			//Edit Button
			var editButton = document.createElement('div');
			editButton.classList.add('edit-btn');
			editButton.classList.add('btn');
			var editIcon = document.createElement('i');
			editIcon.classList.add('material-icons');
			editIcon.innerHTML = '&#xe8b8;';
			
			editButton.addEventListener('click', function(){
				editMode = !editMode;
				
				if(editMode){					
					editModeCont = elem;
					editModeValue = colorText;
				}else{
					editModeCont = '';
				}
			});
			
			editButton.appendChild(editIcon);
			options.appendChild(editButton);
			
			elem.appendChild(options);
			
			//p tag
			var colorText = document.createElement('p');
			colorText.classList.add('clr-val');
			
			var split = outputColor.split('(')[1].split(',');
			
			var savedColor = {
				r: split[0],
				g: split[1],
				b: split[2].split(')')[0],
				a: document.getElementById('a-input').value
			}
			
			colorText.innerHTML = rgb2hex(savedColor);
			
			container.appendChild(elem);
			container.appendChild(colorText);
			
			
			
			savedColorsCont.appendChild(container);				
			
			console.log(savedColorsCont.childElementCount);
		}else{
		
			alert('Please edit or delete a saved color to continue.');
			
			console.log(savedColorsCont.childElementCount);
		}
	}
	
	function editColor(newColor){
		if(editMode){					
			editModeCont.style.backgroundColor = newColor;
			
			var split = newColor.split('(')[1].split(',');
			
			
			var editColor = {
				r: split[0],
				g: split[1],
				b: split[2].split(')')[0],
				a: document.getElementById('a-input').value
			}
			
			editModeValue.innerHTML = rgb2hex(editColor);
		}
	}