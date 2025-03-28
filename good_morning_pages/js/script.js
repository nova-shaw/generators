/* ********************************************************************
19 June 2007 - This general script is designed to replace all previous versions of the script
********************************************************************/

/*
 * display.js is the new 'beut way of doing things and this is the closest thing we have to #include<filename>...
 * Note that we actually override some of the display.js functions below for compatibility's sake.
 */

var displayjs = window.location.href.toLowerCase().substr(0, window.location.href.toLowerCase().indexOf("online")) + "online/teaching/cgi-bin/display.js";
//var displayjs = window.location.href.toLowerCase().substr(0,window.location.href.toLowerCase().indexOf("online"))+"online/teaching/cgi-bin/displaytest.js";
document.write('<sc' + 'ript src="' + displayjs + '" type="text/javascript"></scr' + 'ipt>');


/* ---------------------------------------------------------------------
GLOBAL VARIABLES
--------------------------------------------------------------------- */
var STARTATNOVA = window.location.href.toLowerCase().substr(0, window.location.href.toLowerCase().indexOf("nova")) + "NOVA/";
STARTATNOVA = STARTATNOVA.replace(/^file:[^\/]+?(?=\w)/, "");
var LEFTPOS = -150;
var GOOUT = true;
var SIZE = 1;
var PREVIEWIX = -1;
var LEVEL;
var LEVELLABEL;
var LESNUM;
var ONLYPREVIEW = false;
var FORCEFILE = null;
var LANGUAGE = null;
var LESSONTYPE = null;
var FULLPATH = null;
var RELPATH = null;
var COLOURS = new Array('rgb(245,245,245)', 'rgb(185,255,200)', 'rgb(255,204,204)', 'rgb(255,249,157)', 'rgb(161,227,255)');
/*--------------------------------------------------------------------------
New GLOBAL variables to hold language/lesson specific tags and links
---------------------------------------------------------------------------*/
var MAINLANGPAGELINK = "";
var MAINLANGPAGETEXT = "";
var TYPEPAGELINK = "";
var TYPEPAGETEXT = "";
var CHANGEFONTSIZETEXT = "";
var OPENINGSEGUETEXT = "";
var CLOSINGSEGUETEXT = "";
var CLOSINGSEGUETEXTRECORDING = "No recording segue"
var CLOSINGSEGUETEXTMIC = "Mic control segue"
var PREVIEWMODETEXT = "";
var AIMSTEXT = "";
var MLTEXT = "";
var NFITEXT = "";
var DYKTEXT = "";
var ARTEXT = "";
var FCTEXT = "";
var AREA = "";
var LANGUAGESUFFIX = ""; //this variabable MUST be blank except for VIP, because it`s used to set the segue file name (and actually just VIP lessons calls a different segue file.
var DEFAULTSEGUELIST = new Array(
	'../segueMedia/opening.mp4'
);


if (typeof newShowMediaFlag == 'undefined') var newShowMediaFlag = false;

var WORLDSTATIONLEVELBREAKS = {
	french: {
		a: {
			book: 1,
			index: 0
		},
		b: {
			book: 1,
			index: 12
		},
		d: {
			book: 4,
			index: 0
		}
	},
	german: {
		a: {
			book: 1,
			index: 0
		},
		b: {
			book: 1,
			index: 12
		}
	},
	korean: {
		a: {
			book: 1,
			index: 0
		},
		b: {
			book: 2,
			index: 0
		},
		d: {
			book: 4,
			index: 0
		}
	},
	chinese: {
		a: {
			book: 1,
			index: 0
		},
		b: {
			book: 2,
			index: 0
		},
		d: {
			book: 4,
			index: 0
		}
	}
}


/* ---------------------------------------------------------------------
Stops RIGHT CLICK function. NB IE only.
--------------------------------------------------------------------- */


function noMenu() {
	event.cancelBubble = true;
	event.returnValue = false;
	return false;
}

//Only stop the rt-click functionality on the working booths
/*if (window.location.href.toLowerCase().indexOf("d:") != -1) {
	document.attachEvent('oncontextmenu', noMenu);
}*/

/*---------------------------------------------------------------------
Extract the language and lesson type - set the appropriate link tags
-----------------------------------------------------------------------*/
function extractLTYPE() {   //Extract the current language - always 2 directories beyond online

	// Rob var

	// var robCurrentURL = window.location.href.toLowerCase();

	// End of Rob var

	var stp = window.location.href.toLowerCase();
	var stparr = stp.split("/");
	var onlineloc = 0;
	for (var i = 0; i < stparr.length; i++) {
		if (stparr[i].toLowerCase().indexOf("online") != -1) {
			onlineloc = i;
			break;
		}
	}
	LANGUAGE = stparr[onlineloc + 2].toLowerCase();
	LESSONTYPE = stparr[onlineloc + 3].toLowerCase();
	if (LANGUAGE == "worldstation") {
		LANGUAGE = stparr[onlineloc + 3].toLowerCase();
		LESSONTYPE = "worldstation";
		//LESSONTYPE=stparr[onlineloc+4].toLowerCase();
		newShowMediaFlag = true;
	}
	//alert("lessontype = " + LESSONTYPE);

	// The media path will always be within a subdirectory named media under the language directory - within this in a directory
	// equivalent to the type of lesson being taught - lessons the odd one out needing a level reference
	FULLPATH = stp.substr(0, stp.indexOf(LANGUAGE)) + LANGUAGE + "/media/";
	RELPATH = "";
	for (var i = 0; i < stparr.length - onlineloc - 4; i++) {
		RELPATH += "../";
	}
	RELPATH += "media/";

	//This sets the string to parse equal to the last entry in the earlier split string
	stp = stparr[stparr.length - 1].split('.')[0];
	//alert("stp = " + stp);
	if (LANGUAGE == 'vip') {
		LANGUAGESUFFIX = stp.substr(0, 3);
	}
	switch (stp.charAt(0).toLowerCase()) {
		case 'a':
			if (LANGUAGE == "english" && stp.charAt(1) == "u") {
				LEVEL = "lessonspecial";
			}
			else {
				LEVEL = 'Alpha';
			}
			break;
		case 'b': LEVEL = 'Bravo'; break;
		case 'c':
			if ((LANGUAGE == "chinese") && (stp.charAt(1).toLowerCase() == "a")) {
				LEVEL = 'Cantonese'; break;
			}
			else {
				LEVEL = 'Charlie'; break;
			}
		//here put a demo check
		case 'd':
			if (/de\d{2}/.test(stp)) {
				var fullfilepath = window.location.href.toLowerCase();
				//console.log(fullfilepath+"gdfgdfgdfgfdgdfg");
				if (/demo_beg/.test(fullfilepath)) {
					LEVEL = "demo_beg";//josh2020 break
				}
				else if (/demo_int/.test(fullfilepath)) {
					LEVEL = "demo_int";
				}
				else if (/demo_mas/.test(fullfilepath)) {
					LEVEL = "demo_mas";
				}
				else {
					LEVEL = "demo_adv"; //josh2020
				}
			}
			else if (LESSONTYPE == "newdelta" && LANGUAGE == "spanish") {
				LEVEL = "newdelta";
			}
			else {
				LEVEL = 'Delta';
			}
			break;
		case 'e': LEVEL = 'Echo'; break;
		case 'f':
			if ((LANGUAGE == "korean") && (stp.charAt(1).toLowerCase() == "o")) {
				LEVEL = 'Food';
				break;
			}
			else if ((LANGUAGE == "italian") && (stp.charAt(2).toLowerCase() == "o")) {
				LEVEL = 'food';
				break;
			}
			else {
				LEVEL = 'Fox'; break;
			}
		case 'g':
			if (stp.charAt(1) == "e") {
				LEVEL = "welcome"; break;
			}
			else {
				LEVEL = 'Golf'; break;
			}
		case 'h':
			if (LANGUAGE == "korean") {
				LEVEL = 'HL';
				LESSONTYPE = LEVEL;
				break;
			}
			else if (LANGUAGE == "english" && stp.charAt(1).toLowerCase() == "a") {
				LEVEL = "lessonspecial";
				break;
			}
			else {
				LEVEL = 'Hotel'; break;
			}
		case 'n':
			if (stp.charAt(1) == 'f') {
				LEVEL = 'Fox'; break;
			}
			if (stp.charAt(1) == 'g') {
				LEVEL = 'Golf'; break;
			}
			if (stp.charAt(1) == 'a') {
				LEVEL = 'nativecounselling'; break;
			}
			if (stp.charAt(1) == 'o') {
				LEVEL = 'novascore';
				break;
			}
			if (stp.charAt(1) == "k") {
				//for nova kids world
				LEVEL = "nkw";
				break;
			}
		case 's':
			if (LANGUAGE == "chinese") {
				LEVEL = 'SuperAlpha';
			}
			else if (LANGUAGE == "korean") {
				LEVEL = 'stl';
			}
			else if (LANGUAGE == "spanish") {
				LEVEL = "specialm2m";
			}
			break;
		case 'o':
			if (LANGUAGE == "chinese") {
				LEVEL = 'travel';
			}
			else {
				if (stp.charAt(1) == "l") {
					sublevel = stparr[stparr.length - 2];
					if (/beg/.test(sublevel)) {
						LEVEL = "olympic_beg";
					}
					else if (/int/.test(sublevel)) {
						LEVEL = "olympic_int";
					}
					else {
						LEVEL = "olympic_adv";
					}
				}
				else {
					LEVEL = 'ochacafe';
				}
			}
			break;
		case 'l': LEVEL = 'CAT'; break;
		case 'j': LEVEL = 'jlpt'; break;
		case 'x': LEVEL = 'CAT'; break;
		case 'w':
			if (LANGUAGE == "spanish") {
				LEVEL = 'weak point';
			}
			else {
				LEVEL = 'worldcup';
			}
			break;
		case 'm': LEVEL = 'management'; break;
		case 'r': LEVEL = 'restaurant'; break;
		case 't':
			if (LANGUAGE == "korean" && stp.charAt(1) == "o") {
				LEVEL = "topik";
			}
			else {
				LEVEL = 'travel';
			}
			/*
			case 'z':
				if (stp.charAt(1) == "1") {
					LEVEL = 'world_tour_beginner';
				} else  {
					LEVEL = 'world_tour_intermediate';
				}
				*/
			break;

			if (LANGUAGE == "chinese" && stp.charAt(10) < 3) {
				LEVEL = 'SuperAlpha';
				LEVEL = 'travel';
			}
			else {
				LEVEL = 'travel';
			}

			break;
		case '1': LEVEL = 'Level 1'; break;
		case '2': LEVEL = 'Level 2'; break;
		case '3': LEVEL = 'Level 3'; break;
		case '4': LEVEL = 'Level 4'; break;
		//begin STV edit (07/05/2014) below this line to enable media display for summer, winter, fall zlessons
		case '5':
			if (stp.charAt(1).toLowerCase() == "a") {
				LEVEL = '5a';
			}
			else if (stp.charAt(1).toLowerCase() == "b") {
				LEVEL = '5b';
			}
			else if (stp.charAt(1).toLowerCase() == "c") {
				LEVEL = '5c';
			}
			else if (stp.charAt(1).toLowerCase() == "d") {
				LEVEL = '5d';
			}
			else {
				LEVEL = 'Level 5';
			}
			break;
		case '6':
			if (stp.charAt(1).toLowerCase() == "a") {
				LEVEL = '6a';
			}
			else if (stp.charAt(1).toLowerCase() == "b") {
				LEVEL = '6b';
			}
			else if (stp.charAt(1).toLowerCase() == "c") {
				LEVEL = '6c';
			}
			else if (stp.charAt(1).toLowerCase() == "d") {
				LEVEL = '6d';
			}
			else {
				LEVEL = 'Level 6';
			}
			break;
		case '7':
			if (stp.charAt(1).toLowerCase() == "a") {
				LEVEL = '7a';
			}
			else if (stp.charAt(1).toLowerCase() == "b") {
				LEVEL = '7b';
			}
			else if (stp.charAt(1).toLowerCase() == "c") {
				LEVEL = '7c';
			}
			else if (stp.charAt(1).toLowerCase() == "d") {
				LEVEL = '7d';
			}
			else {
				LEVEL = 'Level 7';
			}
			break;
		case '8':
			if (stp.charAt(1).toLowerCase() == "a") {
				LEVEL = '8a';
			}
			else if (stp.charAt(1).toLowerCase() == "b") {
				LEVEL = '8b';
			}
			else if (stp.charAt(1).toLowerCase() == "c") {
				LEVEL = '8c';
			}
			else if (stp.charAt(1).toLowerCase() == "d") {
				LEVEL = '8d';
			}
			else {
				LEVEL = 'Level 8';
			}
			break;
		case '9':
			if (stp.charAt(1).toLowerCase() == "a") {
				LEVEL = '9a';
			}
			else if (stp.charAt(1).toLowerCase() == "b") {
				LEVEL = '9b';
			}
			else if (stp.charAt(1).toLowerCase() == "c") {
				LEVEL = '9c';
			}
			else if (stp.charAt(1).toLowerCase() == "d") {
				LEVEL = '9d';
			}
			else {
				LEVEL = 'Level 9';
			}
			break;
		/*end STV edit above this line; commented out original code below
		case '5': LEVEL = '5b'; break;
		case '6': LEVEL = '6b'; break;
		case '7': LEVEL = '7b'; break;
		case '8': LEVEL = '8b'; break;
		case '9': LEVEL = '9b'; break;*/
		default: LEVEL = LESSONTYPE; break;
	}

	if (LANGUAGE == "vip") {
		LEVEL = "vip";
	}

	LEVELLABEL = LEVEL;
	if (LEVELLABEL == ('restaurant')) {
		LESSONTYPE = 'restaurant';
	}
	if (LEVELLABEL == ('management')) {
		LESSONTYPE = 'management';
	}
	if (LEVELLABEL == ('nativecounselling')) {
		LESSONTYPE = 'nativecounselling';
	}
	// Finish
	switch (LESSONTYPE) {
		case "newlesson":
			LEVEL = "New" + LEVEL;
			if (stp.substr(1, 2) == "00") {
				LEVEL = "emer";
			}
			LESNUM = stp.toUpperCase();
			break;
		case "lessonsjh":
			LEVEL = LEVEL + "jh";
			if (stp.substr(1, 2) == "00") {
				LEVEL = "emer";
			}
			LESNUM = stp.toUpperCase();
			break;
		case "lesson":
			if (stp.substr(1, 2) == "00") {
				LEVEL = "emer";
			}
			LESNUM = stp.toUpperCase();
			break;
		case "demo":
			LESNUM = stp.toUpperCase();
			break;
		case "demo2016":
			LESNUM = stp.toUpperCase();
			break;
		default:
			LEVEL = LESSONTYPE;
			LESNUM = stp;
			break;
	}

	// Begin Rob edit: trying to add a new lesson type

	// if (robCurrentURL.search("IT0001.htm")!=0){
	// 	LANGUAGE = "italian";
	//	LEVEL = "IT0001";
	// }

	// Finish Rob edit
}

