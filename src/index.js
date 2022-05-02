/* -------------------------------------------------------------------------- */
/*                                Dependencies                                */
/* -------------------------------------------------------------------------- */

// Seed functions
const seedRoles = require('./seed/identity/roles');
const seedPermissions = require('./seed/identity/permissions');
const { seedSuperAdmin, seedUsers } = require('./seed/identity/users');

// Constants
const SeedMode = {
  BARE: 'fixtures-bare',
  FULL: 'fixtures-full',
  MOCKS: 'fixtures-mocks',
};

/* -------------------------------------------------------------------------- */
/*                             Lifecycle functions                            */
/* -------------------------------------------------------------------------- */

module.exports = {
  /* ****************************** REGISTRATION ****************************** */
  /**
   * An asynchronous register function that runs before
   * app is INITIALIZED.
   *
   * This gives you an opportunity to extend code:
   * - Extend plugins
   * - Extend content-types programmatically
   * - Load some environment variables.
   */

  async register(/* Use the strapi object as  the function arugment */) {},

  /* ****************************** BOOTSRAPPING ****************************** */
  /**
   * An asynchronous bootstrap function that runs before
   * app gets STARTED.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   * - Load seed data
   * - Create users/roles
   * - Setup permissions
   * - Run CRON jobs
   */
  async bootstrap({ strapi }) {
    // Seed modes for which to seed users and roles (all)
    const seedScopeUserRoles = [SeedMode.BARE, SeedMode.FULL, SeedMode.MOCKS];
    if (seedScopeUserRoles.includes(process.env.DB_SEED_MODE)) {
      await seedRoles({ strapi });
      await seedPermissions({ strapi });
      await seedSuperAdmin({ strapi });
      if (process.env.DB_SEED_MODE === SeedMode.MOCKS) {
        await seedUsers({ strapi });
      }
    }
  },

  /**
   * Asynchronous function that runs before the application gets shut down.
   * It can be used to gracefully:
   * - Stop services that are running
   * - Clean up plugin actions (e.g. close connections, remove listeners, etc.)
   */

  async destroy(/* Use the strapi object as  the function arugment */) {},
};
