# Shmup
A library for bullet hell in Javascript

Development version: **1.1.1**

This is a development branch, [please go to stable branch for stable version](https://github.com/Trung0246/Shmup/tree/stable).

Some feature were borrowed from java library bulletml by Kenta Cho :

www.asahi-net.or.jp/~cs8k-cyu/bulletml/index_e.html

[**DEMO**](http://codepen.io/Trung0246/pen/EgAyRZ)

[**DEMO FLOWER**](http://codepen.io/Trung0246/pen/amgZpd)

[**WIKI**](https://github.com/Trung0246/Shmup/wiki)

## Feature:
* Nothing, this library is currently being write.

## Changelog:
* Added new configs that specific {x:0,y:0} or [x, y]
* Made it possible to make a bullet have movement based on another bullet
* Made it possible for bullet fire from actionRef to get data from position configs
* Added new type of change sequence that use temp data to hold sequence like fire sequence with like relative or absolute
* Added normalize methods to normalize angle or bullet angle
* Fixed bugs

## TODO list:
* Add delta bullet value for angle and speed and add magnitude value
* Make possible to clear null bullet manual
* Compress extend function to one
* Compress horizontal and vertical to one
* Remove error handling