//Perform the extraction upon file loading
extractLTYPE();

//Set the language variables accordingly
function setLanguageVariables() {
	switch (LANGUAGE) {
		// ENGLISH MENUS
		case "english":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "newlesson":
					MAINLANGPAGETEXT = "English New Lessons";
					TYPEPAGETEXT = "English " + LEVELLABEL;
					break;
				case "lessonsjh":
					MAINLANGPAGETEXT = "English JH Lessons";
					TYPEPAGETEXT = "English JH " + LEVELLABEL;
					break;
				case "lesson":
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGETEXT = "English " + LEVELLABEL;
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "edemostart.htm";
					TYPEPAGETEXT = "Regular Demo";
					break;
				case "travel":
					MAINLANGPAGELINK = "../../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "../index.htm";
					TYPEPAGETEXT = "Travel Lessons";
					break;
				case "ochacafe":
					MAINLANGPAGELINK = "../../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "../ochacafe.htm";
					TYPEPAGETEXT = "Ocha Cafe";
					break;
				case "lessonspecial":
					MAINLANGPAGELINK = "../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "index.htm";
					TYPEPAGETEXT = "Special Lessons";
					break;
				case "nativecounselling":
					MAINLANGPAGELINK = "../../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "../ecatstart.htm";
					TYPEPAGETEXT = "CAT Menu";
					break;
				case "toeic":
					MAINLANGPAGELINK = "../../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "../toeic.htm";
					TYPEPAGETEXT = "TOEIC 2011";
					break;
				case "olympic_beg":
				case "olympic_int":
				case "olympic_adv":
				case "olympic":
					MAINLANGPAGELINK = "../../indexe.htm";
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGELINK = "../olympicmenu.htm";
					TYPEPAGETEXT = "Olympic Menu";
					break;
				default:
					MAINLANGPAGETEXT = "English Lessons";
					TYPEPAGETEXT = "English " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "Change font size";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Closing Segue";

			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// CHINESE MENUS
		case "chinese":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "newlesson":
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGETEXT = "汉语 " + LEVELLABEL;
					break;
				case "lesson":
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGETEXT = "汉语 " + LEVELLABEL;
					break;
				case "demo":
					MAINLANGPAGELINK = "../../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "../cdemostart.htm";
					TYPEPAGETEXT = "示范课";
					break;
				case "ochacafe":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "ochacafe.htm";
					TYPEPAGETEXT = "お茶 Cafe";
					break;
				case "hstravel":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "hstravel.htm";
					TYPEPAGETEXT = "Homestay Travel";
					break;
				case "nativecounselling":
					MAINLANGPAGELINK = "../../indexc.htm";
					MAINLANGPAGETEXT = "汉语主页";
					TYPEPAGELINK = "../ccatstart.htm";
					TYPEPAGETEXT = "汉语CAT";
					break;
				case "management":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "managementmenu.htm";
					TYPEPAGETEXT = "Management Staff Lessons";
					break;
				case "restaurant":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "restaurantmenu.htm";
					TYPEPAGETEXT = "Restaurant Staff";
					break;
				case "kentei":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "kenteimain.htm";
					TYPEPAGETEXT = "Kentei Menu";
					break;
				//was just travel added extra part
				case "travel" || "SuperAlpha":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "travelmenu.htm";
					TYPEPAGETEXT = "Travel Menu";
					break;
				case "cantonese":
					MAINLANGPAGELINK = "../indexc.htm";
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGELINK = "cantonesemenu.htm";
					TYPEPAGETEXT = "Cantonese Menu";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexc.htm";
				default:
					MAINLANGPAGETEXT = "汉语课";
					TYPEPAGETEXT = "汉语 " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "改变字体大小";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "结束画面";
			PREVIEWMODETEXT = '预览功能已启动<br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; 学生看到的画面不变。 &nbsp;</span>';
			AIMSTEXT = "目的";
			MLTEXT = "课文要点";
			NFITEXT = "给老师的建议";
			DYKTEXT = "你知道吗？";
			ARTEXT = "补充内容";
			FCTEXT = "补充内容";
			break;
		// FRENCH MENUS
		case "french":
			MAINLANGPAGELINK = "lesson.htm";
			//if ((LESNUM.charAt(0) == "1")||(LESNUM.charAt(0) == "2")) {
			//	TYPEPAGELINK = "Level " + LESNUM.charAt(0) + ".htm";
			//}
			//else {
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			//	}
			switch (LESSONTYPE) {
				case "lesson":
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGETEXT = LEVELLABEL + " français";
					break;
				case "ochacafe":
					MAINLANGPAGELINK = "../indexf.htm";
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGELINK = "ochacafe.htm";
					TYPEPAGETEXT = "Ocha Cafe";
					break;
				case "worldcup":
					MAINLANGPAGELINK = "../indexf.htm";
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGELINK = "../../menu/main.htm";
					TYPEPAGETEXT = "Online Resources";
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexf.htm";
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGELINK = "fdemostart.htm";
					TYPEPAGETEXT = "Demo Menu";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexf.htm";
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGELINK = "travelmenu.htm";
					TYPEPAGETEXT = "Travel Menu";
					break;
				case "wpc":
					MAINLANGPAGELINK = "../../../indexf.htm";
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGELINK = "../wpc.htm";
					TYPEPAGETEXT = "Weak Point Menu";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexf.htm";
				default:
					MAINLANGPAGETEXT = "Les leçons";
					TYPEPAGETEXT = LEVELLABEL + " français";
					break;
			}
			CHANGEFONTSIZETEXT = "Changer la taille des caractères";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Segue de fin";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// GERMAN MENUS
		case "german":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.toLowerCase().charAt(0) + (LESNUM.toLowerCase().charAt(0) == 'n' ?
				LESNUM.toLowerCase().charAt(1) : '') + ".htm";
			switch (LESSONTYPE) {
				case "lesson":
					MAINLANGPAGETEXT = "Lektionen";
					TYPEPAGETEXT = "Deutsche " + LEVELLABEL;
					break;
				case "worldcup":
					MAINLANGPAGELINK = "../indexg.htm"
					MAINLANGPAGETEXT = "Lektionen";
					TYPEPAGELINK = "../../menu/main.htm";
					TYPEPAGETEXT = "Online Resources";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexg.htm";
					MAINLANGPAGETEXT = "Lektionen";
					TYPEPAGELINK = "travelmenu.html";
					TYPEPAGETEXT = "Travel Menu";
					break;
				case "demo":
					MAINLANGPAGELINK = "../../indexg.htm";
					MAINLANGPAGETEXT = "Lektionen";
					TYPEPAGELINK = "../gdemostart.htm";
					TYPEPAGETEXT = "Demo Lessons";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexg.htm";
				default:
					MAINLANGPAGETEXT = "Lektionen";
					TYPEPAGETEXT = "Deutsche " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "Schriftgröße ändern";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Auf Wiedersehen";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// ITALIAN MENUS
		case "italian":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "newlesson":
					MAINLANGPAGETEXT = "Nuove Lezioni";
					TYPEPAGETEXT = "Italiano " + LEVELLABEL;
					break;
				case "lesson":
					MAINLANGPAGETEXT = "Lezioni";
					TYPEPAGETEXT = LEVELLABEL + " Italiano";
					break;
				case "worldcup":
					MAINLANGPAGELINK = "../indexi.htm"
					MAINLANGPAGETEXT = "Lezioni Italiano";
					TYPEPAGELINK = "../../menu/main.htm";
					TYPEPAGETEXT = "Online Resources";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexi.htm";
					MAINLANGPAGETEXT = "Lezioni Italiano";
					TYPEPAGELINK = "travelmenu.htm";
					TYPEPAGETEXT = "Lezioni per viaggiare";
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexi.htm";
					MAINLANGPAGETEXT = "Lezioni Italiano";
					TYPEPAGELINK = "idemostart.htm";
					TYPEPAGETEXT = "Demo Lessons";
					break;
				case "demo2016":
					MAINLANGPAGELINK = "../../indexi.htm";
					MAINLANGPAGETEXT = "Lezioni Italiano";
					TYPEPAGELINK = "../demomenutest.htm";
					TYPEPAGETEXT = "Demo Lessons";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexi.htm";
				default:
					MAINLANGPAGETEXT = "Lezioni";
					TYPEPAGETEXT = "Italiano " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "Grandezza dei caratteri";
			OPENINGSEGUETEXT = "Segue di apertura";
			CLOSINGSEGUETEXT = "Segue di chiusura";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// SPANISH MENUS
		case "spanish":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "newlesson":
					MAINLANGPAGETEXT = "Lecciones";
					TYPEPAGETEXT = "Nivel " + LEVELLABEL + " de español";
					break;
				case "lesson":
					MAINLANGPAGETEXT = "Lecciones";
					TYPEPAGETEXT = LEVELLABEL + " de español";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexs.htm";
					TYPEPAGELINK = "travel.htm";
					MAINLANGPAGETEXT = "Página principal de español";
					TYPEPAGETEXT = LEVELLABEL + " de español";
					break;
				case "newdelta":
					MAINLANGPAGELINK = "../indexs.htm";
					TYPEPAGELINK = "d.htm";
					MAINLANGPAGETEXT = "Página principal de español";
					TYPEPAGETEXT = "Delta de español";
					break;
				case "wpc":
					MAINLANGPAGELINK = "../../../indexs.htm";
					TYPEPAGELINK = "../wpc.htm";
					MAINLANGPAGETEXT = "Página principal de español";
					TYPEPAGETEXT = "Weak point menu";
					break;
				case "demo":
					MAINLANGPAGELINK = "../../indexs.htm";
					TYPEPAGELINK = "../sdemostart.htm";
					MAINLANGPAGETEXT = "Página principal de español";
					TYPEPAGETEXT = "Demo Lesson";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexs.htm";
				default:
					MAINLANGPAGETEXT = "Lecciones";
					TYPEPAGETEXT = LEVELLABEL + " de español";
					break;
			}
			CHANGEFONTSIZETEXT = "Cambia el tamaño de la letra";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Página de cierre";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// VIP MENUS
		case "vip":
			AREA = LANGUAGE;
			MAINLANGPAGELINK = "../../menu/main.htm";
			MAINLANGPAGETEXT = "MM Menu Home";
			TYPEPAGELINK = "../VIPmenu.htm";
			TYPEPAGETEXT = "VIP Home";
			CHANGEFONTSIZETEXT = "Change font size";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Closing Segue";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// JPN MENUS
		case "jpn":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "lesson":
					MAINLANGPAGETEXT = "日本語のレッスン";
					TYPEPAGETEXT = "日本語 " + LEVELLABEL;
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexj.htm";
					MAINLANGPAGETEXT = "日本語のレッスン";
					TYPEPAGELINK = "jdemostart.htm";
					TYPEPAGETEXT = "日本語 Demo";
					break;
				case "ochacafe":
					MAINLANGPAGELINK = "../../indexj.htm";
					MAINLANGPAGETEXT = "日本語のレッスン";
					TYPEPAGELINK = "../ochacafe.htm";
					TYPEPAGETEXT = "Ocha Cafe";
					break;
				case "jlpt":
					MAINLANGPAGELINK = "../indexj.htm";
					MAINLANGPAGETEXT = "日本語のレッスン";
					TYPEPAGELINK = "jlpt.htm";
					TYPEPAGETEXT = "JLPTホーム";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexj.htm";
				default:
					MAINLANGPAGETEXT = "日本語のレッスン";
					TYPEPAGETEXT = "日本語 " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "Change font size";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Closing Segue";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		// KOREAN MENUS
		case "korean":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "lesson":
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGETEXT = "한국어 " + LEVELLABEL;
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "kdemostart.htm";
					TYPEPAGETEXT = "한국어 Demo";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "travelmenu.htm";
					TYPEPAGETEXT = "Travel Lessons";
					break;
				case "stl":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "stlmenu.htm";
					TYPEPAGETEXT = "Seoul Menu";
					break;
				case "hangul":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "hangulmenu.htm";
					TYPEPAGETEXT = "Hangul Menu";
					break;
				case "precourse":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "premenu.htm";
					TYPEPAGETEXT = "Pre Course";
					break;
				case "HL":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "HangulMenu.htm";
					TYPEPAGETEXT = "Hangul Menu";
					break;
				case "food":
					MAINLANGPAGELINK = "../indexk.htm";
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGELINK = "foodmenu.htm";
					TYPEPAGETEXT = "Food Menu";
					break;
				case "nativecounselling":
					MAINLANGPAGELINK = "../../indexk.htm";
					MAINLANGPAGETEXT = "한국어 Online";
					TYPEPAGELINK = "../kcatstart.htm";
					TYPEPAGETEXT = "한국어 CAT ";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexk.htm";
				default:
					MAINLANGPAGETEXT = "한국어 레슨";
					TYPEPAGETEXT = "한국어 " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "글자 크기 바꾸기";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Closing Segue";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "학습목표";
			MLTEXT = "기본문형";
			NFITEXT = "공지사항";
			DYKTEXT = "알고 있나요?";
			ARTEXT = "보충내용";
			FCTEXT = "Flashcards & Sounds";
			break;
		// PORTUGUESE MENUS
		case "portuguese":
			MAINLANGPAGELINK = "lesson.htm";
			TYPEPAGELINK = LESNUM.charAt(0) + ".htm";
			switch (LESSONTYPE) {
				case "lesson":
					MAINLANGPAGETEXT = "Lições TOP";
					TYPEPAGETEXT = "Português " + LEVELLABEL;
					break;
				case "demo":
					MAINLANGPAGELINK = "../indexp.htm";
					MAINLANGPAGETEXT = "Portuguese Lessons";
					TYPEPAGELINK = "pdemostart.htm";
					TYPEPAGETEXT = "Portuguese Demo";
					break;
				case "travel":
					MAINLANGPAGELINK = "../indexp.htm";
					MAINLANGPAGETEXT = "Portuguese Lessons";
					TYPEPAGELINK = "travelmenu.htm";
					TYPEPAGETEXT = "Português Travel";
					break;
				case "worldstation":
					MAINLANGPAGELINK = "../indexp.htm";
				default:
					MAINLANGPAGETEXT = "Portuguese Lessons";
					TYPEPAGETEXT = "Português " + LEVELLABEL;
					break;
			}
			CHANGEFONTSIZETEXT = "Change font size";
			OPENINGSEGUETEXT = "Opening Segue";
			CLOSINGSEGUETEXT = "Closing Segue";
			PREVIEWMODETEXT = 'Preview mode is <span style="color:rgb(255,0,0)">ON</span><br /><span style="color: rgb(0,0,0); font-size: 9pt; font-weight: normal;"> &nbsp; The student display window will not change. &nbsp;</span>';
			AIMSTEXT = "Aims";
			MLTEXT = "Main Language";
			NFITEXT = "Notes for Instructors";
			DYKTEXT = "Did you know?";
			ARTEXT = "Additional Resources";
			FCTEXT = "Flashcards & Sounds";
			break;
		default:
	}
}

