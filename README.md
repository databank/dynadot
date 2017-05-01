## npm package to check availability and register domains with Dynadot


```
npm install @databank/dynadot

var dynadot = require('@databank/dynadot')({key: "your-dynadot-api-key"})

// check domain availability
dynadot.search(['mydomain.com', 'inexisting.extension','hopethisdomainisnotregistered.com'], function(err, res ) {
	console.log(err, res )
})

// register the domain for 1 year
dynadot.register('hopethisdomainisnotregistered.com', 1 ,function(err, res ) {
	console.log(err, res )
})

// set nameservers
dynadot.register('hopethisdomainisnotregistered.com', ['ns-1292.awsdns-33.org','ns-250.awsdns-31.com'] ,function(err, res ) {
	console.log(err, res )
})
```


Note:  
Dynadot requires api requests to be made from known IPs  
If you are in a setup where you do not have a fixed outgoing IP  
(eg. AWS Lambda and you're too busy to setup a VPC with custom NAT gw)  
you can setup your own proxy server:  

```
npm install -g proxy

proxy --port 5678 &

```  

and then have @databank/dynadot route calls trough this server's IP  
```
var dynadot = require('@databank/dynadot')({
	key: "your-dynadot-api-key",
	proxy: "http://1.2.3.4:5678",
})
```
