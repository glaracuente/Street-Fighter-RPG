var introSound = new Audio('assets/sounds/introSound.mp3');
var blanka = new Audio('assets/sounds/blanka.mp3');
var ryu = new Audio('assets/sounds/hadoken.mp3');
var guile = new Audio('assets/sounds/sonicboom.mp3');
var dhalsim = new Audio('assets/sounds/yoga_flame.mp3');
var fight = new Audio('assets/sounds/fight.mp3');
var perfect = new Audio('assets/sounds/perfect.mp3');
var youlose = new Audio('assets/sounds/youlose.mp3');
var youwin = new Audio('assets/sounds/youwin.mp3');
var select = new Audio('assets/sounds/select.mp3');


$(document).ready(function () {
    var fighterNames = ["Ryu", "Blanka", "Guile", "Dhalsim"];
    var fighterHPs = [300, 350, 275, 325];
    var fighterAttacks = [30, 20, 15, 10];
    var fighterCounters = [25, 40, 45, 20];
    var fighterObjects = [];
    var yourChar;
    var currentEnemy;

    var initCharObjects = function () {
        console.log("initcharobjects")
        fighterObjects = [];

        for (var i = 0; i < fighterNames.length; i++) {
            var fighter = {
                name: "",
                pic: "",
                back: "",
                health: 0,
                attackPower: 0,
                baseAttackPower: 0,
                counter: 0,
                attack: function () {
                    this.attackPower = this.attackPower + this.baseAttackPower;
                },
                setBaseAttackPower: function () {
                    this.baseAttackPower = this.attackPower;
                }
            };

            fighter.name = fighterNames[i];
            fighter.back = "assets/images/back_" + fighterNames[i].toLowerCase() + ".png";
            fighter.pic = "assets/images/" + fighterNames[i].toLowerCase() + ".png";
            fighter.health = fighterHPs[i];
            fighter.attackPower = fighterAttacks[i];
            fighter.counter = fighterCounters[i];
            fighter.setBaseAttackPower();
            fighterObjects.push(fighter);
        }
    }

    var initHTML = function () {
        console.log("inithtml")
        for (var i = 0; i < fighterObjects.length; i++) {
            var pretext = $("#pregametext")
            pretext.html("<h6>CHOOSE YOUR CHARACTER:</h6>")
            var fighterDisplay = $("<section>")
            fighterDisplay.addClass("fighterBox")
            var fighterName = $("<div>")
            fighterName.addClass("fighterName")
            fighterName.text(fighterObjects[i].name)
            var fighterImg = $("<img>")
            fighterImg.addClass("fighterImg")
            fighterImg.attr("src", fighterObjects[i].pic)
            var fighterHP = $("<div>")
            fighterHP.addClass("fighterHP")
            fighterHP.text(fighterObjects[i].health)
            //$("#win-lose").html("<h2>Winner!</h2>") CAN TRY THIS TOO
            fighterDisplay.append(fighterName)
            fighterDisplay.append(fighterImg)
            fighterDisplay.append(fighterHP)
            fighterDisplay.data("fighter", fighterObjects[i])
            $("#pregame").append(fighterDisplay)
        }

        $("#restartButton").css('visibility', 'hidden')
        $("#attackButton").css('visibility', 'hidden')
        $("#fightRing").css('visibility', 'hidden')
        $("#bottom").css('visibility', 'hidden')

        $("#info").empty()
        $("#yourCharacter").empty()
        $("#enemyRoster").empty()
        $("#defender").empty()
    }

    initCharObjects();
    initHTML();



    $(".fighterImg").on("click", function () {
        console.log("clicking fighter img")
    })


    $(".fighterBox").on("click", function () {
        console.log("clicking fighter box")
        if ($("#pregame")[0].childElementCount === 4) {
            $("#pregametext").empty()
            introSound.play()
            $("#yourCharacter").append($(this))
            $($($("#yourCharacter")[0].firstChild).find(".fighterName")).css({ "background-color": "rgb(37, 3, 128)", "color": "white" })
            $($($("#yourCharacter")[0].firstChild).find(".fighterHP")).css({ "background-color": "rgb(37, 3, 128)", "color": "white" })
            yourChar = jQuery.data($("#yourCharacter")[0].firstChild, "fighter")
            $("#fightRing").css('background-image', "url(" + yourChar.back + ")")
            $("#fightRing").css('visibility', 'visible')
            $("#bottom").css('visibility', 'visible')
            $("#enemyRoster").append($("#pregame").children().detach())
        }
        //move enemy to defense area...only if clicking on a fighter in enemy roster, and there is no current defender
        else if ($("#enemyRoster").has($(this)).length && $("#defender")[0].childElementCount === 0) { //WHY DO I NEED LENGTH FOR THIS TO WORK PROPERLY?
            //make attack button appear only when the first defender is chosen
            if ($("#enemyRoster")[0].childElementCount === 3) {
                $("#attackButton").css('visibility', 'visible')
            }
            $("#defender").append($(this))
            $($($("#defender")[0].firstChild).find(".fighterName")).css({ "background-color": "red", "color": "black" })
            $($($("#defender")[0].firstChild).find(".fighterHP")).css({ "background-color": "red", "color": "black" })
            $($($("#defender")[0].firstChild).find(".fighterImg")).addClass("img-hor")
            $($("#enemyRoster")[0].children).css({ "background-color": "black", "color": "white" })
            currentEnemy = jQuery.data($("#defender")[0].firstChild, "fighter")
            eval(currentEnemy.name.toLowerCase()).play()
        }
    });



    $("#attackButton").on("click", function () {
        if ($("#defender")[0].childElementCount === 0) {
            select.play()
            $("#info").html("<p>No enemy here.</p>")
            return;
        }

        fight.play()

        $("#info").html("<p>You attacked " + currentEnemy.name + " for " + yourChar.attackPower + " damage.</p><p>" + currentEnemy.name + " attacked you back for " + currentEnemy.counter + " damage.</p>")
        currentEnemy.health = currentEnemy.health - yourChar.attackPower
        $(".fighterHP", $("#defender")[0].firstChild).text(currentEnemy.health)

        if (currentEnemy.health <= 0) {
            $("#info").html("<p>You have defeated " + currentEnemy.name + ", you can choose to fight another enemy.</p>")
            $("#defender").empty()
        }

        if ($("#enemyRoster")[0].childElementCount === 0 && $("#defender")[0].childElementCount === 0) {
            $("#info").html("<p>You won!!!! GAME OVER!!!</p>")
            $("#restartButton").css('visibility', 'visible')
            $("#attackButton").css('visibility', 'hidden')
            return;
        }

        yourChar.attack()
        yourChar.health = yourChar.health - currentEnemy.counter
        $(".fighterHP", $("#yourCharacter")[0].firstChild).text(yourChar.health)

        if (yourChar.health <= 0) {
            $("#info").html("<p>You have been defeated...GAME OVER!!!</p>")
            $("#yourCharacter").empty()
            $("#restartButton").css('visibility', 'visible')
            $("#attackButton").css('visibility', 'hidden')
            return;
        }
    });


    $("#restartButton").on("click", function () {
        //console.log($("#pregame")[0].childElementCount);
        //console.log($("#pregame"));
        //initCharObjects();
        //initHTML();
        //console.log($("#pregame")[0].childElementCount);
        //console.log($("#pregame"));
        location.reload(); //HACK!!!!!
    });

});

    //RESTART HACK FIX
    // NEED TO MAKE VARIABLE NAMES BETTER
    // FUNCTIONS AND VARIABLES TO MAKE CODE MORE READABLE/EFFICIENT





