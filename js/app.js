$(function() {

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk) {
    this.dmgText = "";
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var dmg = Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk;
      enemyName.health -= dmg;
      this.dmgText = name + " attacked " + enemyName.name + " for " + dmg;
      //
      // console.log(name + " attacked " + enemyName.name + " for " + dmg)
      // console.log(enemyName.name + "'s Health: " + enemyName.health)
    }
  }
  //Object Instances
  var gary = new Figure('Gary', 100, 3, 10);
  var darius = new Figure('Darius', 200, 4, 15);
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
      var tl = new TimelineLite();
      tl.add( TweenLite.to(game.$gary, 0.9, {
        left:"190px",
        onComplete: attack
      }) );
      tl.add( TweenMax.to(game.$gary, 0.9, {
        onStart: stop,
        left:"10px",
      }) );
      // TweenMax.to(game.$gary, 0.9, {
      //   left:"190px",
      //   onComplete: animations.moveForwardComplete
      // });
    },
    // moveForwardComplete: function() {
    //   attack();
    // },
    // moveBack: function () {
    //   game.$gary.css( "background-position", "0 0" );
    //   TweenMax.to(game.$gary, 0.9, {
    //     onStart: sounds.runSound,
    //     left:"10px", 
    //     delay:0.6
    //   });
    // },
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

  
  function attack () {
    mark = $("#gary").sprite({
      frameWidth: 188, 
      frameHeight: 172, 
      sheetWidth: 748,
      imageSrc:"../assets/knight-attack.png"
    });
    mark.sprite("play");
  }

  function stop () {
    game.$gary.css( "background-position", "0 0" );
    mark.sprite("stop");
  }
  
  // debugger
});