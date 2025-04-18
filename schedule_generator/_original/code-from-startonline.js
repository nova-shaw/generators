/**
 * This is the awful crap that runs the current clock timer in StartOnline, circa April 2025.
 * 
 * It starts at line 67 in `menu.htm`
 * which is loaded into an iframe in `index.htm`
 * (https://ochanoma-kyozai.net/NOVA/online/teaching/menu/index.htm)
 * like this:
 * 
 * <frameset rows="30px,*" frameborder="0">
 *   <frame src="menu.htm" id="menu" name="menu" noresize="noresize" scrolling="no" APPLICATION="yes" />
 *   <frame src="main.htm" id="main" name="main" noresize="noresize" scrolling="auto" />
 * </frameset>
 * 
 * Notice how the first and last time DO NOT MATCH... How is this resolved??
 * 
 * */


var schedule = new Array();

schedule.push("0:40"); // start
schedule.push("1:20");
schedule.push("1:30");
schedule.push("2:10");
schedule.push("2:20");
schedule.push("3:00");
schedule.push("3:40");
schedule.push("4:20");
schedule.push("4:30");
schedule.push("5:10");
schedule.push("5:20");
schedule.push("6:00");
schedule.push("6:10");
schedule.push("6:50");
schedule.push("7:00");
schedule.push("7:40");
schedule.push("7:50");
schedule.push("8:30");
schedule.push("8:40");
schedule.push("9:20");
schedule.push("9:30");
schedule.push("10:10");
schedule.push("10:20");
schedule.push("11:00");
schedule.push("11:10");
schedule.push("11:50");
schedule.push("12:00");
schedule.push("12:40");
schedule.push("12:50");
schedule.push("13:30");
schedule.push("13:40");
schedule.push("14:20");
schedule.push("14:30");
schedule.push("15:10"); // 20 minute interval
schedule.push("15:30");
schedule.push("16:10");
schedule.push("16:20");
schedule.push("17:00");
schedule.push("17:10");
schedule.push("17:50");
schedule.push("18:00");
schedule.push("18:40");
schedule.push("18:50");
schedule.push("19:30");
schedule.push("19:40");
schedule.push("20:20");
schedule.push("20:30");
schedule.push("21:10");
schedule.push("21:20");
schedule.push("22:00");
schedule.push("22:10");
schedule.push("22:50");
schedule.push("23:00");
schedule.push("23:40");
schedule.push("23:50");
schedule.push("0:30");

function countDown() {
var now = new Date();
var nextLesson = new Date();
now.getTime();

var timeloc = 0;
var isbreak = false;

for (var i = 0; i < schedule.length; i++) {
	var theTime = schedule[i].split(/\:/);
	var theHour = parseInt(theTime[0], 10);
	var theMin = parseInt(theTime[1], 10);
	nextLesson.setHours(theHour, theMin, 0);
	nextLesson.getTime();
	if (nextLesson > now) {
		timeloc = i;
		isbreak = i % 2 === 0;
		break;
	}
}
if (timeloc == 0) {
	nextLesson.setUTCDate(nextLesson.getUTCDate() + 1);
	nextLesson.setUTCHours(0, 0, 0);
}
var secLeft = Math.floor((nextLesson - now) / 1000);
var minLeft = Math.floor(secLeft / 60);
secLeft -= minLeft * 60;
var timeLeft = document.createTextNode(addZero(minLeft) + ":" + addZero(secLeft));
var clock = document.getElementById("clock");
clock.replaceChild(timeLeft, clock.lastChild);

/*
if(timeloc%2!=0){
isbreak = true;
}
*/

if (minLeft < 5) {
	if (isbreak) {
		clock.style.fontWeight = "normal";
		clock.style.color = "rgb(200,0,0)";
		if (minLeft < 1) {
			clock.style.fontWeight = "bold";
		}
	} else {
		clock.style.color = "rgb(200,100,0)";
		if (minLeft < 1) {
			clock.style.fontWeight = "bold";
		}
	}
} else if (minLeft < 23 && minLeft >= 21 && !isbreak) {
	//Half Cat Timings
	clock.style.color = "rgb(0,102,204)";
	if (minLeft < 22) {
		clock.style.fontWeight = "bold";
	}
} else {
	if (isbreak) {
		clock.style.fontWeight = "bold";
		clock.style.color = "rgb(0,140,0)";
	} else {
		clock.style.fontWeight = "normal";
		clock.style.color = "rgb(0,0,0)";
	}
}
}

function addZero(passedVal) {
var thisString = passedVal.toString();
if (passedVal < 10) {
	thisString = "0" + thisString;
}
return thisString;
}