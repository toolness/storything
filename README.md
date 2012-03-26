This is a fork of the [Love Bomb Builder](https://github.com/toolness/lovebomb.me) made for the Knight-Mozilla [OpenNews](http://www.mozillaopennews.org/) program. It's a prototype intended to teach journalists how to create and remix content on the Web.

## Prerequisites

* node.js
* npm
* an API key for the [Readability API][]

## Quick Start

    git clone git://github.com/toolness/storything.git
    cd storything
    npm install
    cp config.js.sample config.js

Edit `config.js` as necessary, then run:

    node app.js
    
Then point your browser to http://localhost:3000/.

  [Readability API]: http://www.readability.com/publishers/api
