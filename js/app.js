$(function() {

  //Object Constructor
  function Figure (name, health, minAtk, maxAtk) {
    this.name = name;
    this.health = health;
    this.damage = function(enemyName){
      var dmg = Math.floor(Math.random() * (maxAtk - minAtk)) + minAtk;
      console.log(dmg);
      // enemyName.health -= dmg
      // return enemyName.health
    }
  }

  var gary = new Figure('Gary', 100, 3, 10);



});