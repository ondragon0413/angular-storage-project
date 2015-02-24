'use strict';

describe('angularStorage store', function() {

  beforeEach(function() {
    module('angular-storage.store');
  });

  it('should save items correctly in localStorage', inject(function(store) {
    var value = 1;
    store.set('gonto', value);
    expect(store.get('gonto')).to.equal(value);
  }));

  it('should save null items correctly in localStorage', inject(function(store) {
    store.set('gonto', null);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.equal(null);
  }));

  it('should save undefined items correctly in localStorage', inject(function(store) {
    store.set('gonto', undefined);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.equal(undefined);
  }));

  it('should delete items correctly from localStorage', inject(function(store) {
    var value = 1;
    store.set('gonto', value);
    expect(store.get('gonto')).to.equal(value);
    store.remove('gonto');
    expect(store.get('gonto')).to.not.exist;
  }));

  it('should save objects correctly', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    expect(store.get('gonto')).to.eql(value);
  }));

  it('should save objects correctly', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    expect(store.get('gonto')).to.eql(value);
  }));

  it('should save and objects correctly without cache', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.eql(value);
    expect(store.get('gonto')).not.to.equal(value);
  }));

  it('should save and objects correctly without cache', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.eql(value);
    expect(store.get('gonto')).not.to.equal(value);
  }));

  describe('.setStorage()', function () {

    var $cookieStore;

    beforeEach(module('ngCookies'));

    beforeEach(inject(function( _$cookieStore_) {
      $cookieStore = _$cookieStore_;
    }));

    it('should should save items correctly when the storage is changed to sessionStorage', inject(function(store, $window) {
      var value = 11;
      store.setStorage('sessionStorage');
      store.set('gonto', value);

      expect(store.get('gonto')).to.equal(value);
      expect($window.sessionStorage.getItem('gonto')).to.exist;
      expect($window.sessionStorage.getItem('gonto')).to.equal(value.toString());
    }));

    it('should should save items correctly when the storage is changed to localStorage', inject(function(store, $window) {
      var value = 22;
      store.setStorage('localStorage');
      store.set('gonto', value);

      expect(store.get('gonto')).to.equal(value);
      expect($window.localStorage.getItem('gonto')).to.exist;
      expect($window.localStorage.getItem('gonto')).to.equal(value.toString());
    }));

    it('should should save items correctly when the storage is changed to cookieStorage', inject(function(store) {
      var value = 22;
      store.setStorage('cookieStorage');
      store.set('gonto', value);

      expect(store.get('gonto')).to.equal(value);
      expect($cookieStore.get('gonto')).to.equal(JSON.stringify(value));
    }));

    it('should not change store when param storage is not a string', inject(function(store, $window) {
      var value = 2222;
      store.setStorage({a:3});
      store.set('xxx', value);

      expect(store.get('xxx')).to.equal(value);
      expect($window.localStorage.getItem('xxx')).to.exist;
      expect($window.localStorage.getItem('xxx')).to.equal(value.toString());
    }));

    it('should not change store when param storage is an empty string', inject(function(store, $window) {
      var value = 2222;
      store.setStorage('');
      store.set('xxx', value);

      expect(store.get('xxx')).to.equal(value);
      expect($window.localStorage.getItem('xxx')).to.exist;
      expect($window.localStorage.getItem('xxx')).to.equal(value.toString());
    }));

    it('should throw an error when the store is not found', inject(function(store) {
      expect(function() { store.setStorage('abc'); } ).to.throw(Error, /Unknown provider: abcProvider <- abc/);
    }));
  });
});

