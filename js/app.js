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

  var gary = new Figure('Gary', 100, 3, 10);
  var darius = new Figure('Darius', 200, 4, 20);

  gary.healing = function(){
    var heal = Math.floor(Math.random() * (20 - 4)) + 4;
    //check for health up to 100
    if (gary.health + heal > 100) {
      gary.health = 100;
    } else {
      gary.health += heal;
    }
    console.log("Healing for: " + heal);
    console.log("Gary's health is: " + gary.health)
  }

  // debugger
});