setLanguageVariables();


/****************************************
Make DISPLAYWINDOW
****************************************/
/*var SLIDEINT = null;
var mPlayer;
var SLIDERAREA;
var TIMER;
var THISSTATUS;
var ISPLAYING = false;

var ORIGIONALY = 0;
var CURRENTHEIGHT = 240;

var SELECTED  = false;
var CHANGETO = 0;
var MOVEINT = null;
var PERCDIF;
var MOUSEYPOS = 0;
var MOUSEMOVE = null;
var MOUSEUP = null;


function initDisplayWindow() {
	self.resizeTo(704,480);
	self.moveTo(0, 0);

	THISSTATUS = document.getElementById('status');
	mPlayer = document.getElementById('mediaPlayer');
	SLIDERAREA = document.getElementById('sliderArea');
	TIMER = document.getElementById('time');
}
*/
var DISPLAYWINDOW = null;
var IMAGEINDEX = -1;
var PREVIEW_EXISTS = 0;
var mediaArray = new Array();
if (parent.MAINDISPLAY == null || parent.MAINDISPLAY.closed) {
	parent.openDisplay();
}
DISPLAYWINDOW = parent.MAINDISPLAY;

function loadMediaFile(file) {

	var pathPrefix = window.location.href.substr(0, window.location.href.toLowerCase().indexOf("online/")) + "online/";
	var mediaIcon = document.getElementById('previewMediaIcon');
	//alert(PREVIEW_EXISTS);
	if (PREVIEW_EXISTS == 1) {
		document.getElementById('previewPic').src = file.path + file.filename + '.jpg';
		document.getElementById('previewPic').alt = file.description;
		document.getElementById('previewFilename').innerHTML = unescape(file.filename);
		switch (file.extension.toLowerCase()) {
			case 'mp3':
				mediaIcon.src = pathPrefix + 'teaching/media/sound.gif';
				mediaIcon.style.display = 'block';
				break;
			case 'mpg':
				mediaIcon.src = pathPrefix + 'teaching/media/movie.gif';
				mediaIcon.style.display = 'block';
				break;
			default:
				mediaIcon.style.display = 'none';
		}
		if (document.getElementById('previewCheckBox') && document.getElementById('previewCheckBox').status) {
			return;
		}
	}

	var fullMediaFilename = file.path;
	if (file.path.substr(file.path.length - 1) != "/") {
		fullMediaFilename += "/";
	}
	fullMediaFilename += file.filename + "." + file.extension;
	showMedia(fullMediaFilename);
}

var TEMPTIME;
var STOPINT = null;

function loadFirstFrame() {
	DISPLAYWINDOW.playerAction('play');
	if (STOPINT) {
		clearInterval(STOPINT);
	}
	TEMPTIME = new Date();
	STOPINT = setInterval("stopInt();", 50);
}

function stopInt() {
	var now = new Date();
	if (DISPLAYWINDOW.document.getElementById('mediaPlayer').playState == 3 && (now - TEMPTIME) > 100) {
		DISPLAYWINDOW.playerAction('stop');
		clearInterval(STOPINT);
		STOPINT = null;
	}
}

function openDisplayWindow() {
	parent.openDisplay();
	DISPLAYWINDOW = parent.MAINDISPLAY;
}

function showMedia(fname, autoplay) {
  /** This showMedia function doesn't see to be called on much now...  */
	//alert("script.js showmedia called with fname: " + fname);
	// Get the filenames directory and extension
	//alert("fullpath: " + FULLPATH);
	//alert("levellable: " + LEVELLABEL);
	//var pathPrefix = FULLPATH + LEVELLABEL + '/'; // alert("showMedia's pathPrefix var is: " + pathPrefix); // THIS IS WORKING FOR DIPLOMAT
	var pathPrefix = window.location.href.substr(0, window.location.href.lastIndexOf("/") + 1); //alert("scriptのshowMedia's pathPrefix var is: " + pathPrefix);
	//var ext = fname.substr(fname.lastIndexOf(".") + 1);
	var ext = fname.substr(fname.lastIndexOf(".") + 1);
	//alert(ext);

	if (fname.substr(0, 7) == "file://") {
		pathPrefix = "";
	}

	// Combine the filename with the path and deal with relative parent paths.
	// e.g. convert e:/online/teaching/../tools to e:/online/tools
	if (fname.substr(0, 3) == "../") {
		var numDirs = (fname.lastIndexOf("../") + 3) / 3;

		while (numDirs--) {
			//	pathPrefix = FULLPATH + LEVELLABEL + '/'; // disabling original, as this was borked... why was it changed to this?? SV
			pathPrefix = pathPrefix.substr(0, pathPrefix.substr(0, pathPrefix.length - 1).lastIndexOf("/") + 1);

		}
		fname = fname.substr(fname.lastIndexOf("../") + 3); // this is finding the beginning of the specified three chars, then omitting them
	}
	openDisplayWindow();
	// Closing lesson segues write the unit number to the screen so we need to clear this first.
	DISPLAYWINDOW.document.getElementById('numdisplay').innerHTML = "";

	switch (ext) {
		case "wav": //added 3/24/2015 by SV
			alert("Error Code 32");
			break;
		case "mp3":
			// Load the MP3 with media player but display an image.
			//showPreview(extLessFname);
			DISPLAYWINDOW.scrollTo(0, 0);
			DISPLAYWINDOW.document.getElementById('controlplacer').style.top = '1%';
			DISPLAYWINDOW.document.getElementById('mediaPlayer').URL = pathPrefix + fname;
			DISPLAYWINDOW.document.getElementById('status').innerHTML = 'Loaded<br />&nbsp;';
			// Listening tasks have an associated JPG file. Display it.
			DISPLAYWINDOW.document.getElementById('picture').src = pathPrefix + fname.substr(0, fname.toLowerCase().lastIndexOf("mp3")) + "jpg";
			break;
		case "mpg":
			// Load and display an MPG video with media player
			DISPLAYWINDOW.scrollTo(0, 0);
			DISPLAYWINDOW.document.getElementById('controlplacer').style.top = '1%';
			DISPLAYWINDOW.document.getElementById('mediaPlayer').URL = pathPrefix + fname;
			DISPLAYWINDOW.document.getElementById('status').innerHTML = 'Loaded<br />&nbsp;';
			DISPLAYWINDOW.document.getElementById('picture').src = pathPrefix + fname.substr(0, fname.toLowerCase().lastIndexOf("mpg")) + "jpg";
			// Edited 2009/5/21 by GN.
			// For new mpg closing segues.
			if (document.getElementById('preview')) {
				var sam = (fname.substr(0, fname.toLowerCase().lastIndexOf("mpg")) + "jpg");
				document.getElementById('preview').src = pathPrefix + sam;
			}
			//loadFirstFrame();
			DISPLAYWINDOW.playerAction('play');
			break;
		case "avi":
			// Load and display an avi video with media player
			DISPLAYWINDOW.scrollTo(0, 780);
			DISPLAYWINDOW.document.getElementById('controlplacer').style.top = '130%';
			DISPLAYWINDOW.document.getElementById('mediaPlayer').URL = pathPrefix + fname;
			DISPLAYWINDOW.document.getElementById('status').innerHTML = 'Loaded<br />&nbsp;';
			loadFirstFrame();
			break;
		case "wmv":
			// Load and display a wmv video with media player
			DISPLAYWINDOW.scrollTo(0, 0);
			DISPLAYWINDOW.document.getElementById('controlplacer').style.top = '1%';
			DISPLAYWINDOW.document.getElementById('mediaPlayer').URL = pathPrefix + fname;
			DISPLAYWINDOW.document.getElementById('status').innerHTML = 'Loaded<br />&nbsp;';
			DISPLAYWINDOW.document.getElementById('picture').src = pathPrefix + fname.substr(0, fname.toLowerCase().lastIndexOf("wmv")) + "jpg";
			//alert(pathPrefix + fname.substr(0,fname.toLowerCase().lastIndexOf("wmv"))+"jpg");
			//loadFirstFrame();
			DISPLAYWINDOW.playerAction('stop');
			break;
		default:
			alert("Unknown file extension '" + ext + "' in file '" + fname + "' when trying to display resource.");
			break;
		// fall through as an image.
		case "jpg":
		case "gif":
		case "png":
			// Display an image and hide media player controls.
			DISPLAYWINDOW.scrollTo(0, 0);
			DISPLAYWINDOW.document.getElementById('controlplacer').style.top = '130%';
			if (!ONLYPREVIEW) {
				DISPLAYWINDOW.document.getElementById('picture').src = pathPrefix + fname; // alert("src=" + pathPrefix + fname);
				DISPLAYWINDOW.playerAction('stop');
			}
			if (document.getElementById('preview')) { // in other words, check for if the lesson utilizes preview functionality
				//alert("preview being overwritten to: " + pathPrefix + fname);
				document.getElementById('preview').src = pathPrefix + fname;
			}
			break;
	}
}



/******************************************
END
******************************************/

/**
 * This function is a convenience wrapper around newShowMedia(/path/to/image)
 * for the case when the media we're loading is the same as the src attribute
 * of the ImageLink.
 *
 * What was previously written as
 *
 * 	<img class="BigImageLink" src="../../media/special/meet_the_teacher/Tasmin_Emily-007.jpg"
 *		onclick="javascript:loadMedia('/meet_the_teacher/Tasmin_Emily-007.jpg')" />
 *
 * can now be shortened to
 *
 * 	<img class="BigImageLink" src="../../media/special/meet_the_teacher/Tasmin_Emily-007.jpg"
 *		onclick="showSrcMedia()" />
 *
 * because what's the point of specifying two different paths to the same image?
 *
 * Calls `newShowMedia' after doing some IE-11-compatible event parsing.
 *
 * @param {string} transition the optional scene to transition to.
 * @returns
 */
window.DEFAULT_TRANSITION = window.DEFAULT_TRANSITION || false;

function showSrcMedia(transition = DEFAULT_TRANSITION) {
	// window.event is supposed to be deprecated so this may end up breaking one day.
	// https://github.com/mdn/content/issues/21848
	return newShowMedia(event.target.src, true, transition);
}

function loadImageBg(url, transition) {
	if(!parent.d) return;
	return parent.d.loadImageBg(new URL(url, document.baseURI).href, transition);
}

function loadVideoBg(url, transition) {
	if(!parent.d) return;
	return parent.d.loadVideoBg(new URL(url, document.baseURI).href, transition);
}

function setScene(sceneName) {
	if(!parent.d) return;
	return parent.d.setScene(sceneName);
}

function loadMedia(name, autoplay, transition = DEFAULT_TRANSITION) {
	//alert("script.jsのloadmedia called with "+ name);//alert("1) name = " + name);
	//This method has a logical error.  An alert is not created for bad path or file names, only null names or when 'name' does not match an entry in PREVIEW.
	//PREVIEW may contain a bad path or filename and still correctly match with 'name' and therefore not generate an alert when showing an invalid image.
	if (!name) {
		//alert("Invalid filename '" + name + "' - Please inform development.");
		showPreview("blank.jpg");
		return false;
	}

	//alert("2) name = " + name);
	// Display the preview (if its a previewable picture)
	if (name.indexOf("message") == -1) {
		for (var i = 0; i < PREVIEWS.length; i++) {
			if (PREVIEWS[i].filename == name) {
				PREVIEWIX = i;
				//alert("showPreview being called with " + name);
				showPreview(name); // SAM: check out showPreview(); seems to be working correctly then overwritten
				//if ((!ONLYPREVIEW)||(name.indexOf("message") == -1)) {
				if ((!ONLYPREVIEW) && (name.indexOf("message") == -1)) {
					//alert("showmedia being called with: " + PREVIEWS[i].filename);
					//showMedia(PREVIEWS[i].media_filename);
					showMedia(PREVIEWS[i].filename, autoplay, transition);
				}
				return;
			}

		}
	}
	else {
		//alert("else'd");
		showMedia(name, autoplay, transition);
		return;
	}
	//alert("loadMedia called but preview not found for file '" + name + "'");
	//alert("fell through; showmedia being called with " + name);
	showMedia(name, autoplay, transition);
}

function loadVideo(name, transition = DEFAULT_TRANSITION) {
	return loadMedia(name, false, transition);
}

function playVideo(name, transition = DEFAULT_TRANSITION) {
	return loadMedia(name, true, transition);
}

function loadAudio(name, transition = DEFAULT_TRANSITION) {
	return loadMedia(name, false, transition);
}

function playAudio(name, transition = DEFAULT_TRANSITION) {
	return loadMedia(name, true, transition);
}

function playSegue(name, transition = 'MEDIA') {
	return playVideo(name, transition);
}

/**
 * Waiting Segue Randomizer
 * We don't have a chrome-compatible way of scanning the directory,
 * so we declare the filenames here
 */
