const IORedis =require( 'ioredis')
const config  = require( './config')


const isMaxmemoryPolicyNoeviction = async () => {
	let redis
	
	
	const redisOptions = {
		port: config.redisPort,
		host: config.redisHost,
		username: config.redisUsername,
		password: config.redisPassword,
	}

	try {
		redis = new IORedis(redisOptions)
   

		const maxmemoryPolicyConfig = await (redis).config(
			'GET',
			'maxmemory-policy'
		)
		if (
			maxmemoryPolicyConfig.length == 2 &&
      maxmemoryPolicyConfig[0] === 'maxmemory-policy' &&
      maxmemoryPolicyConfig[1] === 'noeviction'
		) {
			return true
		}
	} finally {
		if (redis != undefined) {
			redis.disconnect()
		}
	}
	return false
}

module.exports=isMaxmemoryPolicyNoeviction