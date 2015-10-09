$(function() {
  //Game Object
  var game = {
    progress: function(percent, $element) {
        var progressBarWidth = percent * $element.width() / 100;
        $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "% ");
    },
    garyProgress: function() {
      game.progress(gary.health, $('#hero-health'));
    },
    dariusProgress: function() {
      game.progress(darius.health/2, $('#enemy-health'));
    }
  }

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk) {
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var dmg = Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk;
      enemyName.health -= dmg;
      console.log("Damage done: " + dmg)
      console.log(enemyName.name + "'s Health: " + enemyName.health)
    }
  }
  //Object Instances
  var gary = new Figure('Gary', 100, 3, 10);
  var darius = new Figure('Darius', 200, 4, 20);
  //Heal method
  gary.healing = function(){
    var heal = Math.floor(Math.random() * (20 - 4)) + 4;
    if (gary.health + heal > 100) {
      gary.health = 100;
    } else {
      gary.health += heal;
    }
    console.log("Healing for: " + heal);
    console.log("Gary's health is: " + gary.health)
  }

  // Disable function
  jQuery.fn.extend({
      disable: function(state) {
          return this.each(function() {
              this.disabled = state;
          });
      }
  });

  game.disableBtns = function(boolean) {
    $('#attackBtn').disable(boolean);
    $('#healBtn').disable(boolean);
  }

  //Initial Health Bars
  game.garyProgress();
  game.dariusProgress();

  //Enemy Turn
  game.enemyTurn = function(){
   darius.damage(gary);
   game.garyProgress();
   game.disableBtns(false);
  }

  //Attack Button
  $('#attackBtn').click(function() {
    gary.damage(darius);
    game.dariusProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 800);
  });

  //Heal Button
  $('#healBtn').click(function() {
    gary.healing();
    game.garyProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 1000);
  });


  // debugger
});