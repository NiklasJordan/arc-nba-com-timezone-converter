function convertETtoUTCPlus1(timeString) {
    // Determine if we are in Daylight Saving Time in the ET timezone
    const isDaylightSaving = () => {
        const today = new Date();
        const jan = new Date(today.getFullYear(), 0, 1).getTimezoneOffset();
        const jul = new Date(today.getFullYear(), 6, 1).getTimezoneOffset();
        return Math.max(jan, jul) != today.getTimezoneOffset(); 
    };

    // CHANGE THE OFFSET FOR DESIRED TIMEZONE (Default for CET)
    const offset = isDaylightSaving() ? 5 : 6; // ET is UTC-4 during DST, else UTC-5

    // Updated regex pattern to correctly capture hours, minutes, and meridiem
    const match = timeString.match(/(\d{1,2}):(\d{2})\s*([AP]M)\s*ET/i);
    if (!match) return timeString; // Return original if format doesn't match

    let [_, hours, minutes, meridiem] = match;
    hours = parseInt(hours);
    minutes = parseInt(minutes);

    // Convert to 24-hour time
    if (meridiem.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (meridiem.toLowerCase() === "am" && hours === 12) hours = 0;

    // Convert to desired timezone
    hours += offset;
    if (hours >= 24) hours -= 24;

    // Format the time back to a string
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} (CET)`;
}

function getTimeElements() {
 return document.querySelectorAll(".ScoreStripGame_gameInfoText__tlx_V, .ScheduleStatusText_base__Jgvjb, .GameCardMatchupStatusText_gcsText__PcQUX");
}

function getBroadcasterElements() {
  return document.querySelectorAll(".ScoreStripGame_broadcasters__NU0f2");
}

function applyNewInfo() {
 let elementsTime = getTimeElements();
    elementsTime.forEach(element => {
        const originalTime = element.textContent;
        const newTime = convertETtoUTCPlus1(originalTime);
        element.textContent = newTime;
    });
    
  let elementsBroadcaster = getBroadcasterElements();
  elementsBroadcaster.forEach(element => {
 element.style.display = 'none';
  });
}

window.addEventListener("load", () => {
    applyNewInfo();
})