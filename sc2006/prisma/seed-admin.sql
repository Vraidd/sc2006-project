-- Seed or update an admin account
-- Default login:
--   email: admin@admin.com
--   password: 123qwe@W

INSERT INTO "users" (
  "id",
  "name",
  "password",
  "email",
  "role",
  "verified",
  "status",
  "created_at",
  "updated_at"
)
VALUES (
  'admin_seed_20260408',
  'Admin',
  '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS',
  'admin@admin.com',
  'ADMIN',
  true,
  'ACTIVE',
  NOW(),
  NOW()
)
ON CONFLICT ("email")
DO UPDATE SET
  "name" = EXCLUDED."name",
  "password" = EXCLUDED."password",
  "role" = EXCLUDED."role",
  "verified" = EXCLUDED."verified",
  "status" = EXCLUDED."status",
  "updated_at" = NOW();
