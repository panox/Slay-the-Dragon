$(function() {

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
  var darius = new Figure('Darius', 200, 4, 15);
  //Heal method
  gary.healing = function(){
    var maxHeal = 20;
    var minHeal = 8;
    var heal = Math.floor(Math.random() * (maxHeal - minHeal)) + minHeal;
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
  
  //Game Object
  var game = {
    $actions: $('#actions'),
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

  game.disableBtns = function(boolean) {
    $('#attackBtn').disable(boolean);
    $('#healBtn').disable(boolean);
  }

  game.checkWin = function(){
    if (darius.health < 0) {
      alert("Gary Wins");
    }
    if (gary.health < 0) {
      alert("Darius Wins");
    }
    game.disableBtns(true);
  }

  //Initial Health Bars
  game.garyProgress();
  game.dariusProgress();

  //Enemy Turn
  game.enemyTurn = function(){
   darius.damage(gary);
   game.garyProgress();
   game.checkWin();
   game.disableBtns(false);
  }
  //Attack Button
  $('#attackBtn').click(function() {
    event.preventDefault();
    gary.damage(darius);
    game.dariusProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 800);
  });

  //Heal Button
  $('#healBtn').click(function() {
    event.preventDefault();
    gary.healing();
    game.garyProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 1000);
  });

  // debugger
});