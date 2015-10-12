/*
 *  jquery.gsap-sprite - v0.1
 *  A sprite control plugin for jQuery & GSAP
 *  Usage: https://github.com/agrothe/jquery.gsap.sprite
 *  Demo: http://jsbin.com/quvuzo/6/edit?html,js,output
 *
 *  Made by Andrew Grothe
 *  Under MIT License
 */
;(function ($) {
    // custom select class
    "use strict";
    function Sprite(item, options) {
        this.options = $.extend({
            imageSrc: null, /* optional, uses background-image css property otherwise */
            frameWidth: 100, /* pixel width value of each frame as an integer ie. 100 not 100px */
            frameHeight: 100, /* pixel height value of each frame as an integer ie. 100 not 100px */
            sheetWidth: 1000, /* pixel width value of total sprite sheet as an integer ie. 1000 not 1000px */
            speed: 0.150, /* animation speed in milliseconds */
            timeLine: null, /* optional Timeline object to use instead of internal variable. */
            TimelineMaxOverride: null, /* optional TimelineMax library, in case of customization */
            TweenMaxOverride: null /* optional TweenMax library, in case of customization */
        }, options);
        this.item = $(item);
        this.init();
    }
    
    Sprite.prototype = {
        init: function () {
            var TLM, TM, TL, self = this, bgimg = "";
            
            // Allow override of TimelineMax library
            if (this.options.TimelineMaxOverride !== null) {
                TLM = this.options.TimelineMaxOverride;
            } else {
                TLM = TimelineMax;
            }
            
            // Allow override of TweenMax library
            if (this.options.TweenMaxOverride !== null) {
                TM = this.options.TweenMaxOverride;
            } else {
                TM = TweenMax;
            }
            
            if (this.options.timeLine === null) {
                this.options.timeLine =  new TLM({repeat: -1});
            }
            
            TL = this.options.timeLine;

            if (this.options.imageSrc === null) {
                bgimg = this.item.css('background-image');
            } else {
                bgimg = "url(" + this.options.imageSrc + ")";
            }
            
            this.item.css({
                'width': this.options.frameWidth + 'px',
                'height': this.options.frameHeight + 'px',
                'background': bgimg + ' no-repeat',
                'background-position': '0px 0px'
            });
            this.options.step = parseInt(this.options.sheetWidth, 0) / parseInt(this.options.frameWidth, 0);
            
            TL.add(TM.to(this.item, 0, {backgroundPosition: "0px 0px", ease: Linear.easeNone}), "+=0");
            // add new frames with pause
            for (var j = 1; j < this.options.step ; j++) {
                TL.add( TM.to(this.item, 0, 
                              {backgroundPosition:"-" + (this.options.frameWidth*j) + "px 0px", ease:Linear.easeNone}), 
                       "+=" + this.options.speed);
            }
            
            
            TL.play();
        },
        pause: function() {
            this.options.timeLine.pause();
        },
        play: function() {
            this.options.timeLine.play();
        },
        stop: function() {
            this.options.timeLine.stop();
        },
        seek: function(frame, stop) {
            if(stop === true)
                this.options.timeLine.stop();
            
            this.options.timeLine.seek(this.options.speed * (frame));
            
        },
        restart: function() {
            this.options.timeLine.stop();
        },
        resume: function() {
            this.options.timeLine.stop();
        }
        
    };

    // jQuery plugin interface
    $.fn.sprite = function(opt) {
        // slice arguments to leave only arguments after function name
        var args = Array.prototype.slice.call(arguments, 1);
        return this.each(function() {
            var item = $(this), instance = item.data('Sprite');
            if(!instance) {
                // create plugin instance and save it in data
                item.data('Sprite', new Sprite(this, opt));
            } else {
                // if instance already created call method
                if(typeof opt === 'string') {
                    instance[opt].apply(instance, args);
                }
            }
        });
    };

}(jQuery));
