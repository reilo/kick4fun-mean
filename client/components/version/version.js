'use strict';

angular.module('kick4fun.version', [
  'kick4fun.version.interpolate-filter',
  'kick4fun.version.version-directive'
])

.value('version', '0.1');