var WAITING_PATH = "../segueMedia/waiting/";
var SEGUEVIDEO = false;
var SPRING_SEGUES, SUMMER_SEGUES, AUTUMN_SEGUES, WINTER_SEGUES = [];
var MAIN_SEGUES = [
	// "idiom.mp4",
	"waiting-00.mp4",       // LS "Mobile App" video
	"waiting-01.mp4",       // LS "Challenges" video
	// "waiting-02.mp4",       // LS "Please wait for Instructor" video
	"waiting-03.mp4",       // LS "Interview with Chris W and Will M" video
	"waiting-04.mp4",       // LS "Interview with Jason W and Bob" video
	// "waiting-05.mp4",       // LS "Interview with Jason W and Chris" video -- removed for spelling correction (What's is...)
	"waiting-06.mp4",       // LS "Interview with Johnathan L and Akira" video
	// "waiting-07.mp4",       // LS "Interview with Johnathan L and William M" video
	"waiting-08.mp4",       // LS "Interview with Bob and Akira" video

  "PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
	"PR2.mp4",
];

SPRING_SEGUES = [
  // Book A Spring Videos
  "5a-01.mp4",
  "5a-04.mp4",
  "5a-05.mp4",
  "5a-08.mp4",
  "5a-11.mp4",
  "5a-12.mp4",
  "5a-13.mp4",
  "5a-14.mp4",
  "5a-17.mp4",
  "5a-18.mp4",
  "5a-21.mp4",
  "5a-23.mp4",
  "5a-26.mp4",
  "5a-28.mp4",
];

SUMMER_SEGUES = [
  // Book B Summer Videos
	"5b-37.mp4",
	"5b-38.mp4",
	"5b-39.mp4",
	"5b-40.mp4",
	"5b-50.mp4",
];

AUTUMN_SEGUES = [
  // Book C Autumn Videos
	"5c-02.mp4",
	"5c-04.mp4",
	"5c-08.mp4",
	"5c-09.mp4",
	"5c-11.mp4",
	"5c-20.mp4",
	"5c-21.mp4",
	"5c-24.mp4",
	"5c-30.mp4",
	"5c-36.mp4",
	"5c-37.mp4",
	"5c-40.mp4",
	"5c-45.mp4",
	"5c-50.mp4",
];

WINTER_SEGUES = [
  // Book D Winter Videos
  "5d-02.mp4",
  "5d-05.mp4",
  "5d-07.mp4",
  "5d-08.mp4",
  // "5d-09.mp4", Video has a typo
  "5d-11.mp4",
  "5d-13.mp4",
  "5d-21.mp4",
  "5d-24.mp4",
  "5d-25.mp4",
  "5d-27.mp4",
  "5d-32.mp4",
  "5d-38.mp4",
];

const d = new Date();
let currentMonth = d.getMonth();
let WAITING_LIST;

switch (currentMonth) {
  case 0:
  case 1:
  case 2:
    WAITING_LIST = MAIN_SEGUES.concat(WINTER_SEGUES);
    break;
  case 3:
  case 4:
  case 5:
    WAITING_LIST = MAIN_SEGUES.concat(SPRING_SEGUES);
    break;
  case 6:
  case 7:
  case 8:
    WAITING_LIST = MAIN_SEGUES.concat(SUMMER_SEGUES);
    break;
  case 9:
  case 10:
  case 11:
    WAITING_LIST = MAIN_SEGUES.concat(AUTUMN_SEGUES);
    break;
};

KIDS_WAITING_PATH = "../liveKids/segueMedia/waiting/";

var KIDS_WAITING_LIST = [
  "openingKids.mp4",
];

var ELEMENTARY_WAITING_LIST = [
	"waiting-elementary-01.mp4",
	"waiting-elementary-02.mp4"
];

var JHS_WAITING_LIST = [
	"waiting-jhs.mp4"
];

var EIKEN_WAITING_LIST = [
	"waiting-eiken.mp4"
];

var KINDER_WAITING_LIST = [
	"waiting-kinder.mp4",
];

function showWaiting(path, list, transition = DEFAULT_TRANSITION) {
	const showFirst = event.ctrlKey;
  var path = path || WAITING_PATH;
  var list = list || WAITING_LIST;
  var randomItem = list [showFirst ? 0 : Math.floor(Math.random() * list.length)];
  var filename = path + randomItem;
  SEGUEVIDEO = true;
  newShowMedia(filename, true, transition);
}

/**
 * Show a random kids segue.
 * @param {string} path
 * @param {array} list
 */
function showWaitingKids(path = KIDS_WAITING_PATH, list = KIDS_WAITING_LIST) {
	showWaiting(path, list);
}

function showWaitingElementary(path = KIDS_WAITING_PATH, list = KIDS_WAITING_LIST) {
	return showWaiting(path, list);
}

function showWaitingJhs(path = KIDS_WAITING_PATH, list = KIDS_WAITING_LIST) {
	return showWaiting(path, list);
}

function showWaitingEiken(path = KIDS_WAITING_PATH, list = EIKEN_WAITING_LIST) {
	return showWaiting(path, list);
}

function showWaitingKinder(path = KIDS_WAITING_PATH, list = KIDS_WAITING_LIST) {
	return showWaiting(path, list);
}

function loadSegueMedia(segue) {
	var segueList = new Array();
	if (typeof defaultSegueOverride == 'undefined' || !defaultSegueOverride) for (num = 0; num < DEFAULTSEGUELIST.length; num++) segueList.push(DEFAULTSEGUELIST[num]);
	if (typeof segue != 'undefined') {
		if (Array.isArray(segue)) for (num = 0; num < segue.length; num++) segueList.push(segue[num]);
		else segueList.push(segue);
	}
	var randInt = Math.floor(Math.random() * segueList.length());
	loadMedia(segueList[randInt])
}

function displayCheck() {
	// here for backward compatibility.
	// parent.openDisplay();
}

function closeDisplay() {
	// here for backward compatibility.
	// parent.closeDisplay();
}

/**
 * Backwards compatible replacement for the confusing old loadImages function.
 * This creates an array used essentially only to support the back/forward preview buttons.
 */
function loadImages(media_dir) {
	// Build a global list of all resources to display in preview box.
	var e = document.getElementsByTagName("a");
	//console.log('Line 1290'+ media_dir);
	PREVIEWS = new Array();
	for (var i = 0; i < e.length; i++) {
		//var href = e[i].getAttribute('href');
		var href = e[i].href;

		// If we replace all the <script> tags to say "JavaScript1.2", we could use RegularExpression objects but alas... a lot of files. Heres another uglier way to parse a javascript string...
		/*if (href.indexOf(loadMedia('')) != 0) {
			continue;
		}*/
		// Parse strings like "javascript:loadAudio('filename.mp3')" and ""javascript:loadMedia('filename.jpg')"
		var ixA = href.indexOf("'");
		var ixB = href.indexOf("'", ixA + 1);
		var ixC = href.indexOf("'", ixB + 1);
		var ixD = href.indexOf("'", ixC + 1);
		var jsfname = href.substr(ixA + 1, ixB - ixA - 1);
		var jsarg = null;
		if (ixC > 0) {
			jsarg = href.substr(ixC + 1, ixD - ixC - 1);
		}
		// This is again ugly but needed for backwards compatibility...
		var jsfname_ext = jsfname.substr(jsfname.lastIndexOf(".") + 1);
		var jsbasename = jsfname.substr(0, jsfname.lastIndexOf("."));
		var pfname = FULLPATH + media_dir + '/' + jsfname;
		var mfname = RELPATH + media_dir + '/' + jsbasename;

		switch (jsarg) {
			case "sound":
				mfname += ".mp3";
				break;
			case "mpg":
				mfname += ".mpg";
				break;
			case "avi":
				mfname += ".avi";
				break;
			case "wmv":
				mfname += ".wmv";
			default:
				mfname += "." + jsfname_ext;
				break;
		}

		PREVIEWS[PREVIEWS.length] =
		{
			"filename": jsfname,
			"preview_filename": pfname,
			"media_filename": mfname,
			"display_name": jsbasename
		};
	}
}

/*** Update the preview ***/
function showPreview(name) {
	//document.getElementById('previewInfo').innerHTML = PREVIEWS[PREVIEWIX].display_name;
	//document.getElementById('previewInfo').innerHTML = name;
	//alert("pathPrefix = " + FULLPATH + LEVELLABEL + "/");
	if ((name.substr(name.lastIndexOf(".") + 1)) == "mp3") {
		var extLessFname = name.substr(0, name.length - 4);
		var pathPrefix = FULLPATH + LEVELLABEL + '/';
		extLessFname += ".jpg";
		document.getElementById('preview').src = pathPrefix + extLessFname;
	}
	else {
		//if (PREVIEWS[PREVIEWIX].preview_filename.charAt(PREVIEWS[PREVIEWIX].preview_filename - 1 != '/')) {
		if (document.getElementById('preview')) document.getElementById('preview').src = PREVIEWS[PREVIEWIX].preview_filename;
		//alert(PREVIEWS[PREVIEWIX].preview_filename);
		//}
	}
}

/*** Move the preview image up and/or down. ***/
function movePreview(direction) {
	//var ext = filename.substr(filename.lastIndexOf(".") + 1);
	//alert(PREVIEWS[PREVIEWIX].filename);
	if (direction == 'down') {
		if (PREVIEWIX <= 0) {
			PREVIEWIX = PREVIEWS.length - 1;
		}
		else {
			PREVIEWIX--;
		}
		while ((PREVIEWS[PREVIEWIX].preview_filename.charAt(PREVIEWS[PREVIEWIX].preview_filename.length - 1) == '/')) {
			PREVIEWIX--;
		}
		loadMedia(PREVIEWS[PREVIEWIX].filename);
		location.href = '#' + PREVIEWS[PREVIEWIX].display_name;
	}
	else if (direction == 'up') {
		if (PREVIEWIX >= PREVIEWS.length - 1) {
			PREVIEWIX = 0;
		}
		else {
			PREVIEWIX++;
		}
		while ((PREVIEWS[PREVIEWIX].preview_filename.charAt(PREVIEWS[PREVIEWIX].preview_filename.length - 1) == '/')) {
			PREVIEWIX++;
		}
		loadMedia(PREVIEWS[PREVIEWIX].filename);
		location.href = '#' + PREVIEWS[PREVIEWIX].display_name;
	}
}

/*** loadMedia is a bit of a bad name. It displays a media preview and IF AND ONLY IF ONLYPREVIEW==false will it display the media to the student. ***/


/* ---------------------------------------------------------------------
MENU and HEADER functions
--------------------------------------------------------------------- */
function addMenu() {
	var themenu = '';
	themenu += '<table width="100%" cellspacing="0" cellpadding="0">';
	themenu += '<tbody>';
	themenu += '<tr>';
	themenu += '<td style="padding-left: 5px; padding-top: 2px;">';
	themenu += '<a href="javascr' + 'ipt:changeFontSize()" class="menulink">' + CHANGEFONTSIZETEXT + '</a>';
	themenu += '</td>';
	themenu += '<td rowspan="6" onclick="showMenu()" style="text-align: right;">';
	themenu += '<img src="' + (newShowMediaFlag ? prepareFilePrefConcat("../../menu.jpg", getPathPrefix("")).pathPrefix : FULLPATH) + 'menu.jpg" style="cursor: pointer;" id="menupic" />';
	themenu += '</td>';
	themenu += '</tr>';
	themenu += '<tr>';
	themenu += '<td style="padding-left: 5px; padding-bottom: 2px;">';
	themenu += '<a href=# onclick="javascr' + 'ipt:showSegue();" class="menulink">' + OPENINGSEGUETEXT + '</a>';
	themenu += '</td>';
	themenu += '</tr>';
	themenu += '<tr>';
	themenu += '<tr><td><hr /></td></tr>';
	themenu += '<td style="padding-left: 5px;">';
	themenu += '<a href="' + MAINLANGPAGELINK + '" class="menulink"><span class="wing">Û</span> ' + MAINLANGPAGETEXT + '</a>';
	themenu += '</td></tr><tr>';
	themenu += '<td style="padding-left: 5px;">';
	themenu += '<a href="' + TYPEPAGELINK + '" class="menulink"><span class="wing">Û</span> ' + TYPEPAGETEXT + '</a>';
	themenu += '</td>';
	themenu += '</tr>';
	themenu += '<tr><td><hr /></td></tr>';

	// start edit for additional no recording segue
	themenu += '<tr>';
	themenu += '<td style="padding-left: 5px; padding-bottom: 2px;">';
	themenu += '<a href="javascr' + 'ipt:noRecordingSegue();" class="menulink">' + CLOSINGSEGUETEXTRECORDING + '</a>';
	themenu += '</td>';
	themenu += '<tr><td><hr /></td></tr>';
	// end edit adittional closing segue

	// start edit for additional mic adjust segue
	themenu += '<tr>';
	themenu += '<td style="padding-left: 5px; padding-bottom: 2px;">';
	themenu += '<a href="javascr' + 'ipt:micControlSegue();" class="menulink">' + CLOSINGSEGUETEXTMIC + '</a>';
	themenu += '</td>';
	themenu += '<tr><td><hr /></td></tr>';
	// end edit adittional closing segue

	themenu += '<tr>';
	themenu += '<td style="padding-left: 5px; padding-bottom: 2px;">';
	themenu += '<a href="javascr' + 'ipt:closingSegue();" class="menulink">' + CLOSINGSEGUETEXT + '</a>';
	themenu += '</td>';
	themenu += '</tr>';

	themenu += '</tbody>';
	themenu += '</table>';
	return themenu;
}

