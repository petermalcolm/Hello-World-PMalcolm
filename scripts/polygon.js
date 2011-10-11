/**
 * Peter Malcolm's JavaScript!
 */

var centerx = 120;
var centery = 60;
var radius = 50;
var sides = 12;
var poly_svg = "";
var teeth_svg = "";

var paper = Raphael(10, 100, 600, 400);                  // create a Raphael canvas
var border = paper.path('M 0 0 L 600 0 L 600 400 L 0 400 z');

var the_polygon = paper.path('M 0 0 L 0 0 z');
var the_teeth = paper.path('M 0 0 L 0 0 z');

this.draw_poly(0,0,20,20);

this.draw_1tooth(20,20,30,20);

///////// draw POLYGON //////////////

function draw_poly() {
  // if(the_polygon) the_polygon.hide();  // hide if needed
  poly_svg = "";
  var prevx, prevy;
  for(i = 0; i<sides; i++) {
    var arc_len = i*2.0*Math.PI/sides;
    // document.write('<br />pi: '+Math.PI);
    // document.write('<br />arc length: '+arc_len);
    var xx=centerx+Math.sin(arc_len)*radius;
    var yy=centery+(radius-Math.cos(arc_len)*radius);
  
    if(0==i){ poly_svg+='M ';}else{ poly_svg+='L ';}           	// move to ... line to

    if(i%2==1){ 						// odd sides: draw a square
	poly_svg+=draw_1tooth(prevx,prevy,xx,yy);
    } else {							// even sides: don't
    	poly_svg+=xx.toFixed(2).toString()+' '+yy.toFixed(2).toString()+' ';
    }

    prevx = xx;
    prevy = yy;
  }
  poly_svg+='z';                                             // close loop

  the_polygon.attr('path', poly_svg);                        // adjust polygon

  document.getElementById('echo_sides').innerHTML=('<br />'+(sides/2)+' teeth.');

}

/////// draw SQUARE (tooth) //////////  RETURNs an SVG string  //////////////

function draw_1tooth(lowerLeftX, lowerLeftY, lowerRightX, lowerRightY) {
  // pythag for side-length:
  var a_squared = (lowerLeftX - lowerRightX) * (lowerLeftX - lowerRightX);
  var b_squared = (lowerLeftY - lowerRightY) * (lowerLeftY - lowerRightY);
  var sideLength = Math.sqrt(a_squared + b_squared);

  // var points = new Array();
  var rotate = Math.atan2(lowerRightY - lowerLeftY, lowerRightX - lowerLeftX);

  // Create four points (arrays of size 2)
  // for( var i=0; i< 4; i++) { points[i]=new Array(2); }

  // clockwise... using JSON
  var points = [[lowerLeftX, lowerLeftY],
                [lowerLeftX, lowerLeftY-sideLength],
                [lowerLeftX+sideLength, lowerLeftY-sideLength],
                [lowerLeftX+sideLength, lowerLeftY]
               ];

  if( false) {  // NOT DEBUGGING! - (yet)
	// document.write('Debugging mode.  drawing square without rotation!');
	// document.write('<br />Debugging... lowerLeftX = '+lowerLeftX);
	// document.write('<br />Debugging mode.  points[0][0]='+points[0][0]);
	teeth_svg = 'M ';					// move to
	for( var i = 0; i < 4; i++) {
		// drawing(points[i].x,points[i].y,points[(i+1)%4].x,points[(i+1)%4].y);
		if( i > 0) { teeth_svg+='L '; } 		// line to
		teeth_svg+=points[i][0].toFixed(2).toString()+' '; // new point (xcoord)
		teeth_svg+=points[i][1].toFixed(2).toString()+' '; // new point (ycoord)
	}
	// teeth_svg+='z';							// this will close the square
	// document.write('<br />'+teeth_svg);
	return teeth_svg;
  } else {
	// rotation matrix for clockwise:
	// cos(t) sin(t)
	// -sin(t) cos(t)

	// rotation matrix for counter-clockwise:
	// cos(t) -sin(t)
	// sin(t) cos(t)


	for( var i = 0; i < 4; i++) {
		points[i][0] -= lowerLeftX;	// x						// set lower-left corner to 0,0
		points[i][1] -= lowerLeftY;	// y						// for rotation around this corner
		var oldP = new Array( points[i][0], points[i][1]);				// copy the point
		points[i][0] = (oldP[0] * Math.cos(rotate)) - (oldP[1] * Math.sin(rotate));
		points[i][1] = (oldP[0] * Math.sin(rotate)) + (oldP[1] * Math.cos(rotate));
		points[i][0] += lowerLeftX;	// x						// set lower-left corner to 0,0
		points[i][1] += lowerLeftY;	// y						// for rotation around this corner
	}
	// teeth_svg = 'M ';					// move to
	teeth_svg = 'L ';					// line to
	for( var i = 0; i < 4; i++) {
		// drawing(points[i].x,points[i].y,points[(i+1)%4].x,points[(i+1)%4].y);
		if( i > 0) { teeth_svg+='L '; } 		// line to
		teeth_svg+=points[i][0].toFixed(2).toString()+' '; // new point (xcoord)
		teeth_svg+=points[i][1].toFixed(2).toString()+' '; // new point (ycoord)
	}
	// teeth_svg+='z';							// this will close the square
	// document.write('<br />'+teeth_svg);
	return teeth_svg;

				
  }
  
}

///////// create UI //////////////////

var more_btn = paper.path('M 10 18 L 18 18 L 14 10 z');
more_btn.attr("fill", "black");

var less_btn = paper.path('M 25 10 L 29 18 L 33 10 z');
less_btn.attr("fill", "black");

more_btn.click(function (event) {
  if(sides >= 32) return;
  sides+=2;
  draw_poly();
});

less_btn.click(function (event) {
  if(sides <= 12) return;
  sides-=2;
  draw_poly();
});

///////// UTILS //////////////////


function Point(newX, newY) {
  this.x = newX;
  this.y = newY;
}

Point.prototype.toString = function() {
  return ('('+this.x+', '+this.y+')');
}

// document.write('<br /><br />Here\'s my SVG:<br />'+poly_svg);

// function imafunction() {
//   var returnval=0;
//   return returnval;
// }