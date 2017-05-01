var request = require('request')
var https = require('https')
var HttpsProxyAgent = require('https-proxy-agent')

module.exports = function(options) {
	return new Dynadot(options)
}

function Dynadot(options) {
	//if (options.proxy)
	//	this.agent = new HttpsProxyAgent(options.proxy)

	this.options = options
	this.options.proxy = options.proxy || false
}


Dynadot.prototype.search = function(domains, cb) {
	var rqurl = 'https://api.dynadot.com/api2.html?key=' + this.options.key + '&command=search&' + domains.map(function(d, idx) { return "domain"+(idx+1)+"="+d }).join('&') + '&show_price=1'

	request({
		'url':rqurl,
		'proxy': this.options.proxy
	}, function (err, res, body) {
		if (err)
			return cb(err)

		if (res.statusCode !== 200)
			return cb({errorCode: "Invalid HTTP response code"})


		var dynadot_status = (body.split("\n\n")[0] || '').split(',')
		var dynadot_data   = body.split("\n\n").slice(1).join("\n\n")

		if (dynadot_status[0] === 'error')
			return  cb({errorCode: "error", errorMessage: dynadot_status[1] })

		if (dynadot_status[0] !== 'ok')
			return  cb({errorCode: "Invalid dynadot response, expected ok, received " + dynadot_status[0], errorMessage: dynadot_status[1] })

		//console.log(body)

		var dynadot_data = dynadot_data.split("\n")
		.filter(function(d) { if (d.trim()=='') return false; return true})
		.map(function(d) {
			return d.split(',')
		})

		if (dynadot_data[0][0] == 'error')
			return cb({errorCode: dynadot_data[0][1] })


		cb( null,dynadot_data.map(function(d) {
			return {
				//id: d[0],
				name: d[1],
				available: d[3] === 'error' ? false : (d[3] == 'yes' ? true : false),
				error: ['error','offline','system_busy'].indexOf(d[3]) !== -1 ? d[4] : null,
				price: d[3] == 'yes' ? {
					amount: (d[4].split(' in '))[0],
					currency: (d[4].split(' in '))[1],
				} : null,

			}
		}))

	})
}
Dynadot.prototype.register = function(domain, duration, cb) {
	var rqurl = 'https://api.dynadot.com/api2.html?key=' + this.options.key + '&command=register&domain=' + domain + '&duration='+duration
	request({
		'url':rqurl,
		'proxy': this.options.proxy
	}, function (err, res, body) {
		if (err)
			return cb(err)

		if (res.statusCode !== 200)
			return cb({errorCode: "Invalid HTTP response code"})


		var dynadot_status = (body.split("\n\n")[0] || '').split(',')
		var dynadot_data   = body.split("\n\n").slice(1).join("\n\n")

		if (dynadot_status[0] === 'error')
			return  cb({errorCode: "error", errorMessage: dynadot_status[1] })

		if (dynadot_status[0] !== 'ok')
			return  cb({errorCode: "Invalid dynadot response, expected ok, received " + dynadot_status[0], errorMessage: dynadot_status[1] })

		var dynadot_data = dynadot_data.split("\n")
		.filter(function(d) { if (d.trim()=='') return false; return true})
		.map(function(d) {
			return d.split(',')
		})

		// 0: success, not_available, insufficient_funds, offline, system_busy, error
		if (dynadot_data[0][0] == 'not_available')
			return  cb({errorCode: "not_available", errorMessage: 'The domain is not available' })

		if (dynadot_data[0][0] == 'insufficient_funds')
			return  cb({errorCode: "insufficient_funds", errorMessage: 'Not enough account balance to process this registration' })

		if (dynadot_data[0][0] == 'offline')
			return  cb({errorCode: "offline", errorMessage: 'The central registry for this domain is currently offline' })

		if (dynadot_data[0][0] == 'system_busy')
			return  cb({errorCode: "system_busy", errorMessage: 'All connections are busy' })

		if (dynadot_data[0][0] == 'error')
			return  cb({errorCode: "error", errorMessage: dynadot_data[0][1] })

		if (dynadot_data[0][0] == 'success')
			return  cb(null, { expire: dynadot_data[0][2]})

		return  cb({errorCode: "error", errorMessage: 'Unhandled error', rar_response: body })
	})
}
