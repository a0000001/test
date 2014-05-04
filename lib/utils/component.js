/**
 * assemble <http://assemble.io>
 *
 * copyright (c) 2014 jon schlinkert, brian woodward, contributors
 * licensed under the mit license (mit).
 */

'use strict';

// node modules
var matter = require('gray-matter');
var file = require('fs-utils');
var _ = require('lodash');

// locals
var Component = require('../models').Component;
var component = module.exports = {};


/**
 * Generate a unique, private name (id) for a component
 * based on index for the given type.
 *
 * @param   {String}  type  The type of component
 * @return  {String}        The generated name/id
 */

component.generateName = function (type) {
  this.typeIndices = this.typeIndices || {};
  this.typeIndices[type] = this.typeIndices[type] || [];
  this.typeIndices[type] = +(this.typeIndices[type] || 0) + 1;
  return type + '_' + this.typeIndices[type];
};


/**
 * Ensure the content and data properties on the object
 * are populated.
 *
 * @param   {Object}  component  The component object
 *
 * @api private
 */

component._ensureComponent = function (component) {
  if (_.isEmpty(component.data) || _.isEmpty(component.content)) {
    var obj = matter(component.orig);
    component.content = obj.content;
    component.data = _.merge(component.data || {}, obj.context);
  }
};


/**
 * Parse a string (with front matter) into an object.
 *
 * @param   {String}  str      The string to parse
 * @param   {Object}  options  Options to pass to gray-matter
 * @return  {Object}           Return a
 *
 * @api private
 */

component._parseString = function (str, options) {
  var obj = matter(str, options);
  obj.data = obj.context;
  delete obj.context;
  return obj;
};


/**
 * Create a new instance of the Component model.
 *
 * @param   {Object}  obj   Object containing the properties for the component.
 * @param   {String}  type  Component type (pages, layouts, partials are examples of components)
 * @return  {Object}        [description]
 */

component.createComponent = function (obj, type) {
  obj.type = type || 'component';

  var component = new Component(obj);
  component.data = _.merge(component.data, _.omit(component, ['data', 'orig']));
  return component;
};