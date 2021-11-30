module.exports = function (config) {
  config = Object.assign(
    {
      namespace: '',
      onReady: (_) => {},
    },
    config || {}
  );

  var tracked = {};
  return function (snub) {
    var localStore = {};

    sync(true);

    snub.store = new Proxy(localStore, {
      get: function (target, prop) {
        if (!target[prop]) return undefined;
        return JSON.parse(target[prop]);
      },
      set: async function (target, prop, value) {
        value = JSON.stringify(value);
        if (target[prop] === value) return;
        target[prop] = value;
        snub.poly('store_internal:SET', [prop, value]).send();
        await snub.redis.hset('_snub-store::' + config.namespace, prop, value);
      },
      deleteProperty: function (target, prop) {
        snub.redis.hdel('_snub-store::' + config.namespace, prop);
        snub.poly('store_internal:DEL', prop).send();
        delete target[prop];
      },
    });
    snub.storeSync = function () {
      sync();
    };

    snub.on('store_internal:DEL', function (prop) {
      delete localStore[prop];
    });
    snub.on('store_internal:SET', function (a) {
      var [prop, value] = a;
      localStore[prop] = value;
    });

    async function sync(init) {
      var persisted = await snub.redis.hgetall(
        '_snub-store::' + config.namespace
      );
      if (!init)
        for (var lkey of Object.keys(localStore)) {
          if (!persisted.has(lkey)) delete localStore[lkey];
        }
      for (var pkey of Object.keys(persisted)) {
        localStore[pkey] = persisted[pkey];
      }
      if (init) config.onReady();
    }
  };
};
