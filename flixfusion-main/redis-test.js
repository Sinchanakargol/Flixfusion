const { createClient } = require('redis');

const client = createClient({
  url: 'rediss://default:rIfRlJgUYx2Ps1ErCdnOuoclbwxpXJ13@redis-17310.c239.us-east-1-2.ec2.redns.redis-cloud.com:17310'
});

client.connect()
  .then(() => console.log('✅ Connected to Redis Cloud'))
  .catch((err) => console.error('❌ Redis connection error:', err));
