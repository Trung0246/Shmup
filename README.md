# Shmup
A library for bullet hell in Javascript

Development version: **1.1**

This is a development branch, [please go to stable branch for stable version](https://github.com/Trung0246/Shmup/tree/stable).

Some feature were borrowed from java library bulletml by Kenta Cho :

www.asahi-net.or.jp/~cs8k-cyu/bulletml/index_e.html

[**DEMO**](http://codepen.io/Trung0246/pen/EgAyRZ)

[**DEMO FLOWER**](http://codepen.io/Trung0246/pen/amgZpd)

[**WIKI**](https://github.com/Trung0246/Shmup/wiki)

## Feature:
* Nothing, this library is currently being write.

## Changelog:
* Added new speed key *oval*

## TODO list:
* Add plugins laser and curveLaser then try to compress in same javascript file
* Add plugins spreadShot to make spread shot like shotgun, also spread with in-line
* Add plugins shape to fire like star, square, heart, ...
* Add plugins for bounce angle and teleport to opposite like asteroid game
* Add plugins for special handling like danmakufu ph3 ?
* Add shotRef
* Make func command to possible return methods
* Make it possible to clone configs?
* Try to group ref in fire command together in one object
* Increase loop performance and prevent momery leak and also try to implement Pool() class to bullet data for maybe faster loop?
* Make it possible to wait time smaller than a frame (may not possible)
* Add spawn area instead of spawning specific x, y
* Make same actionLabel to fire multiple time without messing each other
* Add new configs that specific {x:0,y:0} or [x, y]
* Make fire commands to fire at custom x and y location like testing.fire("main", xy)
* Make possible to support both cartesian and parametric equation in movement
* Make it possible to make a bullet have movement based on another bullet by {movement function(bullet that fire this bullet data goes here) {}}
* Remove frame?
* Remove freeze?
* Add new type of change sequence that use temp data to hold sequence like fire sequence with like relative or absolute
* Add delta bullet value for angle and speed and add magnitude value
* Add Normal methods to normalize angle or bullet angle
* Make possible to clear null bullet manual
* Add new type of direction *same* that fire multiple direction at same time based on angle (may not useful)
* Add *count* bulletGroup (may not possible)
* Compress *extend* function to one (may not possible)
* Create vector, projectile class to faster code (may not needed)
* Implement *Pool* object handler (may not needed)
* Remove error handling