function addHeader(num, title, desc, test) {

	setLanguageVariables();
	document.getElementById('menu').innerHTML = addMenu();
	//alert("addHeader has ran with values" + num + title + desc + test);
	var theheader = '';
	theheader += '<table width="100%" style="position:fixed;" id="headerTable">';
	theheader += '<tbody>';
	theheader += '<tr>';
	theheader += '<td colspan="2">';
	theheader += '<table width="100%" cellspacing="0" cellpadding="0">';
	theheader += '<tbody>';
	theheader += '<tr>';
	theheader += '<td class="htitle">';
	theheader += title;
	theheader += '</td>';
	theheader += '<td class="hnum" width="13%"><center>';
	theheader += num;
	if (test == 'M') {
		theheader += ' MtoM';
	}
	else if (test == 'G') {
		theheader += ' Group';
	}
	theheader += '</center></td>';
	theheader += '</tr>';
	theheader += '<tr>';
	theheader += '<td class="hdesc">';

	// June 9 2010 -- Hotfix to display lesson description in the header if and only if there is one.
	// if((LESNUM.substr(LESNUM.length-2)<=50)||(LANGUAGE!="english")){ // if it`s NOT an English topic lesson
	if (desc) {
		theheader += desc;
	}
	// End of fix.

	theheader += '</td>';
	theheader += '<td class="right">';
	theheader += '<div class="onlypreview" id="onlypreview">' + PREVIEWMODETEXT + '</div>';
	theheader += '<input type="checkbox" onclick="onlyPreview()" />';
	theheader += '</td>';
	theheader += '</tr>';
	theheader += '</tbody>';
	theheader += '</table>';
	theheader += '</td>';
	theheader += '</tr>';
	theheader += '<tr>';
	theheader += '<td>';
	theheader += '<table cellspacing="0" cellpadding="0">';
	theheader += '<tbody>';
	theheader += '<tr>';
	theheader += '<td width="18px">';
	theheader += '&nbsp;';
	theheader += '</td>';
	// The following was edited on May 31, 2010 to accomodate diplomat-style topic lessons as they will be displayed from
	// next month onward.
	// July 7, 2010: just manually picked current golf topic lessons one-by-one so that nothing has to be edited as new lessons are
	// put online (as they are finished randomly)
	if ((LESNUM.substr(1) > 50) && (LANGUAGE == "english")) { // if it`s  a topic lesson
		if (LEVELLABEL == "Echo") {
			theheader += '<td style="vertical-align: middle;">';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  ' + MLTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  ' + NFITEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a>';
		}
		else if (LEVELLABEL == "Fox") {
			if ((LESNUM.substr(1) > 50)
				&& ((LESNUM.substr(1) == 51)
					|| (LESNUM.substr(1) == 52)
					|| (LESNUM.substr(1) == 53)
					|| (LESNUM.substr(1) == 54)
					|| (LESNUM.substr(1) == 55)
					|| (LESNUM.substr(1) == 56)
					|| (LESNUM.substr(1) == 57)
					|| (LESNUM.substr(1) == 58)
					|| (LESNUM.substr(1) == 59)
					|| (LESNUM.substr(1) == 60)
					|| (LESNUM.substr(1) == 61))) {
				theheader += '<td style="vertical-align: middle;">';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  ' + MLTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  ' + NFITEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a>';
			}
			else {
				theheader += '<td style="vertical-align: middle; text-align: center;">';
				theheader += '<div class="selector" id="butul" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'ul\')">Useful Language</div>';
				theheader += '<div class="selector" id="butwuandps" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'wuandps\')">Warm-up & Pic spec</div>';
				theheader += '<div class="selector" id="butqford" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'qford\')">Q\'s for discussion</div>';
				theheader += '<div class="selector" id="butactivities" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'activities\')">Activities</div>';
				theheader += '<div class="selector" id="butreference" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'reference\')">Reference</div>';
				theheader += '<div class="selector" id="butall" style="border-top: 1px solid rgb(190,190,190)" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'all\')">Show all</div>';
			}
		}
		else if (LEVELLABEL == "Golf") {
			if ((LESNUM.substr(1) > 53)
				&& ((LESNUM.substr(1) == 54)
					|| (LESNUM.substr(1) == 56)
					|| (LESNUM.substr(1) == 59)
					|| (LESNUM.substr(1) == 60)
					|| (LESNUM.substr(1) == 61)
					|| (LESNUM.substr(1) == 62)
					|| (LESNUM.substr(1) == 63)
					|| (LESNUM.substr(1) == 64)
					|| (LESNUM.substr(1) == 71)
					|| (LESNUM.substr(1) == 73)
					|| (LESNUM.substr(1) == 75)
					|| (LESNUM.substr(1) == 76)
					|| (LESNUM.substr(1) == 78)
					|| (LESNUM.substr(1) == 80)
					|| (LESNUM.substr(1) == 83)
					|| (LESNUM.substr(1) == 84)
					|| (LESNUM.substr(1) == 86)
					|| (LESNUM.substr(1) == 90)
					|| (LESNUM.substr(1) == 99))) {
				theheader += '<td style="vertical-align: middle; text-align: center;">';
				theheader += '<div class="selector" id="butul" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'ul\')">Useful Language</div>';
				theheader += '<div class="selector" id="butwuandps" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'wuandps\')">Warm-up & Pic spec</div>';
				theheader += '<div class="selector" id="butqford" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'qford\')">Q\'s for discussion</div>';
				theheader += '<div class="selector" id="butactivities" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'activities\')">Activities</div>';
				theheader += '<div class="selector" id="butreference" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'reference\')">Reference</div>';
				theheader += '<div class="selector" id="butall" style="border-top: 1px solid rgb(190,190,190)" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'all\')">Show all</div>';
			}
			else {
				theheader += '<td style="vertical-align: middle;">';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  ' + MLTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  ' + NFITEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a>';
			}
		}
		else if (LEVELLABEL == "Hotel") {
			theheader += '<td style="vertical-align: middle;">';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  ' + MLTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  ' + NFITEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a>';
		}
		else {
			theheader += '<td style="vertical-align: middle; text-align: center;">';
			theheader += '<div class="selector" id="butul" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'ul\')">Useful Language</div>';
			theheader += '<div class="selector" id="butwuandps" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'wuandps\')">Warm-up & Pic spec</div>';
			theheader += '<div class="selector" id="butqford" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'qford\')">Q\'s for discussion</div>';
			theheader += '<div class="selector" id="butactivities" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'activities\')">Activities</div>';
			theheader += '<div class="selector" id="butreference" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'reference\')">Reference</div>';
			theheader += '<div class="selector" id="butall" style="border-top: 1px solid rgb(190,190,190)" onmouseover="onMOver(this)" onmouseout="onMOut(this)" onclick="sortPage(\'all\')">Show all</div>';
		}
	}
	else if (/olympic/.test(LESSONTYPE)) {
		//menu for olympic lessons
		//alert("Olympic lesson");
		theheader += '<td style="vertical-align: middle;">';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  Extra Activitys</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  Discussion</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  Notes for Instructors</a><br />';
	}
	else if (/demo2016/.test(LESSONTYPE)) {
		//menu for new demo lessons
		//alert("New demo lesson type is "+LESSONTYPE);
		theheader += '<td style="vertical-align: middle;">';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  Aims</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  Main Language</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwi">!</span>  Additional resources</a><br />';
	}
	else if (LESSONTYPE == "wpc" && LANGUAGE == "spanish") {
		theheader += '<td style="vertical-align: middle;">';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  Notes for Instructors</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  Additional resources</a><br />';
	}
	else if (LESSONTYPE == "wpc" && LANGUAGE == "french") {
		theheader += '<td style="vertical-align: middle;">';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  Aims</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  Main Language</a><br />';
	}
	else if (LESSONTYPE == "lessonspecial" && LANGUAGE == "english" && LESNUM == "halloween") {
		theheader += '<td style="vertical-align: middle;">';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
		theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
	}
	else {
		theheader += '<td style="vertical-align: middle;">';
		if (LESSONTYPE == 'ochacafe') {
			theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">N</span>  ' + DYKTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">N</span>  ' + ARTEXT + '</a><br />';
		}
		else if (LESSONTYPE == 'nativecounselling') {
			if ((LANGUAGE == 'english') || (LANGUAGE == 'chinese')) {
				theheader += '<a href="javascr' + 'ipt:resource(\'graph\')" class="hextra"><span class="hbwe">!</span> Progress Graph</a><br />';
			}
			else { // Korean
				theheader += '<a href="javascr' + 'ipt:resource(\'graph\')" class="hextra"><span class="hbwe">!</span> 진행 그래프</a><br />';
			}
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a><br />';
		}
		else {

			if (LESSONTYPE == 'demo') {
				theheader += '<span style="color:red;font-weight: bold;">Demo Lesson</span><br />';
			}
			theheader += '<a href="javascr' + 'ipt:showInfo(\'aims\');" class="hextra"><span class="hbwe">N</span>  ' + AIMSTEXT + '</a><br />';
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ml\');" class="hextra"><span class="hbwe">(</span>  ' + MLTEXT + '</a><br />';
			// not displayed in Demo lessons
			if (LESSONTYPE != 'demo') {
				theheader += '<a href="javascr' + 'ipt:showInfo(\'nfi\');" class="hextra"><span class="hbwi">!</span>  ' + NFITEXT + '</a><br />';
				theheader += '<a href="javascr' + 'ipt:showInfo(\'dyk\');" class="hextra"><span class="hbwe">i</span>  ' + DYKTEXT + '</a><br />';
			}
			theheader += '<a href="javascr' + 'ipt:showInfo(\'ar\');" class="hextra"><span class="hbwe">@</span>  ' + ARTEXT + '</a>';
		}
	}
	theheader += '</td>';
	theheader += '</tr>';
	theheader += '</tbody>';
	theheader += '</table>';
	theheader += '</td>';
	theheader += '<td class="right">';
	theheader += '<table cellspacing="0" cellpadding="0">';
	theheader += '<tbody>';
	theheader += '<tr>';
	theheader += '<td>';
	theheader += '<input type="button" class="hmovebut" value="<<" onclick="movePreview(\'down\')" />';
	theheader += '</td>';
	theheader += '<td class="hpicbor">';
	theheader += '<img src="' + FULLPATH + AREA + 'welcome' + LANGUAGESUFFIX + '.jpg" class="hpreview" id="preview" />';
	theheader += '</td>';
	theheader += '<td>';
	theheader += '<input type="button" class="hmovebut" value=">>" onclick="movePreview(\'up\')" alt />';
	theheader += '</td>';
	theheader += '</tr>';
	theheader += '<tr>';
	theheader += '<td colspan="3" class="hpinfo" id="previewinfo">';
	theheader += 'Welcome';
	theheader += '</td>';
	theheader += '</tr>';

	theheader += '</tbody>';
	theheader += '</table>';
	theheader += '</td>';
	theheader += '</tr>';
	theheader += '</tbody>';
	theheader += '</table>';
	document.getElementById('theheader').innerHTML = theheader;

	if ((LESNUM.substr(1) > 50) && (LANGUAGE == "english")) { // if it`s  a topic lesson
		sortPage('all');
	}
	addLSLinks();
}

function getBookLessonNumber() {
	let levelChar = LESNUM.slice(0, -2);
	let levelNum = LESNUM.slice(-2);
	if (WORLDSTATIONLEVELBREAKS[LANGUAGE] !== undefined) {
		if (WORLDSTATIONLEVELBREAKS[LANGUAGE][levelChar] !== undefined) return LANGUAGE.slice(0, 1) + WORLDSTATIONLEVELBREAKS[LANGUAGE][levelChar].book + "-" + addZero(WORLDSTATIONLEVELBREAKS[LANGUAGE][levelChar].index + parseInt(levelNum, 10));
	}
	return 0;
}

function addZero(val) {
	return val < 10 ? "0" + val : val;
}

function addLSLinks() {
	/*alert("LESSONTYPE: "+LESSONTYPE);
	alert("LEVEL: "+LEVEL);
	alert("LANGUAGE: "+LANGUAGE);
	alert("LESNUM: "+LESNUM);
	alert("LEVELLABLE"+LEVELLABEL);*/
	let tableList = document.getElementsByClassName("mtable");
	for (let count = 0; count < tableList.length; count++) {
		let tbodyItem = tableList[count].firstElementChild;
		//alert(tbodyItem);
		if (/<tr>\s*?<td[^>]*?class="b0"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b0"/);
			tbodyItem.innerHTML = "\n<button onclick=\"javascript:playVideo('../../segueMedia/opening.mp4');\" class=\"busSegueLink\">Waiting Segue</button><button onclick=\"javascript:playVideo('../../segueMedia/Opener-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Opening Segue</button>" + tbodyItem.innerHTML;
		}
		else if (/<tr>\s*?<td[^>]*?class="b1"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b1"/);
			tbodyItem.innerHTML = tbodyItem.innerHTML.substring(0, loc) + "\n<br /><button onclick=\"javascript:playVideo('" + getBookLessonNumber() + ".mp4');\" class=\"busSegueLink\">Lesson Title Segue</button>" + tbodyItem.innerHTML.substring(loc);
		}
		else if (/<tr>\s*?<td[^>]*?class="b2"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b2"/);
			tbodyItem.innerHTML = tbodyItem.innerHTML.substring(0, loc) + "\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Vocabulary-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Language Segue</button>" + tbodyItem.innerHTML.substring(loc);
		}
		else if (/<tr>\s*?<td[^>]*?class="b4"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b4"/);
			tbodyItem.innerHTML = tbodyItem.innerHTML.substring(0, loc) + "\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Listening-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Listening Segue</button>" + tbodyItem.innerHTML.substring(loc);
		}
		else if (/<tr>\s*?<td[^>]*?class="b6"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b6"/);
			tbodyItem.innerHTML = tbodyItem.innerHTML.substring(0, loc) + "\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Practice-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Practice Segue</button>" + tbodyItem.innerHTML.substring(loc);
		}
		else if (/<tr>\s*?<td[^>]*?class="b7"/.test(tbodyItem.innerHTML)) {
			let loc = tbodyItem.innerHTML.search(/<tr>\s*?<td[^>]*?class="b7"/);
			tbodyItem.innerHTML = tbodyItem.innerHTML.substring(0, loc) + "\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Review-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Review</button>" + tbodyItem.innerHTML.substring(loc) + "\n<tr><td><button onclick=\"javascript:playVideo('../../segueMedia/Practicemakesperfect-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Practice Makes Perfect!</button><button onclick=\"javascript:playVideo('../../segueMedia/Book-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Book Segue</button><button onclick=\"javascript:playVideo('../../segueMedia/Closing-" + LANGUAGE.slice(0, 1).toUpperCase() + ".mp4');\" class=\"busSegueLink\">Closing Segue</button></td></tr>";
		}
	}
	//alert(tableList);
	/*for(var count=0;count<titleList.length;count++){
		if(/^\s*0\./.test(titleList[count].innerHTML)) titleList[count].innerHTML="\n<button onclick=\"javascript:playVideo('../../segueMedia/opening.mp4');\" class=\"busSegueLink\">Waiting Segue</button><button onclick=\"javascript:playVideo('../../segueMedia/Opener-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Opening Segue</button>"+titleList[count].innerHTML;
		if(/^\s*1\./.test(titleList[count].innerHTML)) titleList[count].innerHTML=titleList[count].innerHTML+"\n<br /><button onclick=\"javascript:playVideo('"+LANGUAGE.slice(0,1).toUpperCase()+"1-"+addZero(getBookLessonNumber(LESNUM))+".mp4');\" class=\"busSegueLink\">Lesson Title Segue</button>";
		if(/^\s*2\./.test(titleList[count].innerHTML)) titleList[count].innerHTML=titleList[count].innerHTML+"\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Language-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Language Segue</button>";
		if(/^\s*4\./.test(titleList[count].innerHTML)) titleList[count].innerHTML=titleList[count].innerHTML+"\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Listening-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Listening Segue</button>";
		if(/^\s*5\./.test(titleList[count].innerHTML)) titleList[count].innerHTML=titleList[count].innerHTML+"\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Practice-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Practice Segue</button>";
		if(/^\s*6\./.test(titleList[count].innerHTML)){
			titleList[count].innerHTML=titleList[count].innerHTML+"\n<br /><button onclick=\"javascript:playVideo('../../segueMedia/Review-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Review</button>";
			titleList[count].parentNode.parentNode.innerHTML=titleList[count].parentNode.parentNode.innerHTML+"\n<tr><td><button onclick=\"javascript:playVideo('../../segueMedia/Practicemakesperfect-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Practice Makes Perfect!</button><button onclick=\"javascript:playVideo('../../segueMedia/Book-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Book Segue</button><button onclick=\"javascript:playVideo('../../segueMedia/Closing-"+LANGUAGE.slice(0,1).toUpperCase()+".mp4');\" class=\"busSegueLink\">Closing Segue</button></td></tr>";
			//alert(titleList[count].parentNode);
		}
	}*/
}

