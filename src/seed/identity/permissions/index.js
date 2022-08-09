// Permission archive
const archive = require('./seed.json');
const { rolePermissions } = archive;

/**
 * Seeds default permissions and associates them to corresponding roles
 * @param {Object} strapi The strapi context object
 */
module.exports = async ({ strapi }) => {
  try {
    // Load existing roles
    const existingRoles = await strapi.plugins[
      'users-permissions'
    ].services.role.find();

    // Filter valid roles
    const mappedRoles = existingRoles.filter((r) =>
      rolePermissions.find((rp) => rp.roleName === r.name),
    );

    // Apply permissions to valid roles
    await Promise.all(
      rolePermissions.map(async (rp) => {
        // Load permission correspondant role
        const permissionRole = await strapi.plugins[
          'users-permissions'
        ].services.role.findOne(
          mappedRoles.find((r) => r.name === rp.roleName).id,
        );

        // For each collection in the role permission pair...
        await Promise.all(
          rp.permissions.map(async (p) => {
            const { collection, actions } = p;
            // Bind the resolved role object to each available action
            actions.forEach((action) => {
              permissionRole.permissions[`api::${collection}`].controllers[
                collection
              ][action].enabled = true;
            });

            // Commit change in database via plugin
            await strapi.plugins['users-permissions'].services.role.updateRole(
              permissionRole.id,
              {
                permissions: permissionRole.permissions,
              },
            );
          }),
        );
      }),
    );
    strapi.log.info('[seed] Applies default permissions to seeded roles');
  } catch (error) {
    strapi.log.error(
      '[seed] An error occured while applying permissions to roles',
      error,
    );
  }
};
