           ,,    ,,             ,,
         `7MM    db           `7MM                    mm
           MM                   MM                    MM
      ,M""bMM  `7MM   ,6"Yb.    MM  .gP"Ya   ,p6"bo mmMMmm
    ,AP    MM    MM  8)   MM    MM ,M'   Yb 6M'  OO   MM
    8MI    MM    MM   ,pm9MM    MM 8M"""""" 8M        MM
    `Mb    MM    MM  8M   MM    MM YM.    , YM.    ,  MM
     `Wbmd"MML..JMML.`Moo9^Yo..JMML.`Mbmmd'  YMbmd'   `Mbmo


Dialect is the painless nodejs module that deals with i18n.

## Install

    npm install dialect

## Philosphy

* Scalable: The translations should be available to any number of machines.
* Fast: Getting translations from memory if possible.
* Reliable: Translations should be always available on a central repository/database.
* Flexible: You should be able to use your favorite storage solution.

## Example

    var dialect = require('dialect'),
        d = dialect.dialect({current_locale: 'es', store: 'mongodb'}, function (err, store) {
          d.get('Hello World!'); // => Hola mundo
        }).reCache();

## API

* `config`:
* `get`:
* `set`:
* `reCache`:

### Usings counts

A _counts_ are params that allow you to output a string using
singular or plural.
You need to provide an array with the singular, plural and
the number.

    [1, 2, 3].forEach(function (i) {
      dialect.get([
        'Hello World',
        'Hello Worlds',
        {count: i}
      ]);
    });

    // => 'Hola Mundo'
    // => 'Hola Mundos'
    // => 'Hola Mundos'


### Using contexts

A _context_ is a param that allows you to give a special meaning
about a sentence. It helps the translator and it may generate
diferent translations depending on the context.

    ['female', 'male'].forEach(function (gender) {
      dialect.get([
        'My friends',
        gender
      ]);
    });
    // => 'Mis amigas'
    // => 'Mis amigos'


### String interpolation

You can put any param you want on the translation strings surrounded
by moustaches {}. Remember that _count_ and _context_ have special
meanings although they can be used with interpolations.

    [1, 2].forEach(function (count) {
      ['female', 'male'].forEach(function (gender) {
        dialect.get([
          'You have {count} friend called {name}',
          'You have {count} friends called {name}',
          {count: count, context: context, name: 'Anna'}
        ]);
      });
    });
    // => 'Tienes 1 amiga que se llama Anna'
    // => 'Tienes 1 amigo que se llama Anna'
    // => 'Tienes 2 amigas que se llaman Anna'
    // => 'Tienes 2 amigos que se llaman Anna'

### Store translations

To store a new translation, use the method `set`.

    dialect.set(
      {original: 'I love gazpacho', locale: 'es'},
      'Me encanta el gazpacho',
      function () {
        // :)
      }
    );

## express-dialect

Do you have an express application and you to deal with i18n? Do you want to see
how dialect works in a real app?

Try [express-dialect](http://www.github.com/masylum/express-dialect)

## Test

Dialect is heavily tested using [testosterone](http://www.github.com/masylum/testosterone)

    make

## Benchmarks

Dialect should not add an overhead to your application on getting translations.
Please run/add benchmarks to ensure that this module performance rocks.

    node benchmakrs/app.js

Have fun!
