/**
 * Seeds default admin super user
 * @param {Object} strapi The strapi context object
 */
module.exports = async ({ strapi }) => {
  // Admin account params
  const adminAccountParams = {
    username: process.env.DEFAULT_SEED_ADMIN_USERNAME || 'emiketic',
    password: process.env.DEFAULT_SEED_ADMIN_PASSWORD || 'Em20Kt15',
    firstname: process.env.DEFAULT_SEED_ADMIN_FIRST_NAME || 'EMIKETIC',
    lastname: process.env.DEFAULT_SEED_ADMIN_LAST_NAME || 'DevOps',
    email: process.env.DEFAULT_SEED_ADMIN_EMAIL || 'devops@emiketic.com',
    registrationToken: null,
    blocked: false,
    isActive: true,
  };

  // Create default admin user
  try {
    // Pre-seed default admin roles in order to be able to use them further down
    await strapi.admin.services.role.createRolesIfNoneExist();

    // Check for existing admin users
    const existingDefaultAdmin =
      await strapi.admin.services.user.findOneByEmail(adminAccountParams.email);
    const superAdminRole = await strapi.admin.services.role.getSuperAdmin();

    // Seed default admin user
    if (!existingDefaultAdmin) {
      await strapi.admin.services.user.create({
        ...adminAccountParams,
        roles: superAdminRole.id,
      });
      strapi.log.info(
        `[seed] Created default admin account (${adminAccountParams.email}) `,
      );
    } else {
      strapi.log.info(
        `[seed] Default admin account already exists (${adminAccountParams.email}) - skipping`,
      );
    }
  } catch (error) {
    strapi.log.error(
      `[seed] Could not create default admin account (${adminAccountParams.email})`,
      error,
    );
  }
};
