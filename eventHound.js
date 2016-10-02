function formatHours(hours) {
	return (hours > 12) ? hours - 12 : hours;
};
function formatAmPm(hours) {
	return (hours >= 12) ? "pm" : "am";	
};
function formatMinutes(mins) {
	var minString = new String(mins);
	return (minString.length === 1) ? "0" + minString : minString;	
};
function getTimeString(date) {
	var hours = date.getHours();
	var mins = date.getMinutes();
	var timeStr = formatHours(hours) + ":" + formatMinutes(mins) + formatAmPm(hours);
	return timeStr;
};
function addEventLine(lineText, isBreak, section) {
	var resultDiv = document.getElementById(section);
	var newChild;
	
	if (isBreak) {
		newChild = document.createElement("br");
	} else {
		newChild = document.createElement("div");
		newChild.appendChild(document.createTextNode(lineText));
	}
	resultDiv.appendChild(newChild);
};
function addEventLineBold(lineText, prefixText, section) {
	var resultDiv = document.getElementById(section);
	var newChild;
	var newBoldChild;

	newChild = document.createElement("div");
	newBoldChild = document.createElement("b");
	newBoldChild.appendChild(document.createTextNode(prefixText));
	newChild.appendChild(newBoldChild);				
	newChild.appendChild(document.createTextNode(lineText));

	resultDiv.appendChild(newChild);
};
function addEventUrlLine(lineText, lineUrl, section) {
	var resultDiv = document.getElementById(section);
	var newChild;
	
	newChild = document.createElement("div");
	newAnchorChild = document.createElement("a");
	newAnchorChild.setAttribute("href", lineUrl);
	newAnchorChild.appendChild(document.createTextNode(lineText));
	newChild.appendChild(newAnchorChild);

	resultDiv.appendChild(newChild);
};
function readError(errorMessage) {
	alert("Search failed (status: " + errorMessage + ")");
};
function getLocString(event){
	var locLine = "";
	if (event.locations && event.locations.length > 0) {
		var location = event.locations[0];
		
		if (location.name != location.address1) {
			locLine = location.name + ", ";
		}
		if (location.address1.trim().length > 0) {
			locLine = locLine + location.address1 + ", ";
		}
		if (location.address2.trim().length > 0) {
			locLine = locLine + location.address2 + ", ";
		}
		locLine = locLine + location.city + ", " + location.state;
	}
	return locLine;
}
function readResponse(response){

};
function addEvent(event, section){
	var eventName = event.name;
	addEventLineBold(eventName, "Event: ", section);

	var startDate = new Date(event.startDate);
	var endDate = new Date(event.endDate);
	addEventLineBold(startDate.toDateString(), "Date: ", section);
	
	locLine = getLocString(event);
	addEventLineBold(locLine, "Location: ", section);
	
	var eventTimeLine = "";
	eventTimeLine = getTimeString(startDate) + " - " + getTimeString(endDate);
	addEventLineBold(eventTimeLine, "Time: ", section);
	
	// https://www.hillaryclinton.com/events/view/{event.lookupId}
	var eventUrl = "https://www.hillaryclinton.com/events/view/" + event.lookupId;
	if (LINKIFY) {
		addEventUrlLine(eventUrl, eventUrl, section);
	} else {
		addEventLine(eventUrl, false, section);
	}
	addEventLine("", true, section);
};
function searchLocation(loc, start, end){
	var eventSearch = typeof XMLHttpRequest != 'undefined'
		? new XMLHttpRequest()
		: new ActiveXObject('Microsoft.XMLHTTP');

	eventSearch.responseType = "json";
	var url = "https://www.hillaryclinton.com/api/events/events?" + loc + "&status=confirmed&visibility=public&perPage=300&onepage=1&sortBy=start_date&sortDir=asc&radius=10&earliestTime=" + start + "&latestTime=" + end + "&_=1474773712221";

	eventSearch.open("GET", url);
	eventSearch.onreadystatechange = function() {
		var status;
		var data;
		if (eventSearch.readyState == 4) {
			status = eventSearch.status;
			if (status >= 200 && status < 300) {
				//data = JSON.parse(eventSearch.responseText);
				readResponse(eventSearch.response);
			} else {
				readError(status);
			}
		}
	};
	eventSearch.send();
};