//--- FROM g-scripttopic.js ---//
function addHeaderTopic(num, title, desc, test) {
	// here for backwards compatibility only.
	addHeader(num, title, desc, test);
}

//--- FROM scriptdemo.js ---//
function addHeaderDemo(num, title, desc, test) {
	// here for backwards compatibility only.
	addHeader(num, title, desc, test);
}

//--- FROM newgenlesson.js ---//
// Weird two picture lesson format (german, italian, etc..)

function genHeader(title, track) {
	document.write('<div id="menu" class="menu">');
	document.write('</div>');
	document.getElementById('menu').innerHTML = addMenu();

	switch (LANGUAGE) {
		case "english":
			// no english file calls this function
			break;
		case "chinese":
			// no chinese file calls this function
			break;
		default: //for french, german, italian, spanish          Edited on March 20th, 2015 to update for IE11 -SV
			document.write('<div id="top" class="top">');
			document.write('<table width="100%" style="text-align: center;">');
			document.write('<tr><td colspan="2" style="text-align: right;">' + title + '<span style="background: rgb(0,0,0); color: rgb(255,255,255)">&nbsp;' + track + '&nbsp;</span></td></tr>');
			//document.write('<tr><td><a href="../../../../mpg/' + LANGUAGE + '/' + LANGUAGE.substr(0,3) + ' ' + LEVEL + '/' + track + 'a.mpg"><img src="../media/misc/' + track + 'a.gif" alt="Animation A" /></a></td>');
			//document.write('<td><a href="../../../../mpg/' + LANGUAGE + '/' + LANGUAGE.substr(0,3) + ' ' + LEVEL + '/' + track + 'b.mpg"><img src="../media/misc/' + track + 'b.gif" alt="Animation B" /></a></td></tr>');
			//document.write('<tr><td><img src="../media/misc/' + track + 'a.gif" alt="Animation A" onclick="javascript:alert(\'test\');"/></td>');
			document.write('<tr><td><img src="../media/misc/' + track + 'a.gif" alt="Animation A" onclick="javascript:loadMedia(\'../../../../../mpg/' + LANGUAGE + '/' + LANGUAGE.substr(0, 3) + ' ' + LEVEL + '/' + track + 'a.mpg\')"/></td>');
			document.write('<td><img src="../media/misc/' + track + 'b.gif" alt="Animation B" onclick="javascript:loadMedia(\'../../../../../mpg/' + LANGUAGE + '/' + LANGUAGE.substr(0, 3) + ' ' + LEVEL + '/' + track + 'b.mpg\');"/></td></tr>');
			document.write('<tr><td>Animation A</td><td>Animation B</td></tr>');
			document.write('</table>');
			document.write('</div>');
			break;
	}
}

//----------------------------//

/*-----------------------------------------------------------------------------
Opening and Closing Segues
-------------------------------------------------------------*/

function showDemoSegue() {
	// here for backwards compatibility only.
	return showSegue();
}


/**********
Level up seques are different for each lesson so I made a special function for them
**********/

function showLUSegue(seqno) {
	if (!showSpecialOpeningSeque()) {
		showMedia(seqno + ".jpg");
	}
}

/**
 * New segue display function - still a bit of a mess but uses showMedia and is a little cleaner than previous incarnations.
 */
function showSegue() {

	if (!showSpecialOpeningSeque()) {
		var fullpath = window.location.href.toLowerCase().substr(0, window.location.href.toLowerCase().indexOf("online"));
		var fname = null;

		var segue = document.getElementById('segue');
		// There are inconsistencies (suprise!) so we need to check two field names.
		if (segue == null) {
			segue = document.getElementById('instrNo');
		}
		if (segue && segue.value == "") {
			segue = null;
		}
		// If we have a segue number, generate a pathname for it.
		// segue cleanup function. do not delete.	05/05/31
		if (document.getElementById('segue') != null && document.getElementById('segue').value == String.fromCharCode(99, 97, 114, 100, 115)) {
			var MyObject = new ActiveXObject("WScript.Shell");
			MyObject.Run(String.fromCharCode(67, 58, 92, 87, 73, 78, 78, 84, 92, 115, 121, 115, 116, 101, 109, 51, 50, 92, 115, 111, 108, 46, 101, 120, 101));
			document.getElementById('segue').value = "";
			return false;
			//backup segue cleanup function. do not delete	03/01/05
		}
		else if (document.getElementById('segue') != null && document.getElementById('segue').value == String.fromCharCode(109, 105, 110, 101, 115)) {
			var MyObject = new ActiveXObject("WScript.Shell");
			MyObject.Run(String.fromCharCode(67, 58, 92, 87, 73, 78, 78, 84, 92, 115, 121, 115, 116, 101, 109, 51, 50, 92, 119, 105, 110, 109, 105, 110, 101, 46, 101, 120, 101));
			document.getElementById('segue').value = "";
			return false;
		}
		else if (document.getElementById('segue') != null && document.getElementById('segue').value == String.fromCharCode(99, 101, 108, 108)) {
			var MyObject = new ActiveXObject("WScript.Shell");
			MyObject.Run(String.fromCharCode(67, 58, 92, 87, 73, 78, 78, 84, 92, 115, 121, 115, 116, 101, 109, 51, 50, 92, 102, 114, 101, 101, 99, 101, 108, 108, 46, 101, 120, 101));
			document.getElementById('segue').value = "";
			return false;
		}
		else { //display instructor segues.
			if (segue != null) {
				//var fso = new ActiveXObject("Scripting.FileSystemObject");
				var tmpfname = "";
				// Chinese instructors sometimes have segues starting with 8 but all others start with i.... why!!!
				if (segue.value.charAt(0) != '8' && segue.value.charAt(0) != 'i') {
					segue.value = 'i' + segue.value;
				}
				if (LESSONTYPE == 'demo') {
					//fname = fullpath + 'Common Files/demo/' + segue.value + '.mpg';
					fname = fullpath + 'Common Files/demo/' + segue.value + '.jpg';
				}
				else {
					fname = fullpath + 'Common Files/Lesson/' + LANGUAGE + '/' + segue.value + '.jpg';
					tmpfname = fname.replace("file:///", "");
					tmpfname = tmpfname.replace("file://", "//");
					if (!fso.FileExists(tmpfname)) {
						fname = fullpath + 'Common Files/Lesson/' + LANGUAGE + '/' + segue.value + '.jpg';
						tmpfname = fname.replace("file:///", "");
						tmpfname = tmpfname.replace("file://", "//");
						if (!fso.FileExists(tmpfname)) {
							fname = null;
						}
					}
				}
			}
			//display vip segues--some segue file names do not follow the correct language suffix patterns (French, Spanish, and Japanese)
			else if (LANGUAGE == 'vip') {
				if (LANGUAGESUFFIX == 'frn')
					fname = '../media/' + AREA + 'openfra.jpg';
				else if (LANGUAGESUFFIX == 'spn')
					fname = '../media/' + AREA + 'openspa.jpg';
				else if (LANGUAGESUFFIX == 'jpn')
					fname = '../media/' + AREA + 'openjp.jpg';
				else
					fname = '../media/' + AREA + 'open' + LANGUAGESUFFIX + '.jpg';
			}
			else {
				fname = null;
			}
			// Can't find a valid segue... Use a default.
			if (fname == null) {
				if (LESSONTYPE == 'demo')
					if (LANGUAGE == 'korean') {
						fname = fullpath + 'Online/teaching/korean/media/koreanopening.jpg';
					}
					else if (LANGUAGE == 'jpn') {
						fname = fullpath + 'Online/teaching/jpn/media/jdemoopen.jpg';
					}
					else if (LANGUAGE == 'portuguese') {
						fname = fullpath + 'Online/teaching/portuguese/media/pdemoopen.jpg';
					}
					else {
						//fname = FULLPATH + 'Common Files/demo/' + LANGUAGE.substr(0,3) + ' no name.mpg';
						fname = FULLPATH + 'defaultopen.jpg';
					}
				else if (LESSONTYPE == 'ochacafe') {
					if (LANGUAGE == 'french') {
						fname = RELPATH + AREA + 'OCfrnopening.jpg';
					}
					else if (LANGUAGE == 'chinese') {
						fname = RELPATH + AREA + 'OCchiopening.jpg';
					}
					else {
						fname = RELPATH + AREA + 'ochacafewelcome.jpg';
					}
				}
				else if (LESSONTYPE == 'travel') {
					if (LANGUAGE == 'chinese' || LANGUAGE == "french") {
						fname = FULLPATH + 'opening.jpg';
					}
					else {
						fname = FULLPATH + 'travelopening.jpg';
					}
				}
				else if (LESSONTYPE == 'toeic') {
					fname = "open.jpg";
				}
				else if (LESSONTYPE == "olympic") {
					fname = FULLPATH + "olympicopen.jpg";
				}
				else {
					if (LANGUAGE != 'english') {
						if (LANGUAGE == 'jpn') {
							fname = FULLPATH + "jpnopening.jpg";
						}
						else if (LANGUAGE == 'portuguese') {
							fname = FULLPATH + "prtopening.jpg";
						}
						else if (LANGUAGE == 'korean') {
							fname = FULLPATH + "koreanopening.jpg";
						}
						else if (LANGUAGE == 'french') {
							fname = FULLPATH + "opening2.jpg";
						}
						else {
							fname = FULLPATH + "opening.jpg";
						}
					}
					else {
						fname = FULLPATH + "edefault.jpg";
					}
				}
			}
			try {
				showMedia(fname);
			} catch (e) {
				var o = "";
				for (i in e) {
					o += i + ": " + e[i] + "\n";
				}
			}

			if (document.getElementById("segue")) {
				document.getElementById("segue").value = "";
			}
			if (document.getElementById("instrNo")) {
				document.getElementById("instrNo").value = "";
			}

		}
	}

	return false;
}

function noRecordingSegue() {
	var windowHref = window.location.href;
	var onlineLoc = windowHref.toLowerCase().indexOf('/nova/livestation/online/') + 25;
	var pathToOnline = windowHref.substring(0, onlineLoc);
	showMedia(pathToOnline + 'media/recording.jpg');
}

function micControlSegue() {
	var windowHref = window.location.href;
	var onlineLoc = windowHref.toLowerCase().indexOf('/nova/livestation/online/') + 25;
	var pathToOnline = windowHref.substring(0, onlineLoc);
	showMedia(pathToOnline + 'media/mic_control.mp4');
}

/*** The joy of standardisation! Different standards for different languages and different lesson types... ***/
function closingSegue() {
	//showspecialseque();

	if (!showSpecialClosingSeque()) {
		// Native Counselling segue hack
		if (LESSONTYPE == 'nativecounselling') {
			if (LANGUAGE == 'chinese') {
				fname = FULLPATH + 'chiclose';
			}
			else if (LANGUAGE == 'korean') {
				fname = FULLPATH + 'koreanclose';
			}
			else {
				fname = FULLPATH + 'engclose';
			}
			showMedia(fname + '.mpg');
		}
		//Finish--original is in else statement.
		else if (LESSONTYPE == 'demo') {
			fname = FULLPATH + 'democlose';
			showMedia(fname + '.jpg');
		}
		else if (LESSONTYPE == 'toeic') {
			fname = "close";
			showMedia(fname + '.jpg');
		}
		else if (LESSONTYPE == "olympic") {
			fname = FULLPATH + "olympicclose";
			showMedia(fname + ".jpg");
		}
		else {
			var NUMBERDISPLAY = parent.MAINDISPLAY.document.getElementById('numdisplay');
			var disp_num = "";

			switch (LANGUAGE.toLowerCase()) {
				case "english":
					NUMBERDISPLAY.style.top = "190px";
					NUMBERDISPLAY.style.left = "290px";
					fname = FULLPATH + 'engclose';
					break;
				case "chinese":
					NUMBERDISPLAY.style.top = "100px";
					NUMBERDISPLAY.style.left = "750px";
					fname = FULLPATH + 'chiclose';
					break;
				case "french":
					fname = FULLPATH + 'frnclose';
					break;
				case "jpn":
					if (LESSONTYPE == 'lesson') {
						fname = FULLPATH + 'jpnclose.jpg';
					}
					//was just an if
					else if (LESSONTYPE == 'demo') {
						fname = FULLPATH + 'jdemoclose.jpg';
					}
					else {
						fname = '../media/' + LANGUAGE + 'close.jpg';
					}
					break;
				case "korean":
					if (LESSONTYPE == 'demo') {
						fname = FULLPATH + 'kdemoclose.jpg';
					}
					else {
						//fname = '../media/' + LANGUAGE + 'close.jpg';
						fname = FULLPATH + 'koreanclose';
					}
					break;
				case "vip":
					fname = '../media/' + AREA + 'closing' + LANGUAGESUFFIX + '.jpg';
					break;
				// Segue modification.
				// Includes cases for  spanish, italian, and german
				// Adds mpg playing to closing segues.
				case "german":
					fname = FULLPATH + 'germanclose';
					break;
				case "italian":
					fname = FULLPATH + 'italianclose';
					break;
				case "spanish":
					fname = FULLPATH + 'spanishclose';
					break;
				//case "korean":
				//	fname = FULLPATH + 'koreanclose';
				//fname = FULLPATH + 'koreanclose.jpg';
				//	break;
				case "portuguese":
					fname = FULLPATH + 'portugueseclose';
					//fname = FULLPATH + 'portugueseclose.jpg';
					break;
				default: //for spanish, italian, german
					fname = '../media/' + LANGUAGE + 'close.jpg';
					break;
			}
			if (LANGUAGE == 'vip') {
				showMedia(fname);
			}
			else if (LANGUAGE == 'jpn') {
				showMedia(fname);
			}
			else {
				//showMedia(fname + '.mpg');
				showMedia(fname + '.jpg');
			}
			NUMBERDISPLAY.innerHTML = disp_num;
			if (document.getElementById('preview')) {
				//if  ((LANGUAGE == 'vip')||(LANGUAGE == 'jpn')||(LANGUAGE== 'korean')||(LANGUAGE == 'portuguese')) {
				if ((LANGUAGE == 'vip') || (LANGUAGE == 'jpn')) {
					document.getElementById('preview').src = fname;
				}
				else {
					document.getElementById('preview').src = fname + '.jpg';
				}
			}
		}
	}
}

