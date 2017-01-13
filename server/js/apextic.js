/********************************************************************
 * Product: APEX Touch Time Input Control
 * Copyright 2015: Dick Dral, Detora, The Netherlands
 *
 * Modifications:
 *  15-02-2015 Clock always starts with invisible hands
 *             Clock numbers can be used to chose also on touch device
 *  11-01-2017 Made ready for Apex plug-in
 *             - namespace built in
 *             - arguments time and mode are removed. Only window_base remains
 *  13-01-2017 - argument time_format added
 *             
 * 
 */

// global namespace
var apextic = {

 x : null,
 y : null,
 hourHand : null,
 minuteHand : null,
 activeHand : null,
 handLength : { hourHand : "60", minuteHand : "85" },
 clockItem : null,
 ticId  : 'ticControl',
 ticBox : document.getElementById('ticBox'),
 startx : 0,
 starty : 0,
 dist : 0,
 hourTextLeft : 0,
 window_base: 7,
 time_format: 'hh24:mi',
 logging: 0,

 // clock state
 activeHandName : 'hour',
 currentHour    : null,
 currentMinutes : null,
 sensitivity    : 20,
 mode           : 'base',
 touchStartInClock : false,
 

/********************************************************************
 * Utility functions
 */

debug: function (text) 
{
  if ( this.logging == 1 ) { console.log(text); }
},

// prefix one character number with zero
lpad : function (number) 
{ var string = "";
  if ( number != null ) 
  { string = number.toString();
    if ( string.length == 1) {string = '0'+string; }
  }
  return(string);
},

// determine angle from vector
getAngleFromVector : function ( px, py )
{ var angle = 0;
  var rad2deg = 180/Math.PI;

  if ( px == 0 )
  { if ( py > 0 ) { angle = 180; }
    else          { angle = 0;   } 
  } else
  { angle = Math.atan(py/Math.abs(px))*rad2deg;
    if ( px > 0 ) 
    { angle = 90 + angle; }
    else
    { angle = 270 - angle; }
  }
  return(angle);
},

setMode : function (theMode) 
{ this.mode = theMode;
  if ( this.mode == 'AM' )
  { 
    this.window_base = 0;
    $('#buttonPM text').attr('fill','black');
    $('#buttonAM text').attr('fill','lightgray');
  }
  else
  { 
    this.window_base = 12;
    $('#buttonPM text').attr('fill','lightgray');
    $('#buttonAM text').attr('fill','black');
  }
},

/********************************************************************
 * SVG primitives
 */
SVG : function (tag)
{ return document.createElementNS('http://www.w3.org/2000/svg', tag);
},


/********************************************************************
 * clock manipulation
 */
setCurrentTimeFromString : function (time) 
{ var elems = time.split(':');
  if ( elems.length >= 1 ) 
  { this.currentHour    = parseInt(elems[0]);
    if ( this.currentHour >= 12 ) 
    { this.setMode('PM'); }
    else
    { this.setMode('AM'); }
  }
  if ( elems.length >= 2 ) { this.currentMinutes = parseInt(elems[1]);}
},

// determine which sector is pointed to
getTime: function (dirx, diry)
{ var item, vector;
 
  if (Math.abs(diry) > Math.abs(dirx))
  { vector = dirx/diry;
    if ( diry > 0)
      item = 11;      // sector 11-1 
    else
      item = 5;      // sector 5-7 
  }
  else
  { vector = -diry/dirx;
    if ( dirx > 0)
      item = 2;      // sector 2-4 
    else
      item = 8;      // sector 8-10 
  }
  if ( vector >  -0.26 )  item += 1;
  if ( vector >  0.26  )  item += 1;    
  if ( item   >= 12    )  item -= 12;       
  
  return(item);
},


// get hand that is active
getActiveHand : function ()
{ if ( !this.activeHandName ) { this.activeHandName = 'hour';   this.activeHand = hourHand; }
  return(this.activeHandName);
},

// set active hand to type (hour or minute) 
// or toggle active hand (type = toggle)
setActiveHand : function (type)
{ var minuteHandColor = 'black';
  var hourHandColor   = 'black';
  
  if ( type == 'toggle' || type == 'hour' || type == 'minute' )
  { 
    if ( type == 'toggle' ) 
    { if ( this.getActiveHand() == 'hour' ) { type = 'minute'; }
      else                             { type = 'hour';   }
    }

    if ( type == 'minute' ) 
    { minuteHandColor = 'red';  this.activeHand = this.minuteHand;  this.activeHandName = 'minute';  }    
    else if ( type == 'hour' )
    { hourHandColor = 'red';    this.activeHand = this.hourHand;    this.activeHandName = 'hour';    }    
  
    // set color to indicate active hand
    $(hourHand)[0].setAttribute('fill'  ,hourHandColor  );   
    $(minuteHand)[0].setAttribute('fill',minuteHandColor); 

    // also set color of digital time display
    document.getElementById('digitalTimeHours').setAttribute('fill',hourHandColor);
    document.getElementById('digitalTimeMinutes').setAttribute('fill',minuteHandColor);
  }
},

withinClock : function (px,py)
{ var retval = false;
  dx = px - x[0];
  dy = py - y[0];
  if ( Math.sqrt(dx*dx + dy*dy) <= this.handLength[this.minuteHand] )
  { retval = true; }
  return retval;
},

/* Function    : setHand
 * Author      : Dick Dral        Date : 1-11-2013
 * Description : sets the hand of the clock according the given direction. 
 *               The current mode determines which hand is set (hour or minute).
 *               When the hand is too long, it will be shortened to the maximum length
 * Parameters  : px            x component of the direction 
 *               py            y component of the direction
 */
setHand : function (px,py)
{ 
  var dist      = Math.sqrt(px*px + py*py);
  var angle     = this.getAngleFromVector(px,py);
  // correct for downward pointing hand
  angle = angle + 180;
  var maxLength = this.handLength[this.activeHandName+'Hand'];

  if ( dist > maxLength) 
  { dist = maxLength;
  }
  
  var rotation = angle.toString() + ' '+x[0]+' '+y[0];
  var handName = this.activeHandName+'Hand'; 
  $('#'+handName)[0].setAttribute('height',dist);
  $('#'+handName)[0].setAttribute('transform','rotate('+rotation+')');
  
},

hideHands : function () {
  this.hourHand.setAttribute("height","0");
  this.minuteHand.setAttribute("height","0");  
},

setHourHand : function (hour)
{ if ( hour ) 
  { this.currentHour = Math.trunc(hour); }
  else
  { hour = this.currentHour; }
    
  // take minutes into account for hourhand
  if ( this.currentMinutes )
  { hour = Math.trunc(hour) + this.currentMinutes/80; }
  degrees = (hour + 6) * 30;
  rotation = degrees.toString() + " "+x[0]+" "+y[0];
  this.hourHand.setAttribute("transform","rotate("+rotation+")");
  this.hourHand.setAttribute("height",this.handLength['hourHand']);
},

setMinuteHand : function (minutes)
{ if ( minutes ) 
  { this.currentMinutes = minutes; }
  else
  { minutes = this.currentMinutes; }

  degrees = (Math.round(minutes)) * 6 + 180;
  rotation = degrees.toString() + " "+x[0]+" "+y[0];
  this.minuteHand.setAttribute("transform","rotate("+rotation+")");
  this.minuteHand.setAttribute("height",this.handLength['minuteHand']);
},

hideControl : function ()
{ $('#ticPageBackground').hide();
  $('#'+this.ticId).hide();
},

showControl : function ()
{ $('#'+this.ticId).show();
},

returnTime : function ()
{ 
  debug('returnTime');  
  this.hideControl();
  if (this.clockItem && this.currentHour && this.currentMinutes ) 
  { var time = this.lpad(this.currentHour) + ':' + this.lpad(this.currentMinutes);
    $(clockItem).val(time);
  }
},

/* generate SVG element */
svgCreateElement : function( type ) 
{ return document.createElementNS("http://www.w3.org/2000/svg", type);
},

/* generate SVG root element */
svgCreateRootElem : function  (id, width, height, viewbox)
{ var svg = this.svgCreateElement('svg');
  svg.setAttribute("id",id);
  svg.setAttribute("width",width);
  svg.setAttribute("height",height);
  svg.setAttribute("viewBox",viewbox);
  return(svg);
},

svgCreateGroup : function  ( name, groupClass ) 
{ var group = this.svgCreateElement('g');
  group.setAttribute('id',name);
  if ( groupClass ) 
  { group.setAttribute('class',groupClass); } 
  return (group);
},

centerTextElement : function (textId,x,width)
{ textObj = document.getElementById(textId);
  length = textObj.getComputedTextLength()
  xText  = x + ( width - length )/2;
  textObj.setAttribute('x',xText);
},

leftAlignTextElement : function (textId,xLeft)
{ textObj = document.getElementById(textId);
  length = textObj.getComputedTextLength()
  var xRight  = xLeft - length;
  textObj.setAttribute('x',xRight);
  return(xLeft);
},

/* generate SVG text element */
svgCreateTextElement : function ( name, text, x, y )
{ newText = this.svgCreateElement('text'); 
  newText.setAttribute("id",name);
  newText.setAttribute("x",x);
  newText.setAttribute("y",y);
  var textNode = document.createTextNode(text);
  newText.appendChild(textNode);
  return newText;
},

svgCreateRect : function (group,id,x,y,width,height,fill,stroke,strokeWidth)
  { $(this.svgCreateElement('rect')).attr('id',id)
                .attr('x',x).attr('y',y)
                .attr('width',width).attr('height',height)
                .attr('stroke-width',strokeWidth).attr('stroke',stroke)
                .attr("fill",fill).appendTo( $(group) );  
  },

/* generates rounded button */
createButton : function  ( group, name, text, x, y, width, height )
{ /* create group */
  var button = this.svgCreateGroup(name,'button');

  $(this.SVG('rect')).attr('id',name+"Box")
                .attr('x',x).attr('y',y)
                .attr('rx','5').attr('ry','5')
                .attr('width',width).attr('height',height)
                .attr('stroke-width','1').attr('stroke','black')
                .attr("fill","white").appendTo( $(button) );  

  $(this.SVG('animate')).attr("begin","click")
                   .attr("dur","0.5s")
                   .attr("repeatCount","1")
                   .attr("attributeName","fill")
                   .attr("values","white; gray ; white")
                   .attr("fill","freeze").appendTo( $('#'+name+'Box') );

  buttonText = this.svgCreateTextElement(name+"Text",text,x,y+height-14)

  $(buttonText).appendTo( $(button) );
  
  $(button).appendTo( $(group) );  

  this.centerTextElement(buttonText.id,x,width);

  return(button);
},

// generate hand
generateHand : function (group, id)
  { var hand = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a Rect in SVG's namespace
    hand.setAttribute("id"    ,id);
    hand.setAttribute("x"     ,169);
    hand.setAttribute("y"     ,y[0]);
    hand.setAttribute("width" ,"5");
    hand.setAttribute("height",this.handLength[id]);
    hand.setAttribute("rx"    ,"3");
    hand.setAttribute("ry"    ,"3");
    hand.setAttribute("fill"  ,"black");
    hand.setAttribute("stroke-width","0");
    hand.setAttribute("transform","rotate(180 "+x[0]+" "+y[0]+")");
    handGroup = this.svgCreateGroup(id+'Group');
    handGroup.appendChild(hand);
    group.appendChild(handGroup);
    if ( id == 'hourHand' )
    { this.hourHand = hand; }
    else
    { this.minuteHand = hand; }
  },

updateDigitalTime : function  ( hours, minutes )
{ if ( hours != null )
  { if ( hours >= 0 ) 
    { document.getElementById('digitalTimeHours').textContent = this.lpad(hours);
      this.leftAlignTextElement('digitalTimeHours',hourTextLeft);
    }
    if ( minutes >= 0 ) 
    { document.getElementById('digitalTimeMinutes').textContent = this.lpad(minutes);
    }
  }
  else
  { document.getElementById('digitalTimeHours').textContent = "";
    document.getElementById('digitalTimeMinutes').textContent = "";
  }
},

updateAnalogTime : function  ( hours, minutes )
{ hours = parseInt(hours);
  if ( this.currentMinutes )  { hours = hours + minutes/80; }
  this.setHourHand(hours);
  if (this.currentMinutes) this.setMinuteHand(minutes);  // only display when minutes has value
},

createDigitalTime : function ( group, hours, minutes)
{ lGroup = this.svgCreateGroup('ticDigitalTimeGroup');
  $(lGroup).appendTo ( $(group) );

  x = 95;       y = -35;
  width = 148;  height = 35;
  this.svgCreateRect(lGroup,'ticDigitalTimeBox',x,y,width,height,'white','black','1');
  y  = y + height - 5;

  xText = x + width/2;
  text = this.svgCreateTextElement('digitalTimeColon',':',xText,y-5);
  $(text).appendTo( $(lGroup) );

  hours = this.lpad(hours);
  xText = x + width/2 - 5;
  text = this.svgCreateTextElement('digitalTimeHours',hours,xText,y-5);  
  $(text).appendTo( $(lGroup) );
  hourTextLeft = this.leftAlignTextElement('digitalTimeHours',xText);
  
  minutes = this.lpad(minutes);
  xText = x + width/2 + 12;
  text = this.svgCreateTextElement('digitalTimeMinutes',minutes,xText,y-5);
  $(text).appendTo( $(lGroup) );
  
  return(lGroup);
},

setCurrentDigitalTime : function ()
{ this.updateDigitalTime(this.currentHour,this.currentMinutes);
},

toAM : function ()
{ if ( this.currentHour >= 12 ) 
  { this.currentHour = this.currentHour - 12; 
    this.setCurrentDigitalTime();
  }
  this.setMode('AM');
},

toPM : function ()
{ if ( this.currentHour < 12 ) 
  { this.currentHour = this.currentHour + 12; 
    this.setCurrentDigitalTime();
  }
  this.setMode('PM');
},

setCurrentAnalogTime : function ()
{ 
  // show analog time
  this.updateAnalogTime(this.currentHour,this.currentMinutes);
},

ticSetTime : function  (hour,minutes)
{ 
  // if no parameters then take current time
  if (hour)    { this.currentHours   = hour; }
  if (minutes) { this.currentMinutes = minutes; }

  // display time digitally and analog
  this.setCurrentDigitalTime();
  this.setCurrentAnalogTime();
},

ticAddTouchEvents : function  ( id )
{

  var ticBox = $('#'+id)[0];

  ticBox.addEventListener('touchstart', function(e){
    var touchobj = e.changedTouches[0];  // reference first touch point (ie: first finger)
    startx = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser
    starty = parseInt(touchobj.clientY); // get y position of touch point relative to top edge of browser
    apextic.debug('touchStart: starting position = '+startx+";"+starty);
    
    apextic.touchStartInClock = false;
    if ( apextic.withinClock(startx,starty) )
    { e.preventDefault();   // no other function performed
      apextic.touchStartInClock = true;
    }                  
   }, false);
  
  ticBox.addEventListener('touchmove', function(e){
    var touchobj = e.changedTouches[0] // reference first touch point for this event
    var dirx = parseInt(touchobj.clientX)-startx;
    var diry = parseInt(touchobj.clientY)-starty;
    apextic.setHand(dirx,diry);   // shows hand as visual feedback
    e.preventDefault();
  }, false);
 
  ticBox.addEventListener('touchend', function(e){
    var touchobj = e.changedTouches[0] // reference first touch point for this event
    var dirx = parseInt(touchobj.clientX)-startx;    
    var diry = parseInt(touchobj.clientY)-starty;
    apextic.debug('touchEnd: directions = '+dirx+";"+diry);
    apextic.setHand(dirx,diry);
    // prevent from reacting on click by requiring minimum distance

    if ( (Math.abs(dirx) + Math.abs(diry)) > apextic.sensitivity ) 
    { var time = apextic.getTime(dirx,-diry);
      if ( apextic.activeHandName == 'hour' )
      { apextic.currentHour = time; 
        // adapt hour to time window
        if ( apextic.currentHour < apextic.window_base ) { apextic.currentHour = apextic.currentHour + 12; }
      }
      else
      { apextic.currentMinutes = time * 5; }
      apextic.ticSetTime();
      apextic.setActiveHand('toggle');
    }
    if ( apextic.touchStartInClock )    
    { e.preventDefault(); }
   }, false); 

},

/********************************************************************
 * control TIC
 */
ticPageBackground : function ()
{ 
  return ( $('#ticPageBackground') );
},

ticExists : function ()
{ 
  return ( $('#ticControl').length > 0 );
},

ticCancel : function ()
{ 
  this.hideControl();
},

ticReturnTime : function ()
{ 
  this.debug('ticReturnTime');
  this.hideControl();
    
  // return chosen time to clock item
  if (this.clockItem) 
  { this.currentTime = null;
    if ( this.currentHour > -1 && this.currentMinutes > -1 ) 
      { 
        var am_pm = (this.currentHour > 12 ) ? 'PM' : 'AM';
        var hour  = (this.currentHour > 12 ) ? this.currentHour - 12 : this.currentHour;

        if ( this.time_format == 'hh:mi am' )
        { 
           this.currentTime = this.lpad(hour) + ':' + this.lpad(this.currentMinutes) + ' ' + am_pm;
        }

        if ( this.time_format == 'hh24.mi' )
        { 
           this.currentTime = this.lpad(this.currentHour) + '.' + this.lpad(this.currentMinutes);
        }

        if ( this.time_format == 'hh.mi am' )
        { 
           this.currentTime = this.lpad(hour) + '.' + this.lpad(this.currentMinutes) + ' ' + am_pm;
        }

        // else default
        if ( this.currentTime == null )
        { 
          this.currentTime = this.lpad(this.currentHour) + ':' + this.lpad(this.currentMinutes); 
        }
        this.debug(this.currentTime);
        
        $(this.clockItem).val(this.currentTime);
      }  
  }
},

/* ------------------------------------
 * display the TIC control
 */

buildControl : function ( item )
{ 
  // create div covering the whole page
  $('body').append('<div id="ticPageBackground"></div>');

  // create div covering the whole page for centering of control
  $('body').append('<div id="ticControl"></div>');

  // create containing div for clock
  $('#ticControl').append('<div id="ticBox"></div>');
  

  var svgWidth = Math.min( $(window).width(), 500);
  var svgHeight = Math.round( svgWidth * 650 /500 );
  
  svg = this.svgCreateRootElem("ticClock",svgWidth,"650","0 0 350 350");
  $(svg).appendTo( $('#ticBox') );

  var ticTime = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  ticTime.setAttribute("id","ticTime");
  ticTime.setAttribute("color","black");
  ticTime.setAttribute("font-family","arial");
  ticTime.setAttribute("font-size","34");
  svg.appendChild(ticTime); 

  this.createDigitalTime(ticTime,0,0);
  $('#ticDigitalTimeGroup').click ( function (event) {
    this.setActiveHand('toggle');
  });
  
  buttonAM = this.createButton ( ticTime, 'buttonAM', 'AM',  10, -35, 70, 35 );
  $(buttonAM).click( function() { apextic.toAM(); } );

  buttonPM = this.createButton ( ticTime, 'buttonPM', 'PM', 258, -35, 70, 35 );
  $(buttonPM).click( function() { apextic.toPM(); } );
  
  buttonCancel = this.createButton ( ticTime, 'buttonCancel', 'Cancel',  10, 340, 149, 35 );
  $(buttonCancel).click ( function() { apextic.ticCancel();} );

  buttonOK = this.createButton ( ticTime, 'buttonOK', 'OK', 178, 340, 149, 35 );
  $(buttonOK).click ( function() { apextic.ticReturnTime();} );
  

  var group = document.createElementNS("http://www.w3.org/2000/svg", 'g');
  group.setAttribute("id","ticNumbers");
  group.setAttribute("color","black");
  group.setAttribute("font-family","arial");
  group.setAttribute("font-size","34");
  svg.appendChild(group); 

  this.ticAddTouchEvents('ticNumbers');

  // draw numbers on clock
  x = [ 171, 213, 254, 267, 254, 214, 162, 108, 69, 55, 59, 100, 152];
  y = [ 152, 74, 113, 164, 218, 255, 270, 255, 218, 164, 113, 74, 58];
  for ( i=0; i <= 12 ; i++ ) 
  { y[i] = y[i] + 12; } 

  // draw background
  newRect = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a Rect in SVG's namespace
  newRect.setAttribute("id","ticBackground");
  newRect.setAttribute("x"     ,"10");
  newRect.setAttribute("y"     ,"10");
  newRect.setAttribute("width" ,"318");
  newRect.setAttribute("height","314");
  newRect.setAttribute("rx"    ,"65");
  newRect.setAttribute("ry"    ,"65");
  newRect.setAttribute("fill"  ,"black");
  newRect.setAttribute("stroke-width","0");
  group.appendChild(newRect);
  
  // draw clock plate
  newCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a circle in SVG's namespace
  newCircle.setAttribute("id","center");
  newCircle.setAttribute("cx",x[0]);
  newCircle.setAttribute("cy",y[0]);
  newCircle.setAttribute("r","140");
  newCircle.setAttribute("fill","white");
  newCircle.setAttribute("stroke","black");
  newCircle.setAttribute("stroke-width","5");
  group.appendChild(newCircle);

  // draw hourHand
  this.generateHand(group,'hourHand');
  this.generateHand(group,'minuteHand');

  // draw center of the clock
  newCircle = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a circle in SVG's namespace
  newCircle.setAttribute("id","center");
  newCircle.setAttribute("cx",x[0]);
  newCircle.setAttribute("cy",y[0]);
  newCircle.setAttribute("r","5");
  newCircle.setAttribute("fill","red");
  newCircle.setAttribute("stroke","black");
  newCircle.setAttribute("stroke-width","5");
  group.appendChild(newCircle);
    
  
  for ( i=1; i <= 12 ; i++ ) 
  { newText = document.createElementNS("http://www.w3.org/2000/svg", 'text'); //Create a text in SVG's namespace
    newText.setAttribute("id","txt"+i);
    newText.setAttribute("x",x[i]);
    newText.setAttribute("y",y[i]);
    // newText.setAttribute("fill",clockFillColor);
    var textNode = document.createTextNode(i);
    newText.appendChild(textNode);
    group.appendChild(newText);
  }

  
  /* if ( !isTouchDevice() ) */
  { $("[id^=txt]").click ( function (event) {
       var time = $(this).attr('id').substring(3);
       if ( apextic.getActiveHand() == 'hour' )
       { 
         apextic.currentHour = parseInt(time);
         if ( apextic.currentHour == 12 ) { apextic.currentHour = 0; }
         if ( apextic.currentHour < apextic.window_base ) { apextic.currentHour = apextic.currentHour + 12; }

         if ( apextic.currentMinutes < 0 ) 
           { apextic.currentMinutes = 0; }
         if ( apextic.mode == 'PM' ) 
           { apextic.currentHour = apextic.currentHour + 12; }
         apextic.setHourHand();
         apextic.setActiveHand('minute');
       }
       else
       { apextic.currentMinutes = parseInt(time)*5;
         if ( apextic.currentMinutes == 60 ) { apextic.currentMinutes = 0; } 
         apextic.setMinuteHand();
         apextic.setActiveHand('hour');
       }
       apextic.setCurrentDigitalTime();
    } );
  }

},
ticShow : function ( item, window_base, time_format )
{ 
  // store parameters
  this.clockItem = item;
  this.window_base = window_base;
  this.time_format = time_format;
      
  // show shaded background
  $(this.ticPageBackground()).show();

  // if control exists then show it else build it
  if ( this.ticExists() )
  { this.showControl(item); }
  else
  { this.buildControl(item); }
  
  // make hands invisible
  this.hideHands();
  
  // initialize time
  this.currentHour = null;
  this.currentMinutes = null;
  this.updateDigitalTime(this.currentHour,this.currentMinutes);
    
  // set hourhand as active
  this.setActiveHand('hour');
},

/* Apex plugin function */
doIt : function() 
{
    var time;
    var daThis = this;
    
    var vElementsArray = daThis.affectedElements;
    var itemId = '#'+$(vElementsArray).attr('id');

    var window_base = ( daThis.action.attribute01 ) ? daThis.action.attribute01 : 7;
    var time_format = ( daThis.action.attribute02 ) ? daThis.action.attribute02 : 'hh24:mi';
    apextic.logging    = ( daThis.action.attribute10 ) ? daThis.action.attribute10 : 0;
    // Logging
    apextic.debug('Function: Apex Touch Time Control');
    apextic.debug('Parameters: item ID     ='+itemId);
    apextic.debug('            window_base ='+window_base);
    apextic.debug('            time_format ='+time_format);

    apextic.ticShow( itemId, window_base, time_format );
}

}

