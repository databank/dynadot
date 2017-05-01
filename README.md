# dynadot


```
npm install @databank/dynadot

var dynadot = require('@databank/dynadot')

var dynadot = require('../index.js')({
	key: "your-dynadot-api-key",

	// dynadot requires api requests to be made from known IPs
	// optional, specity a proxy to route api calls trough it
	// proxy: "http://1.2.3.4:5678",
})


// check domain availability
dynadot.search(['mydomain.com', 'inexisting.extension','hopethisdomainisnotregistered.com'], function(err, res ) {
	console.log(err, res )
})

// register the domain for 1 year
dynadot.register('hopethisdomainisnotregistered.com', 1 ,function(err, res ) {
	console.log(err, res )
})

```
