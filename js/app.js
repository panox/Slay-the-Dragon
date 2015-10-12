$(function() {

  $('#heroInput').on('blur', function(){
    event.preventDefault();
    var heroName = $('#heroInput').val() || "GARRY";
    console.log(heroName);
    $('#heroName').text(heroName);
  })
  
  // prompt("Please enter your hero name").toUpperCase() || "GARRY"

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk, critChance) {
    this.dmgText = "";
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var hit = Math.floor(Math.random() * (4 - 1)) + 1;
      var dmg = Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk;
      var crit = Math.floor(Math.random() * (critChance - 1)) + 1;
      if (hit !== 1) {
        if (crit === 1) {
          dmg *= 2
          this.dmgText = name + " critted " + enemyName.name + " for " + dmg;
        } 
        else {
          this.dmgText = name + " attacked " + enemyName.name + " for " + dmg;
        }
        enemyName.health -= dmg;
      } else {
        this.dmgText = name + "'s attack missed!"
      }
      //
      // console.log(name + " attacked " + enemyName.name + " for " + dmg)
      // console.log(enemyName.name + "'s Health: " + enemyName.health)
    }
  }
  //Object Instances
  var gary = new Figure(heroName, 100, 3, 10, 5);
  var darius = new Figure('Darius', 200, 4, 15, 20);
  //Heal method
  gary.healText = "";
  gary.healing = function(){
    var maxHeal = 20;
    var minHeal = 8;
    var heal = Math.floor(Math.random() * (maxHeal - minHeal)) + minHeal;
    if (gary.health + heal > 100) {
      gary.health = 100;
    } else {
      gary.health += heal;
    }
    this.healText = this.name + " healed himself for " + heal;
    //
    // console.log("Healing for: " + heal);
    // console.log("Gary's health is: " + gary.health)
  }

  // Disable function
  jQuery.fn.extend({
      disable: function(state) {
          return this.each(function() {
              this.disabled = state;
          });
      }
  });
  
  //Game Object
  var game = {
    $actions: $('#actions'),
    $gary: $('#gary'),
    $flame: $('#flame'),
    $healStar: $('#healStar'),
    $winBox: $('#winbox'),
    progress: function(percent, $element) {
        var progressBarWidth = percent * $element.width() / 100;
        $element.find('div').animate({ width: progressBarWidth }, 500)
        //text(percent + "% ");
    },
    garyProgress: function() {
      game.progress(gary.health, $('#hero-health'));
    },
    dariusProgress: function() {
      game.progress(darius.health/2, $('#enemy-health'));
    }
  }

  game.disableBtns = function(boolean) {
    $('#attackBtn').disable(boolean);
    $('#healBtn').disable(boolean);
  }

  game.reset = function() {
    gary.health = 100;
    darius.health = 200;
    game.$actions.html("");
    game.garyProgress();
    game.dariusProgress();
    game.$gary.css("background-position", "0 -150px");
    game.disableBtns(false)
  }

  game.checkWin = function(){
    if (darius.health < 0) {
      game.$winBox.show();
      game.$winBox.html("<p> Gary Wins </p>");
      game.disableBtns(true);
    }
    if (gary.health < 0) {
      game.$winBox.show();
      game.$winBox.html("<p> Darius Wins </p>");
      game.disableBtns(true);
    }
  }

  //Initial Health Bars
  game.garyProgress();
  game.dariusProgress();

  //Enemy Turn
  game.enemyTurn = function(){
    animations.fireball();
    darius.damage(gary);
    game.$actions.prepend('<p> The Terrible ' + darius.dmgText + '</p>');
    game.garyProgress();
    game.disableBtns(false);
  }
  //Attack Button
  $('#attackBtn').click(function() {
    event.preventDefault();
    animations.moveForward();
    gary.damage(darius);
    game.$actions.prepend('<p> The Glorious ' + gary.dmgText + '</p>');
    game.dariusProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 3000);
  });

  //Heal Button
  $('#healBtn').click(function() {
    event.preventDefault();
    sounds.healSound();
    animations.healAnimation();
    gary.healing();
    game.$actions.prepend('<p>  The Glorious ' + gary.healText + '</p>');
    game.garyProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 3000);
  });

  //Winbox Click
  game.$winBox.click( function() {
    event.preventDefault();
    game.$winBox.hide();
    game.reset();
  });

  //Animations
  var animations = {
    moveForward: function () {
      game.$gary.css("background-position", "0 -150px");
      sounds.runSound();
      TweenMax.to(game.$gary, 0.9, {
        left:"190px", 
        ease:Bounce.easeOut,
        onComplete: animations.moveBack
      });
    },
    moveBack: function () {
      game.$gary.css( "background-position", "0 0" );
      TweenMax.to(game.$gary, 0.9, {
        onStart: sounds.runSound,
        left:"10px", 
        delay:0.6
      });
    },
    fireball: function () {
      game.$flame.css("left", "-150px")
      TweenMax.to(game.$flame, 0.9, {
        onStart: animations.fireballStart,
        left: "-320px",
        onComplete: animations.fireballComplete
      });
    },
    fireballStart: function () {
      game.$flame.css("opacity", "1");
      sounds.fireballSound();
    },
    fireballComplete: function() {
      game.$flame.css("opacity", "0");
      game.checkWin();
    },
    healAnimation: function () {
      TweenMax.to(game.$healStar, 0.8, {opacity:"1",
        repeat:1, repeatDelay:0.5, yoyo:true
      });
    }
  }

  //Sounds
  soundManager.setup({
    url: '/swf/',
    preferFlash: true,
  });

  var sounds = {
    healSound: function () {
      var mySound = soundManager.createSound({
        id: "heal",
        url: "../sounds/heal.wav"
      });
      mySound.play();
    },
    fireballSound: function () {
      var mySound = soundManager.createSound({
        id: "fireball",
        url: "../sounds/fireball.mp3"
      });
      mySound.play();
    },
    runSound: function () {
      var mySound = soundManager.createSound({
        id: "run",
        url: "../sounds/horses.mp3",
      });
      mySound.play();
    }
  }


  // debugger
});