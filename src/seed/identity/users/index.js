// Lib modules
const { omit } = require('lodash');

// Seed archive
const archive = require('./seed.json');
const { users } = archive;

/**
 * Seeds default users and associates them to corresponding roles
 * @param {Object} strapi The strapi context object
 */
module.exports = async ({ strapi }) => {
  /* ******************************* ADMIN USER ******************************* */

  // Admin account params
  const accountParams = {
    username: process.env.DEFAULT_SEED_ADMIN_USERNAME || 'emiketic',
    password: process.env.DEFAULT_SEED_ADMIN_PASSWORD || 'Em20Kt15',
    firstname: process.env.DEFAULT_SEED_ADMIN_FIRST_NAME || 'EMIKETIC',
    lastname: process.env.DEFAULT_SEED_ADMIN_LAST_NAME || 'DevOps',
    email: process.env.DEFAULT_SEED_ADMIN_EMAIL || 'devops@emiketic.com',
    blocked: false,
    isActive: true,
  };

  // Create default admin user
  try {
    const existingDefaultAdmin =
      await strapi.admin.services.user.findOneByEmail(accountParams.email);
    if (!existingDefaultAdmin) {
      await strapi.admin.services.user.create({
        ...accountParams,
      });
      strapi.log.info(
        `[seed] Created default admin account (${accountParams.email}) `,
      );
    } else {
      strapi.log.info(
        `[seed] Default admin account already exists (${accountParams.email}) - skipping`,
      );
    }
  } catch (error) {
    strapi.log.error(
      `[seed] Could not create default admin account (${accountParams.email})`,
      error,
    );
  }

  /* ****************************** REGULAR USERS ***************************** */
  try {
    // Load all existing roles
    const existingRoles = await strapi.plugins[
      'users-permissions'
    ].services.role.getRoles();

    // Load all existing users
    const existingUsers = await strapi.plugins[
      'users-permissions'
    ].services.user.fetchAll();
    await Promise.all(
      users
        // Discard users by:
        // 1) Username manually because the `users-permissions`
        //    plugin tolerate duplicate usernames
        // 2) Role invalidity (role must have corresponding role in DB
        //    with same name)
        .filter(
          (u) =>
            existingUsers.find((eu) => eu.username === u.username) ===
              undefined && existingRoles.find((r) => r.name === u.roleName),
        )
        // For each archive unique user, create its counterpart
        .map(async (u) => {
          await strapi.plugins['users-permissions'].services.user.add({
            ...omit(u, 'role'),
            role: existingRoles.find((r) => r.name === u.roleName).id,
            provider: 'local',
            confirmed: true,
          });
        }),
    );
    strapi.log.info('[seed] Seeded default users');
  } catch (error) {
    strapi.log.error('[seed] An error occured while seeding users', error);
  }
};
