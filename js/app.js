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

  //Health Bars
  progress(gary.health, $('#hero-health'));
  progress(darius.health/2, $('#enemy-health'));
  function progress(percent, $element) {
      var progressBarWidth = percent * $element.width() / 100;
      $element.find('div').animate({ width: progressBarWidth }, 500).html(percent + "% ");
  }

  //Attack Button
  $('#attackBtn').click(function() {
    gary.damage(darius);
    progress(darius.health/2, $('#enemy-health'));
  });

  //Heal Button

  //Enemy Turn
  darius.damage(gary);
  progress(gary.health, $('#hero-health'));


  // debugger
});