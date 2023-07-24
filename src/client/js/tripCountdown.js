// function to obtain today's date
function todaysDate() {
    let now = new Date();
    let day = now.getDate();
    let month = now.getMonth() + 1; //January is 0, so we add +1 to match the normal calendar order
    let year = now.getFullYear();

    let today = day + "/" + month + "/" + year;

    return today //this says what day is it today
}

console.log('today is ' + todaysDate());


//function to obtain time to departure
function timeToDep(tripDate) {

    let dateFuture = new Date(tripDate);
    let todayDate = new Date();
    let dateDiff = dateFuture - todayDate;
    let timeInDays = Math.ceil(dateDiff / (1000 * 60 * 60 * 24)); //time is in milliseconds, so therefore the math

    return timeInDays //this says how many days do we have left till the departure
}

console.log('You are departing on your trip in ' + timeinDays + 'days')

//export function
export { timeToDep, todaysDate }