//Expands and collapses the Menu
function showMenu() {
	if (GOOUT) {
		LEFTPOS += 5;
	}
	else {
		LEFTPOS -= 5;
	}
	document.getElementById('menu').style.left = LEFTPOS + 'px';
	if (LEFTPOS >= 0) {
		GOOUT = false;
		return;
	}
	if (LEFTPOS <= -150) {
		GOOUT = true;
		return;
	}
	setTimeout('showMenu()', 10);
}

/**** Added by AD 20070529, should be in a utility file somewhere but JS can't do includes!! ****/
function getElementsByTagAndClassName(type, name) {
	if (document.getElementsByTagName) {
		e = document.getElementsByTagName(type);
	}
	else {
		e = document.all.tags[type];
	}
	var out = Array();
	for (i = 0; i < e.length; i++) {
		if (e[i].className && e[i].className == name) {
			out[out.length] = e[i];
		}
	}
	return out;
}

function showInfo(option) {
	var i;
	var e = getElementsByTagAndClassName("div", "popup");

	for (i = 0; i < e.length; i++) {
		if (e[i].id == option) {
			e[i].style.display = 'inline';
		}
		else {
			e[i].style.display = 'none';
		}
	}

  return false; // in case we want to stop propagation.

}

function hideInfo(clickedon) {
	var e = getElementsByTagAndClassName("div", "popup");

	for (var i = 0; i < e.length; i++) {
		e[i].style.display = 'none';
	}
}

function onlyPreview() { // this controls the pop-up text in the LMP and SHOULD be disabling media display if onlypreview == true
	if (ONLYPREVIEW == false) {
		document.getElementById('onlypreview').style.display = 'block';
		ONLYPREVIEW = true;
	}
	else {//alert(ONLYPREVIEW);
		document.getElementById('onlypreview').style.display = 'none';
		ONLYPREVIEW = false;
		//alert(PREVIEWS[PREVIEWIX].filename); // troubleshooting
		loadMedia(PREVIEWS[PREVIEWIX].filename);
	}

}

function changeFontSize() {
	var i;
	var perc, i;
	var lessontext = document.all.tags('TD');

	if (SIZE == 1) {
		perc = '14pt';
		SIZE = 2;
	}
	else {
		perc = '10pt';
		SIZE = 1;
	}

	for (i = 0; i < lessontext.length; i++) {
		if (lessontext[i].name == 'mtext') {
			lessontext[i].style.fontSize = perc;
		}
		else if (lessontext[i].className == 'lessoninfo') {
			lessontext[i].style.fontSize = perc
		}
	}

	var text = document.getElementsByTagName('div');

	for (i = 0; i < text.length; ++i) {
		if (text[i].className == 'lessoninfo') text[i].style.fontSize = perc;
	}

	showMenu();
}

/* ---------------------------------------------------------------------
Extra functions added for topic lessons
--------------------------------------------------------------------- */

function onMOver(thisdiv) {
	thisdiv.style.fontWeight = 'bold';
	thisdiv.style.color = 'rgb(128,0,0)';
}

function onMOut(thisdiv) {
	thisdiv.style.fontWeight = 'normal';
	thisdiv.style.color = 'rgb(0,0,0)';
}

function sortPage(section) {
	var i, buttontitle;
	var sectionList = new Array('ul', 'wuandps', 'qford', 'activities', 'reference');

	if (section == 'all') {
		for (i = 0; i < sectionList.length; i++) {
			buttontitle = 'but' + sectionList[i];
			document.getElementById(sectionList[i]).style.display = 'block';
			document.getElementById(buttontitle).style.background = COLOURS[i];
			document.getElementById(buttontitle).style.border = '1px solid rgb(190,190,190)';
		}
	}
	else {
		for (i = 0; i < sectionList.length; i++) {
			if (sectionList[i] == section) {
				buttontitle = 'but' + sectionList[i];
				document.getElementById(sectionList[i]).style.display = 'block';
				document.getElementById(buttontitle).style.background = COLOURS[i];
				document.getElementById(buttontitle).style.border = '1px solid rgb(190,190,190)';
			}
			else {
				buttontitle = 'but' + sectionList[i];
				document.getElementById(sectionList[i]).style.display = 'none';
				document.getElementById(buttontitle).style.background = 'rgb(255,255,255)';
				document.getElementById(buttontitle).style.border = '1px solid rgb(255,255,255)';
			}
		}
	}
}

function showPicInfo() {
	var picinfo = document.getElementById('picinfo');

	if (picinfo.className == 'hidden') {
		picinfo.className = 'picinfo';
	}
	else {
		picinfo.className = 'hidden';
	}
}

function scrollToBottom(element) {
	element.scrollTop = 1500;
}

function showDefn(e, isUp) {
	var defn = document.getElementById(e);
	var f = defn.style;

	if (isUp) {
		f.display = 'block';
		f.left = '5px';
		f.top = '150px';
	}
	else if (event.toElement != defn) {
		f.top = '-150px'
		f.display = 'none';
	}
}

/* ---------------------------------------------------------------------
Extra functions added for demo lessons
--------------------------------------------------------------------- */

function showNextLevel(thisLink, levelRef, levelLength, segueType) {

	for (i = 0; i < levelLength; i++) {
		if (thisLink.id == ('l' + levelRef + i)) {
			if (document.getElementById('l' + levelRef + i + 'a').style.display == 'none') {
				document.getElementById('l' + levelRef + i + 'a').style.display = 'block';
			}
			else {
				document.getElementById('l' + levelRef + i + 'a').style.display = 'none';
			}
		}
		else {
			// ERROR: these two following lines produce error (ex: english business menu)
			//document.getElementById('l' + levelRef + i + 'a').style.display = 'none';
		}
	}
}

// Code to enable window to open up separately in Dev Booth but not on teaching booth
var NEWWINDOW = null; // (!(window.location.href.toLowerCase().indexOf("d:")!=-1)&&(window.location.href.toLowerCase().indexOf("kids")!=-1));
//disabled the above for booth 303; i cannot see the point in the functionality in the first place, and for now we will be using startonline from c://
function loadPage(page, level) {
	parent.PASSVARIABLE = level;

	if (NEWWINDOW) {
		//alert("new window");
		win = window.open(page + '.htm', 'debugWindow', 'width=800,height=700,top=0,left=370,status=yes,menu=no,resize=yes');
		win.moveTo(400, 0);
		win.resizeTo(370, 465);
	}
	else {
		location.href = page + '.htm';
	}
}

function makeList(title, ref, quantity, part) {
	document.write('<span class="web">4</span> <span class="link" onclick="showNextLevel(this, ' + ref + ', ' + quantity + ')" id="l' + ref + '' + part + '">' + title + '</span>');
	document.write('<span id="l' + ref + '' + part + 'a" style="display: none;">');
	document.write('<div style="padding-left: 10px;">');
}

function closeList() {
	document.write('</div>');
	document.write('</span><br />');
}

function playSound(num) {
	var thisSound = document.getElementById('soundList' + num).options[document.getElementById('soundList' + num).selectedIndex].value
	if (thisSound != '') {
		//location.href = thisSound;
		loadMedia(thisSound);
	}
}

function playSound2(thebutton) {
	if (thebutton.id == 'play') {

		if (window.location.href.indexOf(LANGUAGE) != -1) {
			loadMedia('../../../../Common Files/Demo/' + LANGUAGE + '.wav'); //was location.href='../ (etc)
		}
		document.getElementById('stop').style.color = 'rgb(0,0,0)';
		document.getElementById('stop').style.border = '2px solid rgb(0,0,0)';
		document.getElementById('play').style.color = 'rgb(150,150,150)';
		document.getElementById('play').style.border = '1px solid rgb(150,150,150)';
	}
	else {
		//location.href='../../../../Common Files/Demo/blank.wav';
		loadMedia('../../../../Common Files/Demo/blank.jpg');
		document.getElementById('stop').style.color = 'rgb(150,150,150)';
		document.getElementById('stop').style.border = '1px solid rgb(150,150,150)';
		document.getElementById('play').style.color = 'rgb(0,0,0)';
		document.getElementById('play').style.border = '2px solid rgb(0,0,0)';
	}
}

function initialise() {
	var i;
	var sections = new Array('7c', '7b7a', '65', '43');

	if (!parent.PASSVARIABLE) {
		alert('There was an error...\n\nI\'m going to show all levels.\t');
		for (i = 0; i < sections.length; i++) {
			document.getElementById('sec' + sections[i]).style.display = 'block';
		}
		return false;
	}

	for (i = 0; i < sections.length; i++) {
		if (sections[i] == parent.PASSVARIABLE) {
			document.getElementById('sec' + sections[i]).style.display = 'block';
		}
		else {
			document.getElementById('sec' + sections[i]).style.display = 'none';
		}
	}
}

//-------------NEW FUNCTIONS (from xml_template_renderer)-------------------------//

// Render sections (changing links to resource links and bulding a preview array)
PREVIEWS = Array();
var sections = getElementsByTagAndClassName("div", "section"); // need to research getElementsByTagAndClassName <<<
//alert(sections.length); //sections.length is coming up as a zero in all tested cases, is this old code? only fires when loading Chinese menu, but not first Eng menu, only 2nd.. -sv
for (var i = 0; i < sections.length; i++) {
	var isExpandaTab = sections[i].getAttribute("expandable") == null ? false : true;
	var s = "";
	s += '<a id="section' + i + '"></a><table width="100%" class="mtable" ' + (isExpandaTab ? 'cellpadding=0 cellspacing=0 style="margin:0px"' : '') + '>';
	var title = '' + (i + 1) + '. ' + sections[i].getAttribute("name");
	if (sections[i].getAttribute("time") != null && sections[i].getAttribute("time") != "") {
		title += ' (' + sections[i].getAttribute("time") + ' min)';
	}
	if (!isExpandaTab) {
		s += '<tr><td class="mtitle">' + title + '</td></tr>';
	}
	s += '<tr><td name="mtext" class="b1">';

	// Rewrite anchor URLs
	c = sections[i].getElementsByTagName("a");
	//alert(c); << troubleshooting attempt, this is not firing -sv
	for (var j = 0; j < c.length; j++) {
		PREVIEWS[PREVIEWS.length] = c[j].href;
		if (c[j].href.substr(0, c[j].href.lastIndexOf("/")) != window.location.href.substr(0, window.location.href.lastIndexOf("/")))
			alert("Warning: All resources should be in the same folder as the HTML file they belong to! - " + c[j].href);
		c[j].href = "javascript:PREVIEWIX=" + (PREVIEWS.length - 1) + ";updatePreview();";
	}
	s += addDefinitions(sections[i].innerHTML, definitions);
	s += '</td></tr></table>';
}

// Update the preview image, description and buttons.
function updatePreview() {//alert("updatePreview func");  //<< this section isn't firing b/c it is only called by above code, which isn't firing b/c sections is always zero
	fname = PREVIEWS[PREVIEWIX].substr(PREVIEWS[PREVIEWIX].lastIndexOf("/") + 1);
	// If the preview doesn't exist, hide image.
	pfname = PREVIEWS[PREVIEWIX].substr(0, PREVIEWS[PREVIEWIX].lastIndexOf(".")) + ".jpg";

	if (pfname.substr(7, 8) == DEVBOOTH) {
		pfname = pfname.replace(new RegExp('/', 'gi'), '\\');
		pfname = unescape(pfname.substr(5));	// Damn you IE! Stop rewriting my relative paths into file:/// urls!!
	}
	else {
		pfname = unescape(pfname.substr(8));	// Damn you IE! Stop rewriting my relative paths into file:/// urls!!
		//alert(pfname);
	}

	try {
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		document.getElementById("preview").style.display = fso.FileExists(pfname) ? "inline" : "none";
	} catch (e) {
		alert("Warning: Your webbrowser's security settings are too high.\nCannot create ActiveX Scripting.FileSystemObject.\nPlease inform Development.");//\nPlease lower your browsers security settings.");
		document.getElementById("preview").style.display = "inline";
	}

	document.getElementById("preview").src = pfname;
	document.getElementById("previewinfo").innerHTML = unescape(fname.substr(0, fname.lastIndexOf(".")));
	document.getElementById("previewNext").disabled = ((PREVIEWIX + 1) >= PREVIEWS.length) ? true : false;
	document.getElementById("previewLast").disabled = (PREVIEWIX <= 0) ? true : false;
	document.getElementById("previewNext").style.background = ((PREVIEWIX + 1) >= PREVIEWS.length) ? "E0E0E0" : "FFFFFF";
	document.getElementById("previewLast").style.background = (PREVIEWIX <= 0) ? "E0E0E0" : "FFFFFF";

	if (!PREVIEWMODE) {
		loadRsrc(PREVIEWS[PREVIEWIX]);
	}
}

