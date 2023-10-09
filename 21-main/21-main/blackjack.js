
var dealerSum = 0;//Сумма карт Диллера
var yourSum = 0;//Сумма ваших карт

var dealerAceCount = 0;//
var yourAceCount = 0; //Карты игрока

var hidden;
var deck;

var canHit = true; //Можно нажимать кнопку 'Больше' пока значение YourSum <= 21

window.onload = function() {//запуск функций:Построить коллоду, перемешать коллоду, начать игру
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() { //Фунция добавления коллоды
    var values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];//Добавление значения карт
    var types = ["C", "D", "H", "S"];
    deck = [];

    for (var i = 0; i < types.length; i++) {
        for (var j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}
//Функция получения стартовой руки
function shuffleDeck() {
    for (var i = 0; i < deck.length; i++) {
        var j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        var temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}
//Функция старта игры
function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);//Cумма карт диллера = скрыть
    dealerAceCount += checkAce(hidden);//после вскрытия показать скрытое значение
    // console.log(hidden);
    // console.log(dealerSum);
    while (dealerSum < 17) {  //Если сумма карт диллера < 17, то выдать еще одну карту
        //<img src="./cards/4-C.png">
        var cardImg = document.createElement("img");//создание картинки карты
        var card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";//выбор картинки карты в соотвествии с ее значение
        dealerSum += getValue(card);//выдать карты диллеру
        dealerAceCount += checkAce(card);//проверить карты диллера
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (var i = 0; i < 2; i++) { //
        var cardImg = document.createElement("img");
        var card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById('retry').style.visibility='hidden'; // скрытая кнопка перезапуска игры
    document.getElementById("hit").addEventListener("click", hit);//вызвать действие Hit, при нажатии на кнопку
    document.getElementById("stay").addEventListener("click", stay);//вызвать действие stay, при нажатии на кнопку
    document.getElementById('retry').addEventListener("click", retry);

}

function hit() { //функция hit = выдать еще одну карту игроку
    if (!canHit && yourAceCount <= 21) {
        return;
    }

    var cardImg = document.createElement("img");
    var card = deck.pop();
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    if (reduceAce(yourSum, yourAceCount) >= 21) { //A, J, 8 -> 1 + 10 + 8 // игрок не может нажать кнопку hit
        canHit = false;//если сумма его карт >21
        var message = "You can't take another card"
        document.getElementById("message").innerText = message
    }




}

function stay() { //Функция stay = она же хватит, она же вскрываемся P.S. образно говоря Hit= Еще, Stay = Вскрываемся просто так выглядит цивильней
    dealerSum = reduceAce(dealerSum, dealerAceCount);//Показать карты диллера, а также их сумма
    yourSum = reduceAce(yourSum, yourAceCount);//Показать карты диллера, а также их сумма

    canHit = false;
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
    document.getElementById('retry').style.visibility='visible';

    var message = "";
    if (yourSum > 21) {
        message = "looooooser!";//Если сумма карт превышает 21 вы проиграли
    }
    else if (dealerSum > 21) { //Или сумма карт диллера >21, то вы победили
        message = "Victory!";
    }
    //Если вы и диллер имеете <= 21, то ничья
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "Victory!";
    }
    else if (yourSum < dealerSum) {
        message = "Dealer are victory!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    var data = card.split("-"); // "4-C" -> ["4", "C"]
    var value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") { //по правилам игры туз имеет значение 11, но при наличии в руке 2 туза то второй туз = 12
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") { //проверка наличия тузов в руке
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) { //функция подсчета очков которые дают тузы в руке
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function retry()
{
    location.reload()
}