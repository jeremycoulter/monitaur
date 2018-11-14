/*!
 * Monitaur v0.0.11 (https://github.com/jeremycoulter/monitaur)
 * Copyright 2018 Jeremy Coulter (https://jeremycoulter.github.io)
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*
 * constants
 */
var CURRENT_VERSION = "0.0.11";

var DEVELOPER_API_KEY = "67717ca4d7209a13a5e9061c3d0a58f5";
var DEVELOPER_TOKEN = "53a3e070da0bcb2ef5701a96ebe5e817dc9d308dd1d04c61d84d58f1caae05e6";
var BOARD_ID = "5be1eae722a847542bdeeb8e";

/*
 * startup function calls
 */
printGreeting();
printCurrentDate();
printTrelloCards();
printCurrentVersion();
printCopyrightYear();

// enable tooltips
$(function() {
    $('[data-toggle="tooltip"]').tooltip();
});

/*
 * function definitions
 */
function printGreeting() {
    var greetings = ["Goeie dag", "Tungjatjeta", "Ahlan bik", "Nomoskar", "Selam", "Mingala ba", "Nín hao", "Zdravo", "Nazdar", "Hallo", "Hallo", "Helo", "Hei", "Bonjour", "Guten Tag", "Geia", "Shalóm", "Namasté", "Szia", "Hai", "Kiana", "Dia is muire dhuit", "Buongiorno", "Kónnichi wa", "Annyeonghaseyo", "Sabai dii", "Ave", "Es mīlu tevi", "Selamat petang", "Sain baina uu", "Namaste", "Hallo", "Salâm", "Witajcie", "Olá", "Salut", "Privét", "Talofa", "Ćao", "Nazdar", "Zdravo", "Hola", "Jambo", "Hej", "Halo", "Sàwàtdee kráp", "Merhaba", "Pryvít", "Adaab arz hai", "Chào"];
    var languages = ["Afrikaans", "Albanian", "Arabic", "Bengali", "Bosnian", "Burmese", "Chinese", "Croatian", "Czech", "Danish", "Dutch", "Filipino", "Finnish", "French", "German", "Greek", "Hebrew", "Hindi", "Hungarian", "Indonesian", "Iñupiaq", "Irish", "Italian", "Japanese", "Korean", "Lao", "Latin", "Latvian", "Malay", "Mongolian", "Nepali", "Norwegian", "Persian", "Polish", "Portuguese", "Romanian", "Russian", "Samoan", "Serbian", "Slovak", "Slovene", "Spanish", "Swahili", "Swedish", "Tagalog", "Thai", "Turkish", "Ukrainian", "Urdu", "Vietnamese"];
    var randy = Math.floor(Math.random() * 50);
    var languageString = greetings[randy] + ' is ' + languages[randy] + ' for Hello!';

    document.getElementById('greeting').innerHTML = '<a href="#" data-toggle="tooltip" title="' + languageString + '" data-original-title="' + languageString + '">' + greetings[randy] + '</a>!';
}

function printCurrentDate() {
    var date = new Date();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var daySuffixes = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"];
    var daySuffix;

    if (date.getDate() > 10 && date.getDate() < 20) {
        daySuffix = "th";
    } else {
        daySuffix = daySuffixes[date.getDate() % 10];
    }

    document.getElementById('currentDate').innerHTML = "Today is <strong>" +
        days[date.getDay()] + ", " +
        months[date.getMonth()] + " " +
        date.getDate() + daySuffix + ", " +
        date.getFullYear() + "</strong>.";
}

function printTrelloCards() {
    var cardsObject;
    var cardsHtml = '<ul class="list-group">';
    var cardDescription;

    var todayDate = new Date();
    var todayDateString = todayDate.getFullYear() + "-" + dateLeftZeroPad(todayDate.getMonth() + 1) + "-" + dateLeftZeroPad(todayDate.getDate());

    var todayCardCount = 0;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cardsObject = JSON.parse(this.responseText);

            for (var i = cardsObject.length - 1; i >= 0; i--) {
                if (todayDateString == offestDateTime(cardsObject[i].dateLastActivity)) {
                    todayCardCount++;
                    cardDescription = cardsObject[i].name.substring(5).toUpperCase();
                    cardsHtml += '<li class="list-group-item d-flex align-items-center list-group-item-monitaur">' +
                        '<span class="badge badge-primary badge-pill badge-monitaur">' +
                        convertTime(cardsObject[i].name.substring(0, 4)) +
                        '</span>' +
                        cardDescription +
                        getTaskIcon(cardDescription) +
                        '</li>';
                }
            }

            if (todayCardCount == 0) {
                cardsHtml += '<li class="list-group-item d-flex align-items-center">' +
                    'No tasks have been logged today.' +
                    '</li>';
            }

            cardsHtml += '</ul>';
            document.getElementById('trelloCards').innerHTML = cardsHtml;
        }

    };
    xhttp.open("GET", "https://api.trello.com/1/boards/" + BOARD_ID + "/cards?key=" + DEVELOPER_API_KEY + "&token=" + DEVELOPER_TOKEN, true);
    xhttp.send();
}

function printCurrentVersion() {
    document.getElementById('currentVersion').innerHTML = CURRENT_VERSION;
}

function printCopyrightYear() {
    document.getElementById('copyrightYear').innerHTML = new Date().getFullYear();
}

function dateLeftZeroPad(date) {
    if (date < 10) {
        return "0" + date;
    } else {
        return date;
    }
}

function offestDateTime(dateLastActivity) {
    var cardDate;
    var cardDateString;

    cardDate = new Date(dateLastActivity.substring(0, 4),
        parseInt(dateLastActivity.substring(5, 7), 10) - 1,
        dateLastActivity.substring(8, 10),
        dateLastActivity.substring(11, 13),
        dateLastActivity.substring(14, 16),
        dateLastActivity.substring(17, 19),
        dateLastActivity.substring(20, 23));

    cardDate.setMinutes(cardDate.getMinutes() - new Date().getTimezoneOffset());
    cardDateString = cardDate.getFullYear() + "-" + dateLeftZeroPad(cardDate.getMonth() + 1) + "-" + dateLeftZeroPad(cardDate.getDate());

    return cardDateString;
}

function convertTime(timeString) {
    var hour = parseInt(timeString.substring(0, 2));
    var minute = timeString.substring(2, 4);
    var suffix = "AM";

    if (hour == 0) {
        hour = 12;
    } else if (hour == 12) {
        suffix = "PM";
    } else if (hour > 12) {
        hour = hour - 12;
        suffix = "PM";
    }

    return hour + ":" + minute + suffix;
}

function getTaskIcon(description) {
    var keywords = ["breakfast", "brewery", "clean", "coffee", "development", "dinner", "documentation", "french", "gym", "laundry", "lunch", "meet", "monitaur", "piano", "pristiq", "pubsley", "shopping", "shower", "yardwork"];
    var iconHtml = "";

    for (var i = 0; i < keywords.length; i++) {
        if (description.includes(keywords[i].toUpperCase())) {
            iconHtml = '<img class="task-icon-right" src="./icons/' + keywords[i] + '.png" alt="' + keywords[i].toUpperCase() + '" />'
        }
    }

    return iconHtml;
}