const { sanitize } = require('@strapi/utils');
const { pick } = require('lodash');

module.exports = (plugin) => {
  plugin.controllers.user.me = async (ctx) => {
    // Exctract user data from request
    const userInfo = ctx.state.user;
    const { auth } = ctx.state;
    const schema = strapi.getModel('plugin::users-permissions.user');

    // Fetch user record
    const userRecord = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      1,
      {
        populate: {
          profilePicture: true,
        },
      },
    );

    // Sanitize user the Strapi way
    const sanitizedUser = await sanitize.contentAPI.output(userInfo, schema, {
      auth,
    });
    ctx.body = {
      ...pick(sanitizedUser, ['username', 'email', 'firstName', 'lastName']),
      profilePicture: userRecord.profilePicture?.url,
    };
  };

  return plugin;
};
