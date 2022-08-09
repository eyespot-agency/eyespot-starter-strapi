// Lib modules
const fs = require('fs');
const { omit } = require('lodash');

// Seed archive
const archive = require('./seed.json');
const { users } = archive;

/**
 * Seeds default users and associates them to corresponding roles
 * @param {Object} strapi The strapi context object
 */
module.exports = async ({ strapi }) => {
  try {
    // Load all existing roles
    const existingRoles = await strapi.plugins[
      'users-permissions'
    ].services.role.find();

    // Load all existing users
    const existingUsers = await strapi.plugins[
      'users-permissions'
    ].services.user.fetchAll();

    // Prepare avatar seed path for file upload
    const rootDir = process.cwd();
    const avatarFolder = `${rootDir}/src/seed/identity/users/avatars`;
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
          // Basic user data
          const createdUser = await strapi.plugins[
            'users-permissions'
          ].services.user.add({
            ...omit(u, 'role'),
            role: existingRoles.find((r) => r.name === u.roleName).id,
            provider: 'local',
            confirmed: true,
          });

          // User profile pictures or avatars
          const fileName = `${u.username}.jpg`;
          const filePath = `${avatarFolder}/${fileName}`;
          const stats = fs.statSync(filePath);
          await strapi.plugins.upload.services.upload.upload({
            data: {
              refId: createdUser.id,
              ref: 'plugin::users-permissions.user',
              source: 'users-permissions',
              field: 'profilePicture',
            },
            files: {
              path: filePath,
              name: fileName,
              type: 'image/jpeg',
              size: stats.size,
            },
          });
        }),
    );
    strapi.log.info('[seed] Seeded default users');
  } catch (error) {
    strapi.log.error('[seed] An error occured while seeding users', error);
  }
};
