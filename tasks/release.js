// var process = require('process');
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var template = require('lodash').template;
var base64 = require('base64-js');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var chalk = require('chalk');
var webpack = require('webpack');
var through2 = require('through2');

console.log(process.env.mode);