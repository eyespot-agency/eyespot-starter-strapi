module.exports = ({ env }) => ({
  apiToken: {
    salt: env('API_TOKEN_SALT', 'HMqKedK23jxuq2haABMMrnpcyAEndL33'),
  },
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8f19b849b7bff9859ed7d0f87680fa09'),
  },
});
