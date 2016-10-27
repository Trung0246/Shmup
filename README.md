# Shmup
A library for bullet hell in Javascript

Development version: **1.0.10**

This is a development branch, [please go to stable branch for stable version](https://github.com/Trung0246/Shmup/tree/stable).

Some feature were borrowed from java library bulletml by Kenta Cho :

www.asahi-net.or.jp/~cs8k-cyu/bulletml/index_e.html

[**DEMO**](http://codepen.io/Trung0246/pen/EgAyRZ)

[**WIKI**](https://github.com/Trung0246/Shmup/wiki)

## Feature:
* Nothing, this library is currently being write.

## Changelog:
* Added *frame* configs count
* Replaced current *target* key in configs to make it possible to aim multiple target when using with direction aim
* Added new type of *wait* called *manual* that if return *true* then continue action
* Replaced callback configs with normal commands to make more freedom
* Fixed *vanish* bug when calling *first* and *last* have value larger then bulletGroup length
* Made *update* commands to possible update defined array of actions
* Fixed bugs.

## TODO list:
* Add plugins
* Add new type of direction *same* that fire multiple direction at same time based on angle (may not useful)
* Add new fire type *aimSequence* (may not possible)
* Add *count* bulletGroup (may not possible)
* Add *pause* and *stop* methods
* Add *reset* commands for sequence or reset something else?
* Add *delete* methods for delete all bullet?
* Remove error handling.