describe('angularStorage store: cookie fallback', function() {

    /* these tests ensure that the cookie fallback works correctly.
    *
    * note - to confirm that cookiestore was used we attempt to retrieve the value from the cookie
             since this bypasses our service, the result will not have been json parsed
             therefore we use JSON.stringify on the expected value, so comparing like for like
    *
    */

    var windowMock, $cookieStore;

    /* provide a mock for $window where localStorage is not defined */
    beforeEach(module('ngCookies', 'angular-storage.store', function ($provide) {
        windowMock = { localStorage: undefined };
        $provide.value('$window', windowMock);
    }));

    beforeEach(inject(function( _$cookieStore_) {
        $cookieStore = _$cookieStore_;
    }));

  it('should save items correctly in localStorage', inject(function(store) {
    var value = 1;
    store.set('gonto', value);
    expect(store.get('gonto')).to.equal(value); //this line asserts that value was saved by our service
    expect($cookieStore.get('gonto')).to.equal(JSON.stringify(value)); //this line asserts that cookie store was used
  }));

  it('should save null items correctly in localStorage', inject(function(store) {
    store.set('gonto', null);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.equal(null);
    expect($cookieStore.get('gonto')).to.equal(JSON.stringify(null));
  }));

  it('should save undefined items correctly in localStorage', inject(function(store) {
    store.set('gonto', undefined);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.equal(undefined);
    expect($cookieStore.get('gonto')).to.equal(JSON.stringify(undefined));
  }));

  it('should delete items correctly from localStorage', inject(function(store) {
    var value = 1;
    store.set('gonto', value);
    expect(store.get('gonto')).to.equal(value);
    store.remove('gonto');
    expect(store.get('gonto')).to.not.exist;
    expect($cookieStore.get('gonto')).to.not.exist;
  }));

  it('should save objects correctly', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    expect(store.get('gonto')).to.eql(value);
  }));

  it('should save objects correctly', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    expect(store.get('gonto')).to.eql(value);
    expect($cookieStore.get('gonto')).to.equal(JSON.stringify(value));
  }));

  it('should save objects correctly without cache', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.eql(value);
    expect(store.get('gonto')).not.to.equal(value);
  }));

  it('should save objects correctly without cache', inject(function(store) {
    var value = {
      gonto: 'hola'
    };
    store.set('gonto', value);
    store.inMemoryCache = {};
    expect(store.get('gonto')).to.eql(value);
    expect(store.get('gonto')).not.to.equal(value);
    expect($cookieStore.get('gonto')).to.eql(JSON.stringify(value));

  }));

});

describe('angularStorage new namespaced store', function() {
  beforeEach(function() {
    module('ngCookies', 'angular-storage.store');
  });

  var newStore = null;

  beforeEach(inject(function(store) {
    newStore = store.getNamespacedStore('auth0');
  }));

  it('should save items correctly', inject(function($window) {
    var value = 1;
    newStore.set('myCoolValue', value);
    expect(newStore.get('myCoolValue')).to.equal(value);
    expect($window.localStorage.getItem('auth0.myCoolValue')).to.exist;
    expect($window.localStorage.getItem('myCoolValue')).to.not.exist;
  }));

  it('should delete items correctly from localStorage', function() {
    var value = 1;
    newStore.set('gonto', value);
    expect(newStore.get('gonto')).to.equal(value);
    newStore.remove('gonto');
    expect(newStore.get('gonto')).to.not.exist;
  });

  it('should save objects correctly', function() {
    var value = {
      gonto: 'hola'
    };
    newStore.set('gonto', value);
    expect(newStore.get('gonto')).to.eql(value);
  });

  it('should save objects correctly', function() {
    var value = {
      gonto: 'hola'
    };
    newStore.set('gonto', value);
    expect(newStore.get('gonto')).to.eql(value);
  });

  it('should save and objects correctly without cache', function() {
    var value = {
      gonto: 'hola'
    };
    newStore.set('gonto', value);
    newStore.inMemoryCache = {};
    expect(newStore.get('gonto')).to.eql(value);
    expect(newStore.get('gonto')).not.to.equal(value);
  });

  it('should save and objects correctly without cache', function() {
    var value = {
      gonto: 'hola'
    };
    newStore.set('gonto', value);
    newStore.inMemoryCache = {};
    expect(newStore.get('gonto')).to.eql(value);
    expect(newStore.get('gonto')).not.to.equal(value);
  });

  describe('.setStorage()', function () {
    var $cookieStore;

    beforeEach(inject(function( _$cookieStore_) {
      $cookieStore = _$cookieStore_;
    }));

    it('should should save items correctly when the storage is changed to sessionStorage', inject(function( $window) {
      var value = 111;
      newStore.setStorage('sessionStorage');
      newStore.set('wayne', value);

      expect(newStore.get('wayne')).to.equal(value);
      expect($window.sessionStorage.getItem('auth0.wayne')).to.exist;
      expect($window.sessionStorage.getItem('auth0.wayne')).to.equal(value.toString());
      expect($window.sessionStorage.getItem('wayne')).to.not.exist;
    }));

    it('should should save items correctly when the storage is changed to localStorage', inject(function($window) {
      var value = 222;
      newStore.setStorage('localStorage');
      newStore.set('wayne', value);

      expect(newStore.get('wayne')).to.equal(value);
      expect($window.localStorage.getItem('auth0.wayne')).to.exist;
      expect($window.localStorage.getItem('auth0.wayne')).to.equal(value.toString());
      expect($window.localStorage.getItem('wayne')).to.not.exist;
    }));

    it('should should save items correctly when the storage is changed to cookieStorage', inject(function() {
      var value = 333;
      newStore.setStorage('cookieStorage');
      newStore.set('wayne', value);

      expect(newStore.get('wayne')).to.equal(value);
      expect($cookieStore.get('auth0.wayne')).to.equal(JSON.stringify(value));
    }));
  });
});

