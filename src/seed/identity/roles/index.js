// Seed archive
const archive = require('./seed.json');
const { roles } = archive;

/**
 * Seeds default roles
 * @param {Object} strapi The strapi context object
 */
module.exports = async ({ strapi }) => {
  try {
    const existingRoles = await strapi.plugins[
      'users-permissions'
    ].services.role.find();
    await Promise.all(
      roles
        // Discard roles by name manually because the `users-permissions`
        // plugin tolerate duplicate role names
        .filter(
          (r) => existingRoles.find((er) => er.name === r.name) === undefined,
        )
        // For each archive unique role, create its counterpart
        .map(async (r) => {
          await strapi.plugins['users-permissions'].services.role.createRole(r);
        }),
    );
    strapi.log.info('[seed] Seeded default roles');
  } catch (error) {
    strapi.log.error('[seed] An error occured while seeding roles', error);
  }
};
