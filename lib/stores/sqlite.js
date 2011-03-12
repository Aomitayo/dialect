var sqlite = require('sqlite'),
    sqlizer = require('../helpers/sqlizer');

/**
 * Initialize Store with the given `options`.
 *
 * @param {Object} options [database, table]
 * @return store
 */
module.exports = function (options) {

  options = options || {};

  var STORE = {},

      _table = options.table || 'dialect',

      _default = function (callback) {
        callback = callback || function () { };
      };

  Object.defineProperty(STORE, 'db', {value : new sqlite.Database()});

  /**
   * Connects to the Store
   *
   * @param {Function} callback
   * @return store
   */
  STORE.connect = function (callback) {

    _default(callback);

    STORE.db.open(options.database || 'dialect.db', function (err) {
      if (err) {
        callback(err, null);
      } else {
        STORE.db.execute(
          'CREATE TABLE IF NOT EXISTS ' + _table +
          ' (original TEXT, locale TEXT, translation TEXT,' +
          ' plural NUMBER, context TEXT, PRIMARY KEY(original, locale, plural, context))',
          function (err, data) {
            callback(err, data);
          }
        );
      }
    });

    return STORE;
  };

  /**
   * Attempt to fetch a translation
   *
   * @param {Object} query
   * @param {Function} callback
   * @return store
   */
  STORE.get = function (query, callback) {

    _default(callback);

    STORE.db.execute(
      sqlizer({table: _table}).find(query).sql,
      function (error, rows) {
        callback(error, error ? [] : rows);
      }
    );

    return STORE;
  };

  /**
   * Add a translation
   *
   * @param {Object} doc {original, locale, [, plural] [, context]}
   * @param {String} translation
   * @param {Function} callback
   * @return store
   */
  STORE.add = function (doc, translation, callback) {

    _default(callback);

    STORE.get(doc, function (err, data) {
      if (err) {
        callback(err, null);
      } else {

        if (!data || data.length === 0) {
          doc.translation = translation;
          STORE.db.execute(sqlizer({table: _table}).insert(doc).sql, callback);
        } else {
          callback(Error('This translation already exists'), null);
        }

      }
    });

    return STORE;
  };

  /**
   * Set a translation
   * If the translation is new, set it to null
   *
   * @param {Object} query {original, locale}
   * @param {String} translation
   * @param {Function} callback
   * @return store
   */
  STORE.set = function (query, translation, callback) {

    _default(callback);

    STORE.db.execute(sqlizer({table: _table}).update(query, {'$set': {translation: translation}}).sql, callback);

    return STORE;
  };

  /**
   * Destroy the translation
   *
   * @param {Object} query {original, locale}
   * @param {Function} callback
   * @return store
   */

  STORE.destroy = function (query, callback) {

    _default(callback);

    STORE.db.execute(sqlizer({table: _table}).remove(query).sql, callback);

    return STORE;
  };

  /**
   * Fetch number of translations.
   *
   * @param {Object} query {locale, translation...} [optional]
   * @param {Function} callback
   * @return store
   */
  STORE.count = function (query, callback) {

    _default(callback);

    STORE.db.execute(sqlizer({table: _table}).find(query).count().sql, function (err, data) {
      callback(err, !err && data && data.length ? data[0].count : 0);
    });

    return STORE;
  };

  return STORE;
};
