angular.module("ngCordova.plugins.nativeStorage", [])
  .factory('$cordovaNativeStorage', ['$window', '$q', '$log', function ($window, $q, $log) {

    var inBrowser = false;
    var initialised = false;

    function isInBrowser() {
      if (!initialised) {
        inBrowser = ($window.cordova && $window.cordova.platformId === 'browser') || !($window.phonegap || $window.cordova);
        if (!inBrowser) {
          $log.log('NativeStorageWrapper: isNotInBrowser');
        } else {
          $log.log('NativeStorageWrapper: isInBrowser');
        }
        initialised = true;
      }
      return inBrowser;
    }

    function setInLocalStorage(reference, variable, success, error) {
      try {
        var varAsString = JSON.stringify(variable);
        $window.localStorage[reference] = varAsString;
        success(variable);
      } catch (err) {
        error(err);
      }
    }

    function getFromLocalStorage(reference, success, error) {
      try {
        var obj;
        var value = $window.localStorage[reference];
        if (value != undefined) {
          obj = JSON.parse(value);
          success(obj);
        } else {
          var err = new Error(reference + ': undefined');
          err.code = 2;
          throw err;
        }
      } catch (err) {
        error(err);
      }
    }

    function removeFromLocalStorage(reference, success, error) {
      try {
        $window.localStorage.removeItem(reference);
        success(null);
      } catch (err) {
        error(err);
      }
    }

    function clearFromLocalStorage(success, error) {
      try {
        $window.localStorage.clear();
        success(null);
      } catch (err) {
        error(err);
      }
    }

    function getKeysFromLocalStorage(success, error) {
      try {
        var obj;
        var keys = Object.keys($window.localStorage) || [];
        success(keys);
      }
      catch (err) {
        error(err);
      }
    }

    return {
      remove: function (reference) {
        var q = $q.defer();
        if (isInBrowser()) {
          removeFromLocalStorage(reference, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
        } else {
          document.addEventListener("deviceready", function() {
            NativeStorage.remove(reference, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
          });
        }
        return q.promise;
      },
      setItem: function (reference, s) {
        var q = $q.defer();
        if (isInBrowser()) {
          setInLocalStorage(reference, s, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
        } else {
          document.addEventListener("deviceready", function() {
            NativeStorage.setItem(reference, s, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
          });
        }
        return q.promise;
      },
      getItem: function (reference) {
        var q = $q.defer();
        if (isInBrowser()) {
          getFromLocalStorage(reference, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
        } else {
          document.addEventListener("deviceready", function() {
            NativeStorage.getItem(reference, function (result) { q.resolve(result); }, function (error) { q.reject(error); });
          });
        }
        return q.promise;
      },
      clear: function () {
        var q = $q.defer();
        if (isInBrowser()) {
          clearFromLocalStorage(function (result) {
            q.resolve(result);
          }, function (error) {
            q.reject(error);
          });
        } else {
          document.addEventListener("deviceready", function() {
            NativeStorage.clear(function (result) {
              q.resolve(result);
            }, function (error) {
              q.reject(error);
            });
          });
        }
        return q.promise;
      },
      keys: function () {
        var q = $q.defer();
        if (isInBrowser()) {
          getKeysFromLocalStorage(function (result) {
            q.resolve(result);
          }, function (error) {
            q.reject(error);
          });
        } else {
          document.addEventListener("deviceready", function() {
            NativeStorage.keys(function (result) {
              q.resolve(result);
            }, function (error) {
              q.reject(error);
            });
          });
        }
        return q.promise;
      }
    };
  }]);
