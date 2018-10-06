$(document).ready(function () {
    var introSound = new Audio('assets/introSound.mp3');
    console.log(introSound)
    var fighterNames = ["Ryu", "Blanka", "Guile", "Dhalsim"];
    var fighterHPs = [300, 350, 275, 325];
    var fighterAttacks = [30, 20, 15, 10];
    var fighterCounters = [25, 30, 45, 20];
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

    $(".fighterBox").on("click", function () {
        console.log("clicking fighter box") //why doesn't work after reset?????
        if ($("#pregame")[0].childElementCount === 4) {
            introSound.play();
            $("#pregametext").empty();
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
            //make attach button appear only when the first defender is chosen
            if ($("#enemyRoster")[0].childElementCount === 3) {
                $("#attackButton").css('visibility', 'visible')
            }
            $("#defender").append($(this))
            $($($("#defender")[0].firstChild).find(".fighterName")).css({ "background-color": "red", "color": "black" })
            $($($("#defender")[0].firstChild).find(".fighterHP")).css({ "background-color": "red", "color": "black" })
            $($($("#defender")[0].firstChild).find(".fighterImg")).addClass("img-hor")
            $($("#enemyRoster")[0].children).css({ "background-color": "black", "color": "white" })
            currentEnemy = jQuery.data($("#defender")[0].firstChild, "fighter")
        }
    });


    $("#attackButton").on("click", function () {
        if ($("#defender")[0].childElementCount === 0) {
            $("#info").html("<p>No enemy here.</p>")
            return
        }

        $("#info").html("<p>You attacked " + currentEnemy.name + " for " + yourChar.attackPower + " damage.</p><p>" + currentEnemy.name + " attacked you back for " + currentEnemy.counter + " damage.</p>")
        currentEnemy.health = currentEnemy.health - yourChar.attackPower
        yourChar.attack()
        yourChar.health = yourChar.health - currentEnemy.counter
        $(".fighterHP", $("#yourCharacter")[0].firstChild).text(yourChar.health)
        $(".fighterHP", $("#defender")[0].firstChild).text(currentEnemy.health)

        if (currentEnemy.health <= 0) {
            $("#info").html("<p>You have defeated " + currentEnemy.name + ", you can choose to fight another enemy.</p>")
            $("#defender").empty()
        }

        if (yourChar.health <= 0) {
            $("#info").html("<p>You have been defeated...GAME OVER!!!</p>")
            $("#restartButton").css('visibility', 'visible')
        }

        if ($("#enemyRoster")[0].childElementCount === 0 && $("#defender")[0].childElementCount === 0) {
            $("#info").html("<p>You won!!!! GAME OVER!!!</p>")
            $("#restartButton").css('visibility', 'visible')
        }

    });


    $("#restartButton").on("click", function () {
        //initCharObjects();
        //initHTML();
        location.reload(); //HACK!!!!!
    });

});


        //NEED TO MAKE VARIABLE NAMES BETTER
        //FUNCTIONS AND VARIABLES TO MAKE CODE MORE READABLE/EFFICIENT
        //NEED BETTER VISUALS! (background...make them flash when hit....sounds when attacking)
        //make mobile responsive
        //function to start the entire game (happens on page refresh)





