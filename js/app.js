$(function() {

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk) {
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var dmg = Math.random() * (maxAtk - minAtk) + minAtk;
      enemyName.health -= dmg
      return enemyName.health
    }
  }






});