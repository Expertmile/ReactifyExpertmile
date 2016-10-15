export default function makeAgo(timestamp){
    var difference = (new Date().getTime() /1000) - timestamp;
    var periods = ["s", "m", "h", "d", "w", "m", "y", "d"];
    var lengths = ["60","60","24","7","4.35","12","10"];
    for(var j = 0; difference >= lengths[j]; j++) {
        difference = difference / lengths[j];
        difference = Math.round(difference);
    }
    if(periods[j] === "s") {
        var text = "just now";
    } else {
        var text = difference + "" + periods[j];
    }
    return text;
}