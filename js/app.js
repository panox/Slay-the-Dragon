$(function() {

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk, critChance) {
    this.damageNum;
    this.dmgText = "";
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var hit = Math.floor(Math.random() * (5 - 1)) + 1;
      var dmg = Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk;
      var crit = Math.floor(Math.random() * (critChance - 1)) + 1;
      if (hit !== 1) {
        if (crit === 1) {
          dmg *= 2
          this.dmgText = this.name + "<span class='crit'> critted </span>" 
          + enemyName.name + " for " + dmg;
          this.damageNum = "- " + dmg;
        } 
        else {
          this.dmgText = this.name + "<span class='attacked'> attacked </span>" 
          + enemyName.name + " for " + dmg;
          this.damageNum = "- " + dmg;
        }
        enemyName.health -= dmg;
      } 
      else {
        this.dmgText = this.name + " attack <span class='missed'>missed!</span>"
        this.damageNum = 0;
      }
    }
  }
  //Object Instances
  var gary = new Figure('Garry', 100, 3, 10, 5);
  var darius = new Figure('Darius', 200, 4, 15, 20);
  //Heal method
  gary.healText = "";
  gary.healNum = "";
  gary.healing = function(){
    var maxHeal = 20;
    var minHeal = 8;
    var heal = Math.floor(Math.random() * (maxHeal - minHeal)) + minHeal;
    if (gary.health + heal > 100) {
      gary.health = 100;
    } else {
      gary.health += heal;
    }
    this.healText = this.name + 
    " <span class='heal'> healed </span>himself for " + heal;
    gary.healNum = '+' + heal;
  }

  // Disable function
  jQuery.fn.extend({
    disable: function(state) {
      return this.each(function() {
        this.disabled = state;
      });
    }
  });

  // CapitalCase
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //Game Object
  var game = {
    win: false,
    $actions: $('#actions'),
    $gary: $('#gary'),
    $flame: $('#flame'),
    $healStar: $('#healStar'),
    $winBox: $('#winbox'),
    progress: function(percent, $element) {
      var progressBarWidth = percent * $element.width() / 100;
      $element.find('div').animate({ width: progressBarWidth }, 500)
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
    game.win = false;
    game.disableBtns(false);
  }

  game.checkWin = function(){
    if (darius.health < 0) {
      game.$winBox.show();
      game.$winBox.html("<p> "+ gary.name +" Wins </p>");
      game.win = true;
    }
    if (gary.health < 0) {
      game.$winBox.show();
      game.$winBox.html("<p> Darius Wins </p>");
      game.win = true;
    }
  }

  //Initial Health Bars
  game.garyProgress();
  game.dariusProgress();
 
  game.showNum = function (element, number) {
    $(element).html(number).css("opacity", "1").delay(700).fadeTo(900, 0);
  }

  //Enemy Turn
  game.enemyTurn = function(){
    darius.damage(gary);
    game.showNum('#garyDmg', darius.damageNum);
    game.$actions.prepend('<p> The Terrible ' + darius.dmgText + '</p>');
    game.garyProgress();
    
  }
  game.playerAttackTurn = function () {
    gary.damage(darius);
    game.showNum('#dariusDmg', gary.damageNum);
    game.$actions.prepend('<p> The Glorious ' + gary.dmgText + '</p>');
    game.dariusProgress();
    game.checkWin();
    if (!game.win) {
      setTimeout(animations.fireball, 2200);
    }
  }
  game.playerHealTurn = function () {
    gary.healing();
    game.showNum('#garyDmg', gary.healNum);
    game.$actions.prepend('<p>  The Glorious ' + gary.healText + '</p>');
    game.garyProgress();
  }

  //Attack Button
  $('#attackBtn').click(function() {
    event.preventDefault();
    game.disableBtns(true);
    animations.attackAnimation();
  });

  //Heal Button
  $('#healBtn').click(function() {
    event.preventDefault();
    game.disableBtns(true);
    sounds.healSound();
    animations.healAnimation();
    setTimeout(animations.fireball, 4300);
  });

  //Winbox Click
  game.$winBox.click( function() {
    event.preventDefault();
    game.$winBox.hide();
    game.reset();
  });


  //Input
    $('#heroInput').on('keypress',function(e){
    var heroInput = $('#heroInput').val();
    var p = e.which;
    if (p == 13) {
      event.preventDefault();
      if (heroInput.length < 6) {
        heroName = heroInput || "GARRY";
        $('#heroName').text(heroName.toUpperCase());
        $('form').hide();
        $('.game-bot').show();
        gary.name = capitalizeFirstLetter(heroInput);
      }
    }
  })

  //Animations
  var animations = {
    attackAnimation: function () {
      var totalFrames = 4;
      var frameWidth = 186;
      var speed = 0.9;
      var finalPosition = '-' + (frameWidth * totalFrames) + 'px 0px';
      var svgTL = new TimelineMax() 
      var svgEase = new SteppedEase(totalFrames);
      $('#gary').css("background-position", "0 0");
      svgTL.to('#gary', 0.9, {
        left:"190px",
      });
      svgTL.to('#gary', speed, {
        onStart: sounds.attackSound,
        backgroundPosition: finalPosition,
        ease: svgEase,
        onComplete: animations.changeBack
      });
    },
    changeBack: function () {
      game.playerAttackTurn();
      $('#gary').css("background-position", "0px 166px");
      TweenMax.to('#gary', 0.9, {
        left:"10px", 
        delay:0.6,
        onComplete: animations.changeFront
      });
    },
    changeFront: function () {
      $('#gary').css("background-position", "0 0");
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
      game.enemyTurn();
      game.checkWin();
      game.disableBtns(false);
    },
    healAnimation: function () {
      TweenMax.to(game.$healStar, 0.8, {opacity:"1",
        repeat:1, 
        repeatDelay:0.3, 
        yoyo:true,
        onComplete: game.playerHealTurn
      });
    }
  }

  //Sounds
  var sounds = {
    timeAttack: function () {
      var mySound = soundManager.createSound({
        id: "background",
        url: "../sounds/background.wav"
      });
      mySound.play({
        onfinish: function() {
          sounds.timeAttack(mySound);
        }
      });
    },
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
    attackSound: function () {
      var mySound = soundManager.createSound({
        id: "attack",
        url: "../sounds/sword.mp3",
      });
      mySound.play();
    }
  }

  soundManager.setup({
    url: '/swf/',
    preferFlash: true,
    onready: sounds.timeAttack
  });

});