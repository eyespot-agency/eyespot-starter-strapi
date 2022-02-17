module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', '8f19b849b7bff9859ed7d0f87680fa09'),
  },
});
