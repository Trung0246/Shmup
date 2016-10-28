# Shmup
A library for bullet hell in Javascript

Development version: **1.0.11**

This is a development branch, [please go to stable branch for stable version](https://github.com/Trung0246/Shmup/tree/stable).

Some feature were borrowed from java library bulletml by Kenta Cho :

www.asahi-net.or.jp/~cs8k-cyu/bulletml/index_e.html

[**DEMO**](http://codepen.io/Trung0246/pen/EgAyRZ)

[**WIKI**](https://github.com/Trung0246/Shmup/wiki)

## Feature:
* Nothing, this library is currently being write.

## Changelog:
* Made *fire* command to possible fire multiple action at one call
* Added new *target* key for *sequence*, like *aim*
* Added *reset* method for reset fire sequence with value
* Added *freeze* and *continue* commands for bullets
* Added *pause*, *run* and *stop* methods for actions
* Added *clear* method for delete all bullet with specific actionLabel
* Added *freeze* command for freezing bullet
* Fixed bugs

## TODO list:
* Add plugins
* Add new type of direction *same* that fire multiple direction at same time based on angle (may not useful)
* Add *count* bulletGroup (may not possible)
* Compress *extend* function to one (may not possible)
* Add shortcut function to reduce letter need to type to execute methods
* Remove error handling
