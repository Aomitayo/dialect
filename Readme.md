# Dialect

Dialect is a painless nodejs library to deal with i18n, and L10n.

This module is currently *under construction*

## Philosphy

* Scalable: The translations should be available to any number of machines.
* Fast: Getting translations from memory if possible.
* Reliable: Translations should be always available on a central repository/database.
* Flexible: You should be able to use your favorite storage solution.

## Example

    var dialect = require('dialect').dialect({
      path:'./dictionaries',
      base_locale: 'en',
      storage: {mongodb: {database: 'dev'}},
    });

    // change our locale to es
    dialect.config('locale', 'es');


    console.log(dialect.translate('Hello World!')); // MongoDB (it caches to a JSON file)
    // => 'Hola Mundo'

    console.log(dialect.translate('Hello World!')); // Memory cached
    // => 'Hola Mundo'

    delete require('./dictionaries')['es']['Hello World!');
    console.log(dialect.translate('Hello World!')); // JSON dictionary cached
    // => 'Hola Mundo'


    // count
    [1, 2, 3].forEach(function (count) {
      console.log(dialect.translate([
        'Hello World',
        'Hello Worlds',
        count
      ]));
    });
    // => 'Hola Mundo'
    // => 'Hola Mundos'
    // => 'Hola Mundos'


    // context
    ['female', 'male'].forEach(function (gender) {
      console.log(dialect.translate([
        'My friends',
        gender
      ]));
    });
    // => 'Mis amigas'
    // => 'Mis amigos'


    // count + context + string interpolation
    [1, 2].forEach(function (count) {
      ['female', 'male'].forEach(function (gender) {
        console.log(dialect.translate([
          'You have {count} {what}',
          'You have {count} {what}',
          {count: count, context: context, what: 'friends'}
        ]));
      });
    });
    // => 'Mi amiga'
    // => 'Mi amigo'
    // => 'Mis amigas'
    // => 'Mis amigos'
