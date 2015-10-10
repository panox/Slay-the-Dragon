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

  game.checkWin = function(){
    if (darius.health < 0) {
      alert("Gary Wins");
    }
    if (gary.health < 0) {
      alert("Darius Wins");
    }
  }

  //Initial Health Bars
  game.garyProgress();
  game.dariusProgress();

  //Enemy Turn
  game.enemyTurn = function(){
   darius.damage(gary);
   game.$actions.prepend('<p> The Terrible ' + darius.dmgText + '</p>');
   game.garyProgress();
   game.checkWin();
   game.disableBtns(false);
  }
  //Attack Button
  $('#attackBtn').click(function() {
    event.preventDefault();
    moveForward();
    gary.damage(darius);
    game.$actions.prepend('<p> The Glorious ' + gary.dmgText + '</p>');
    game.dariusProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 3000);
  });

  //Heal Button
  $('#healBtn').click(function() {
    event.preventDefault();
    gary.healing();
    game.$actions.prepend('<p>  The Glorious ' + gary.healText + '</p>');
    game.garyProgress();
    game.disableBtns(true);
    setTimeout(game.enemyTurn, 3000);
  });

  //Animations
  function moveForward() {
    game.$gary.css( "background-position", "0 -150px" );
    TweenMax.to(game.$gary, 0.9, {left:"190px", onComplete:change});
    
  }

  function change() {
    game.$gary.css( "background-position", "0 0" );
    TweenMax.to(game.$gary, 0.9, {left:"10px"});
  }


  // debugger
});