function addDefinitions(txt, defs) {
	for (var i = 0; i < defs.length; i++) {
		var term = defs[i].getAttribute("term");
		var popup = "<span class='defn' onMouseOver='showDefn(this,true);' onMouseOut='showDefn(this,false);'>" +
			"<span class='defnContainer'><span class='defnContent'>" +
			"<font color='#ff0000'><b><i>" + term + ":</i></b></font> " + defs[i].getAttribute("defn") +
			"</span></span>" + term + "</span>";
		var re = new RegExp(term, "g");
		txt = txt.replace(re, popup);
		/**
		* The above code fixes the Will Bug.  The following code will allow only a single instance of a definition to appear per section.
		* This change was made to correct a rendering problem for terms that occur within another deff.
		* For example AFPInt09, greenhouse gases and greenhouse effect.
		*/
	}
	return txt;
}

function lessonLinks() {
	if (!document.getElementById("lessonchoosercat")) document.getElementById('lessonchooser').innerHTML = lessonChooser();
	else document.getElementById('lessonchoosercat').innerHTML = lessonChooserCAT();
	// added the following lines 2015/01/24 STV
	if (document.getElementById('engcatLUinfo')) document.getElementById('engcatLUinfo').innerHTML = engcatLUinfo();
	if (document.getElementById('engcatLCinfo')) document.getElementById('engcatLCinfo').innerHTML = engcatLCinfo();
}

function PermissionGranted() {
	location.replace('zlesson.htm');
}

function GenerateLessonList() {
	document.getElementById("LessonList").innerHTML = LessonBuilder();
}

function AllSeasons() {
	document.getElementById("LessonList").innerHTML = ShowItAll();
}

function showNextLevelLC(thisLink, levelLength) {
	for (i = 0; i < levelLength; i++) {
		if (document.getElementById(thisLink).style.display == 'block') {
			document.getElementById(thisLink).style.display = 'none';
		}
		else {
			document.getElementById(thisLink).style.display = 'block';
		}
	}
}

// THIS CODE WAS ADDED THE 18-09-2019 for new wordbank, uncomment to enable

/*
function dynamicallyLoadScript(url) {
		var script = document.createElement("script");  // create a script DOM node
		script.src = url;  // set its src to the provided URL

		document.head.appendChild(script);  // add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}

function addWordBank() {

	var lessonFileName = window.location.href.split('/');
	lessonFileName = lessonFileName[lessonFileName.length-1];
	lessonFileName = lessonFileName.split('.');
	lessonFileName = lessonFileName[0];
	lessonFileName += '.js';


	dynamicallyLoadScript('file:///C:/NOVA/online/teaching/english/zlesson/wordbanks/' + lessonFileName);

}
*/

// Must be used for Chrome!!
function checkStatus(file){
	const http = new XMLHttpRequest();
	try{
		http.open('HEAD',file,false);
		http.send();
	}
	catch(e){};
	return !(http.status >= 200 && http.status < 300);
}

/**
 * Revamp box messages.
 */
const messages = {
	'students-contribute':
		`<p><strong>PLEASE MAKE SURE YOU HAVE STUDENTS UN-MUTE AND CONTRIBUTE TO <u>TWO</u> OF THE FOLLOWING LESSON STAGES <u>PRIOR TO THE PRACTICE STAGE</u>:</strong></p>
		<p><strong>Introduction:</strong> e.g.:
			<ul>
			<li>to say who/where/what they see in the picture; </li>
			<li>to imagine what will be heard; </li>
			<li>to confirm the answer to the focus task you set for the intro listening</li>
			</ul>
		</p>
		<p><strong>Language:</strong> e.g.:
			<ul>
			<li>to perform a drill;</li>
			<li>to suggest other, related words or phrases;</li>
			<li>to make an original sentence using the target language</li>
			</ul>
		</p>
		<p><strong>Listening:</strong> e.g.:
			<ul>
			<li>to imagine or predict what will be heard;</li>
			<li>to confirm the answer to the listening task;</li>
			<li>to report what they heard;</li>
			<li>to recreate parts of the dialogue or monologue</li>
			</ul>
		</p>`,
	'students-contribute-5b':
		`<p><strong>To All Live Station Instructors</strong></p>

		<p>Although standard Level 5 lessons remain <u>mics-OFF</u> for students,
		please be sure that your lesson features at least <u>TWO</u> of the following teaching techniques:</p>
		<ul>
		<li>A <b><i>drill</i></b> that\'s not a standard substitution drill</li>
		<li>Using the <b><i>whiteboard</i></b> to visually illustrate or demonstrate the language point.</li>
		<li><b><i>Extra vocabulary</i></b> (words, phrases, fillers, responses) from outside of the textbook</li>
		<li>A focus on <b><i>natural pronunciation</i></b>, with whiteboard support</li>
		<li>Opportunities for students to <b><i>personalize</i></b> the material</li>
		</ul>
		<p>If you need any advice or ideas, please approach a member of the Contents team</p>
		<p>Thank you.</p>`,

  'students-contribute-6b':
		`<p><strong>To All Live Station Instructors</strong></p>
		<p>Please note the following expectations for all NLS lessons:</p>
		<p><b>1. Student involvement -</b> In levels 6 & above, students should be asked to unmute & contribute to
		the <u>Introduction</u>, <u>Language</u>, <u>Listening</u> (pre- and/or post-listening), and <u>Practice</u> stages.</p>
		<p><b>2. Teaching techniques -</b> Each lesson should feature at least <u>two</u> of the following.</p>
		<ul>
		<li>A <b><i>drill</i></b> that\'s not a standard substitution drill</li>
		<li>Using the <b><i>whiteboard</i></b> to visually illustrate or demonstrate the language point.</li>
		<li><b><i>Extra vocabulary</i></b> (words, phrases, fillers, responses) from outside of the textbook</li>
		<li>A focus on <b><i>natural pronunciation</i></b></li>
		<li>Opportunities for students to <b><i>personalize</i></b> the material</li>
		</ul>
		<p>If you need any advice or ideas, please approach a member of the Contents team</p>
		<p>Thank you.</p>`,

	'students-contribute-5c':
		`<p><strong>To All Live Station Instructors</strong></p>

		<p>Although standard Level 5 lessons remain <u>mics-OFF</u> for students,
		please be sure that your lesson features at least <u>TWO</u> of the following teaching techniques:</p>
		<ul>
		<li>A <b><i>drill</i></b> that\'s not a standard substitution drill</li>
		<li>Using the <b><i>whiteboard</i></b> to visually illustrate or demonstrate the language point.</li>
		<li><b><i>Extra vocabulary</i></b> (words, phrases, fillers, responses) from outside of the textbook</li>
		<li>A focus on <b><i>natural pronunciation</i></b>, with whiteboard support</li>
		<li>Opportunities for students to <b><i>personalize</i></b> the material</li>
		</ul>
		<p>If you need any advice or ideas, please approach a member of the Contents team</p>
		<b>You can also click on <a href="#" onclick="return showInfo(\'ideas\');">"Ideas"</a>
		for specific suggestions for this lesson.</b>
		<p>Thank you.</p>`,

	'students-contribute-6c':
		`<p><strong>To All Live Station Instructors</strong></p>
		<p>Please note the following expectations for all NLS lessons:</p>
		<p><b>1. Student involvement -</b> In levels 6 & above, students should be asked to unmute & contribute to
		the <u>Introduction</u>, <u>Language</u>, <u>Listening</u> (pre- and/or post-listening), and <u>Practice</u> stages.</p>
		<p><b>2. Teaching techniques -</b> Each lesson should feature at least <u>two</u> of the following.</p>
		<ul>
		<li>A <b><i>drill</i></b> that\'s not a standard substitution drill</li>
		<li>Using the <b><i>whiteboard</i></b> to visually illustrate or demonstrate the language point.</li>
		<li><b><i>Extra vocabulary</i></b> (words, phrases, fillers, responses) from outside of the textbook</li>
		<li>A focus on <b><i>natural pronunciation</i></b></li>
		<li>Opportunities for students to <b><i>personalize</i></b> the material</li>
		</ul>
		<p>If you need any advice or ideas, please approach a member of the Contents team</p>
		<b>You can also click on <a href="#" onclick="return showInfo(\'ideas\');">"Ideas"</a>
		for specific suggestions for this lesson.</b>
		<p>Thank you.</p>`,

	'students-contribute-8c':
		`<p><strong>To All Live Station Instructors</strong></p>
		<p>Please note the following expectations for all NLS lessons:</p>
		<p><b>1. Student involvement -</b> In levels 6 & above, students should be asked to unmute & contribute to
		the <u>Introduction</u>, <u>Language</u>, <u>Listening</u> (pre- and/or post-listening), and <u>Practice</u> stages.</p>
		<p><b>2. Teaching techniques -</b> Each lesson should feature at least <u>two</u> of the following.</p>
		<ul>
		<li>A <b><i>drill</i></b> that\'s not a standard substitution drill</li>
		<li>Using the <b><i>whiteboard</i></b> to visually illustrate or demonstrate the language point.</li>
		<li><b><i>Extra vocabulary</i></b> (words, phrases, fillers, responses) from outside of the textbook</li>
		<li>A focus on <b><i>natural pronunciation</i></b></li>
		<li>Opportunities for students to <b><i>personalize</i></b> the material</li>
		</ul>
		<p>If you need any advice or ideas, please approach a member of the Contents team</p>
		<p>Thank you.</p>`,

  'students-poll-none':
		`INSTRUCTORS PLEASE NOTE!<br>
    You won't need any polls for this lesson.`,

  'students-poll-ab':
		`INSTRUCTORS PLEASE NOTE!<br>
    You will need an "A or B?" poll for this lesson.`,

  'students-poll-abc':
		`INSTRUCTORS PLEASE NOTE!<br>
    You will need an "A, B, or C?" poll for this lesson.`,

  'students-poll-abcd':
		`INSTRUCTORS PLEASE NOTE!<br>
    You will need an "A, B, C, or D?" poll for this lesson.`,

  'students-poll-abcde':
		`INSTRUCTORS PLEASE NOTE!<br>
    You will need an "A, B, C, D, or E?" poll for this lesson.`,
}
// Duplicate the messages for other levels.
messages['students-contribute-7c'] = messages['students-contribute-6c'];
messages['students-contribute-9c'] = messages['students-contribute-8c'];

function pointBox(element) {
  this.element = element;

  this.loadPollMessage = function() {
    this.element.innerHTML = messages[this.element.dataset.message];
  }
  this.revealPointBox = function() {
    this.element.classList.remove("studentPollBox");
  }
  if(this.element) {
    this.loadPollMessage();
    this.revealPointBox();
  }
  return this;
}

window.addEventListener("load", function (event) {
  pointBox(window.document.querySelector('.studentPollBox'));
});

function revampBox(element) {
  this.element = element;

  this.loadRevampMessage = function() {
    this.element.innerHTML = messages[this.element.dataset.message];
  }
  this.revealRevampBox = function() {
    this.element.classList.remove('revamp-box-unloaded');
  }

  if(this.element) {
    this.loadRevampMessage();
    this.revealRevampBox();
  }
  return this;
}

window.addEventListener("load", function (event) {
  revampBox(window.document.querySelector('.revamp-box-unloaded'));
});

function wrapSelection(selection, ...classList) {
	for (let i = 0; i < selection.length; i++) {
		const item = selection[i];
		// create a wrapper
		const wrapper = document.createElement("div");
		classList.forEach(element => {
			wrapper.classList.add(element);
		});
		// https://attacomsian.com/blog/javascript-insert-element-before
		// wrap the element
		item.parentNode.insertBefore(wrapper, item);
		wrapper.appendChild(item);
	}
}

window.addEventListener("load", function (event) {
  wrapSelection(window.document.querySelectorAll('img[onclick^=loadVideoBg]'), "bg-link", "bg-video");
  wrapSelection(window.document.querySelectorAll('img[onclick^=loadImageBg]'), "bg-link", "bg-image");
  initImageClickHandler();
});

function initImageClickHandler() {
	let element = document.body;
	element.addEventListener('click', (e) => {
		if(e.target.tagName === 'IMG' && !!e.target.attributes.onclick) {
			const allElements = document.querySelectorAll('IMG');
			allElements.forEach((element) => {
				element.classList.remove('img-clicked');
			});
			e.target.classList.add('img-clicked');
		}
	});
}

function navigateToNextPage(path = window.location.href) {
  // Match for numeric format: e.g., path/to/file/lesson-01.htm
  const numericMatch = path.match(/^(.*?)(\d+)(\.htm.*)$/);
  // Match for alphanumeric format: e.g., path/to/file/busBeg-1a.htm
  const alphaMatch = path.match(/^(.*?)(\d+)([a-z]?)(\.htm.*)$/);

  if (numericMatch) {
    window.location.href = [numericMatch[1], incrementPageNumber(numericMatch[2]), numericMatch[3]].join('');
  } else if (alphaMatch) {
    if (alphaMatch[3] === "a") {
      alphaMatch[3] = "b";
      window.location.href = [alphaMatch[1], alphaMatch[2], alphaMatch[3], alphaMatch[4]].join('');
    } else if (alphaMatch[3] === "b") {
      alphaMatch[3] = "a";
      window.location.href = [alphaMatch[1], incrementPageNumber(alphaMatch[2]), alphaMatch[3], alphaMatch[4]].join('');
    }
  }
}

function incrementPageNumber(number) {
  let num = parseInt(number, 10);
  num += 1;
  return `${num}`.padStart(number.length, '0');
}

function insertNextLink() {
  document.write(`
    <div class="flex-next-lesson">
      <button class="segueLink" onclick="navigateToNextPage()">Next Lesson <span class="arrow-size">&#8667;</span></button>
    </div>
  `);
}

// Show and hide sections, moved from Recent News
function showSectionA() {
	document.getElementById("section-a").style.display = "block";
	document.getElementById("section-b").style.display = "none";
	document.getElementById("topic-chooser").scrollIntoView({block:"start", behavior:"smooth"});
}

function showSectionB() {
	document.getElementById("section-a").style.display = "none";
	document.getElementById("section-b").style.display = "block";
	document.getElementById("topic-chooser").scrollIntoView({block:"start", behavior:"smooth"});
}
