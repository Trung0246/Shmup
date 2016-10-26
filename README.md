# Shmup
A library for bullet hell in Javascript

Development version: **1.0.9**

This is a development branch, [please go to stable branch for stable version](https://github.com/Trung0246/Shmup/tree/stable).

Some feature were borrowed from java library bulletml by Kenta Cho :

www.asahi-net.or.jp/~cs8k-cyu/bulletml/index_e.html

[**DEMO**](http://codepen.io/Trung0246/pen/EgAyRZ)

[**WIKI**](https://github.com/Trung0246/Shmup/wiki)

## Feature:
* Nothing, this library is currently being write.

## Changelog:
* Changed *base* key behavior
* Added *function* type input compatibility
* Added *fireRef* key for *fire* commands
* Added *count* projectile configs
* Fixed bugs.

## TODO list:
* Add plugins
* Replace current *target* key in configs to make it possible to aim multiple target when using with direction aim
* Add new type of direction type *same* to fire multiple direction at same time based on angle (may nonsense)
* Add new type of *wait* that if return *true* then continue action
* Add *count* bulletGroup (may not possible)
* Add *vanishAll* for callback configs (or may return as object with commands with keys)
* Make *update* commands to possible update only one action or multiple action if array of actions
* Add *pause* and *stop* methods
* Add *reset* commands for sequence or reset something else?
* Add *delete* methods for delete all bullet?
* Remove error handling.
