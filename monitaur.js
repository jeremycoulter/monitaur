/*!
 * Monitaur v0.0.1 (https://github.com/jeremycoulter/monitaur)
 * Copyright 2018 Jeremy Coulter (https://jeremycoulter.github.io)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*
 * constants
 */
var DEVELOPER_API_KEY = "67717ca4d7209a13a5e9061c3d0a58f5";
var DEVELOPER_TOKEN = "53a3e070da0bcb2ef5701a96ebe5e817dc9d308dd1d04c61d84d58f1caae05e6";
var BOARD_ID = "5be1eae722a847542bdeeb8e";

/*
 * startup function calls
 */
printCurrentDate();
printTrelloCards();

/*
 * function definitions
 */
function printCurrentDate() {
    var date = new Date();
    document.getElementById('currentDate').innerHTML = date;
}

function dateLeftZeroPad(date) {
    if (date < 10) {
        return "0" + date;
    } else {
        return date;
    }
}

function printTrelloCards() {
    var cardsObject;
    var cardsHtml = '<ul class="list-group">';
    var date = new Date();
    var todayString = date.getFullYear() + "-" + dateLeftZeroPad(date.getMonth() + 1) + "-" + dateLeftZeroPad(date.getDate());
    var todayCardCount = 0;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cardsObject = JSON.parse(this.responseText);

            for (var i = cardsObject.length - 1; i >= 0; i--) {
                if (todayString == cardsObject[i].dateLastActivity.substring(0, 10)) {
                    todayCardCount++;
                    cardsHtml += '<li class="list-group-item d-flex align-items-center">' +
                        '<span class="badge badge-primary badge-pill badge-monitaur">' +
                        cardsObject[i].name.substring(0, 4) +
                        '</span>' +
                        cardsObject[i].name.substring(5).toUpperCase() +
                        '</li>';
                }
            }

            if (todayCardCount == 0) {
                cardsHtml += '<li class="list-group-item d-flex align-items-center">' +
                    'No events have been logged today.' +
                    '</li>';
            }

            cardsHtml += '</ul>';
            document.getElementById('trelloCards').innerHTML = cardsHtml;
        }

    };
    xhttp.open("GET", "https://api.trello.com/1/boards/" + BOARD_ID + "/cards?key=" + DEVELOPER_API_KEY + "&token=" + DEVELOPER_TOKEN, true);
    xhttp.send();
}