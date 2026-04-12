-- Seed sample owners and caregivers
-- Default password for all seeded users (bcrypt hash): Pawsport123!

-- 1) Upsert owner users
INSERT INTO "users" (
  "id", "name", "password", "email", "role", "verified", "status", "phone", "location", "created_at", "updated_at"
)
VALUES
  ('owner_seed_101', 'Amelia Wong', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'amelia.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011001', 'Queenstown', NOW(), NOW()),
  ('owner_seed_102', 'Kevin Tan', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'kevin.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011002', 'Bishan', NOW(), NOW()),
  ('owner_seed_103', 'Nadia Rahim', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'nadia.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011003', 'Kovan', NOW(), NOW()),
  ('owner_seed_104', 'Jared Lee', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'jared.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011004', 'Ang Mo Kio', NOW(), NOW()),
  ('owner_seed_105', 'Felicia Lim', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'felicia.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011005', 'Marine Parade', NOW(), NOW()),
  ('owner_seed_106', 'Shawn Goh', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'shawn.owner@example.com', 'OWNER', true, 'ACTIVE', '+6593011006', 'Clementi', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "password" = EXCLUDED."password",
  "role" = EXCLUDED."role",
  "verified" = EXCLUDED."verified",
  "status" = EXCLUDED."status",
  "phone" = EXCLUDED."phone",
  "location" = EXCLUDED."location",
  "updated_at" = NOW();

-- 2) Upsert caregiver users
INSERT INTO "users" (
  "id", "name", "password", "email", "role", "verified", "status", "phone", "location", "created_at", "updated_at"
)
VALUES
  ('caregiver_seed_201', 'Hannah Koh', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'hannah.caregiver@example.com', 'CAREGIVER', true, 'ACTIVE', '+6594012001', 'Pasir Ris', NOW(), NOW()),
  ('caregiver_seed_202', 'Isaac Low', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'isaac.caregiver@example.com', 'CAREGIVER', true, 'ACTIVE', '+6594012002', 'Bukit Panjang', NOW(), NOW()),
  ('caregiver_seed_203', 'Mei Lin Tan', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'meilin.caregiver@example.com', 'CAREGIVER', true, 'ACTIVE', '+6594012003', 'Simei', NOW(), NOW()),
  ('caregiver_seed_204', 'Farid Hamzah', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'farid.caregiver@example.com', 'CAREGIVER', true, 'ACTIVE', '+6594012004', 'Choa Chu Kang', NOW(), NOW()),
  ('caregiver_seed_205', 'Zoe Chia', '$2b$10$CFgIHYO6ztiJaPwHvcXBS.L62t4iKUObRxdhpVT3JY1LicB6kkvYS', 'zoe.caregiver@example.com', 'CAREGIVER', true, 'ACTIVE', '+6594012005', 'Woodlands', NOW(), NOW())
ON CONFLICT ("email") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "password" = EXCLUDED."password",
  "role" = EXCLUDED."role",
  "verified" = EXCLUDED."verified",
  "status" = EXCLUDED."status",
  "phone" = EXCLUDED."phone",
  "location" = EXCLUDED."location",
  "updated_at" = NOW();

-- 3) Upsert caregiver profiles for seeded caregivers
INSERT INTO "caregiver_profiles" (
  "id", "name", "biography", "daily_rate", "petPreferences", "dog_sizes", "services", "location",
  "experience_years", "is_accepting_requests", "verified", "average_rating", "total_reviews", "completed_bookings",
  "created_at", "updated_at"
)
VALUES
  (
    (SELECT "id" FROM "users" WHERE "email" = 'hannah.caregiver@example.com'),
    'Hannah Koh',
    'Calm and patient with senior pets and anxious dogs.',
    50,
    ARRAY['DOG','CAT']::"PetType"[],
    ARRAY['SMALL','MEDIUM']::"DogSize"[],
    ARRAY['BOARDING','WALKING','MED_SENIOR']::"ServiceType"[],
    'Pasir Ris',
    5,
    true,
    false,
    4.8,
    26,
    33,
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "users" WHERE "email" = 'isaac.caregiver@example.com'),
    'Isaac Low',
    'Specializes in active dogs and structured outdoor routines.',
    62,
    ARRAY['DOG']::"PetType"[],
    ARRAY['MEDIUM','LARGE']::"DogSize"[],
    ARRAY['WALKING','DAYCARE','TRAINING_OBEDIENCE']::"ServiceType"[],
    'Bukit Panjang',
    4,
    true,
    false,
    4.6,
    19,
    28,
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "users" WHERE "email" = 'meilin.caregiver@example.com'),
    'Mei Lin Tan',
    'Gentle caregiver for cats, birds, and smaller companion pets.',
    56,
    ARRAY['CAT','BIRD','SMALL_ANIMAL']::"PetType"[],
    ARRAY[]::"DogSize"[],
    ARRAY['HOUSE_SITTING','DROP_IN','MED_ORAL']::"ServiceType"[],
    'Simei',
    5,
    true,
    false,
    4.9,
    31,
    44,
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "users" WHERE "email" = 'farid.caregiver@example.com'),
    'Farid Hamzah',
    'Reliable for multi-day boarding with medication support.',
    58,
    ARRAY['DOG','CAT']::"PetType"[],
    ARRAY['SMALL','MEDIUM']::"DogSize"[],
    ARRAY['BOARDING','MED_ORAL','MED_RECOVERY']::"ServiceType"[],
    'Choa Chu Kang',
    6,
    true,
    false,
    4.7,
    24,
    37,
    NOW(),
    NOW()
  ),
  (
    (SELECT "id" FROM "users" WHERE "email" = 'zoe.caregiver@example.com'),
    'Zoe Chia',
    'Experienced in drop-ins, house-sitting, and enrichment play sessions.',
    54,
    ARRAY['DOG']::"PetType"[],
    ARRAY['SMALL','MEDIUM']::"DogSize"[],
    ARRAY['HOUSE_SITTING','DROP_IN','WALKING']::"ServiceType"[],
    'Woodlands',
    4,
    true,
    false,
    4.5,
    16,
    22,
    NOW(),
    NOW()
  )
ON CONFLICT ("id") DO UPDATE
SET
  "name" = EXCLUDED."name",
  "biography" = EXCLUDED."biography",
  "daily_rate" = EXCLUDED."daily_rate",
  "petPreferences" = EXCLUDED."petPreferences",
  "dog_sizes" = EXCLUDED."dog_sizes",
  "services" = EXCLUDED."services",
  "location" = EXCLUDED."location",
  "experience_years" = EXCLUDED."experience_years",
  "is_accepting_requests" = EXCLUDED."is_accepting_requests",
  "verified" = EXCLUDED."verified",
  "average_rating" = EXCLUDED."average_rating",
  "total_reviews" = EXCLUDED."total_reviews",
  "completed_bookings" = EXCLUDED."completed_bookings",
  "updated_at" = NOW();

-- 4) Upsert pets (10 entries)
INSERT INTO "pets" (
  "id", "owner_id", "name", "type", "breed", "vaccinationStatus", "age", "weight", "special_needs", "created_at", "updated_at"
)
VALUES
  ('pet_seed_001', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), 'Tofu', 'DOG', 'Shiba Inu', 'Up to date', 3, 9.8, NULL, NOW(), NOW()),
  ('pet_seed_002', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), 'Milo', 'CAT', 'Siberian', 'Up to date', 2, 4.6, 'Sensitive to loud noises', NOW(), NOW()),
  ('pet_seed_003', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), 'Sunny', 'BIRD', 'Budgie', 'Up to date', 1, 0.1, NULL, NOW(), NOW()),
  ('pet_seed_004', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), 'Atlas', 'DOG', 'Labrador', 'Up to date', 5, 28.0, 'Hip care exercises', NOW(), NOW()),
  ('pet_seed_005', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), 'Nori', 'CAT', 'Maine Coon', 'Up to date', 4, 6.1, NULL, NOW(), NOW()),
  ('pet_seed_006', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), 'Pixel', 'FISH', 'Goldfish', 'N/A', 1, 0.12, NULL, NOW(), NOW()),
  ('pet_seed_007', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), 'Kopi', 'DOG', 'Toy Poodle', 'Up to date', 2, 3.1, 'No poultry treats', NOW(), NOW()),
  ('pet_seed_008', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), 'Lyra', 'CAT', 'Persian', 'Up to date', 6, 5.0, 'Daily oral meds', NOW(), NOW()),
  ('pet_seed_009', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), 'Pebble', 'SMALL_ANIMAL', 'Hamster', 'N/A', 1, 0.08, NULL, NOW(), NOW()),
  ('pet_seed_010', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), 'Iggy', 'REPTILE', 'Crested Gecko', 'N/A', 3, 0.06, 'No handling after feeding', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE
SET
  "owner_id" = EXCLUDED."owner_id",
  "name" = EXCLUDED."name",
  "type" = EXCLUDED."type",
  "breed" = EXCLUDED."breed",
  "vaccinationStatus" = EXCLUDED."vaccinationStatus",
  "age" = EXCLUDED."age",
  "weight" = EXCLUDED."weight",
  "special_needs" = EXCLUDED."special_needs",
  "updated_at" = NOW();

-- 5) Upsert bookings (10 entries)
INSERT INTO "bookings" (
  "id", "owner_id", "caregiver_id", "pet_id", "start_date", "end_date", "status", "total_price", "special_instructions", "created_at", "updated_at"
)
VALUES
  ('booking_seed_001', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'hannah.caregiver@example.com'), 'pet_seed_001', NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days', 'COMPLETED', 100, 'Morning and evening walks', NOW(), NOW()),
  ('booking_seed_002', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'meilin.caregiver@example.com'), 'pet_seed_002', NOW() - INTERVAL '15 days', NOW() - INTERVAL '13 days', 'COMPLETED', 118, 'Wet food only', NOW(), NOW()),
  ('booking_seed_003', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'zoe.caregiver@example.com'), 'pet_seed_003', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days', 'COMPLETED', 72, 'Feed once daily', NOW(), NOW()),
  ('booking_seed_004', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'isaac.caregiver@example.com'), 'pet_seed_004', NOW() - INTERVAL '30 days', NOW() - INTERVAL '27 days', 'COMPLETED', 198, 'Avoid stairs when possible', NOW(), NOW()),
  ('booking_seed_005', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'farid.caregiver@example.com'), 'pet_seed_005', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 days', 'IN_PROGRESS', 124, 'Brush coat daily', NOW(), NOW()),
  ('booking_seed_006', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'hannah.caregiver@example.com'), 'pet_seed_006', NOW() + INTERVAL '2 days', NOW() + INTERVAL '3 days', 'CONFIRMED', 78, 'Quiet room preferred', NOW(), NOW()),
  ('booking_seed_007', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'isaac.caregiver@example.com'), 'pet_seed_007', NOW() + INTERVAL '5 days', NOW() + INTERVAL '7 days', 'PENDING', 160, 'No chicken treats', NOW(), NOW()),
  ('booking_seed_008', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'meilin.caregiver@example.com'), 'pet_seed_008', NOW() - INTERVAL '12 days', NOW() - INTERVAL '10 days', 'COMPLETED', 136, 'Give medication after dinner', NOW(), NOW()),
  ('booking_seed_009', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'zoe.caregiver@example.com'), 'pet_seed_009', NOW() + INTERVAL '10 days', NOW() + INTERVAL '11 days', 'CONFIRMED', 74, 'Handle gently', NOW(), NOW()),
  ('booking_seed_010', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'farid.caregiver@example.com'), 'pet_seed_010', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 days', 'COMPLETED', 90, 'Keep enclosure temperature stable', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE
SET
  "owner_id" = EXCLUDED."owner_id",
  "caregiver_id" = EXCLUDED."caregiver_id",
  "pet_id" = EXCLUDED."pet_id",
  "start_date" = EXCLUDED."start_date",
  "end_date" = EXCLUDED."end_date",
  "status" = EXCLUDED."status",
  "total_price" = EXCLUDED."total_price",
  "special_instructions" = EXCLUDED."special_instructions",
  "updated_at" = NOW();

-- 6) Upsert reviews for completed bookings
INSERT INTO "reviews" (
  "id", "booking_id", "from_user_id", "to_user_id", "rating", "comment", "created_at", "updated_at"
)
VALUES
  ('review_seed_001', 'booking_seed_001', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'hannah.caregiver@example.com'), 5, 'Super attentive and punctual updates.', NOW(), NOW()),
  ('review_seed_002', 'booking_seed_002', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'meilin.caregiver@example.com'), 5, 'Great with shy cats, highly recommended.', NOW(), NOW()),
  ('review_seed_003', 'booking_seed_003', (SELECT "id" FROM "users" WHERE "email" = 'amelia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'zoe.caregiver@example.com'), 4, 'Smooth handover and clear communication.', NOW(), NOW()),
  ('review_seed_004', 'booking_seed_004', (SELECT "id" FROM "users" WHERE "email" = 'kevin.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'isaac.caregiver@example.com'), 5, 'Atlas came back happy and calm.', NOW(), NOW()),
  ('review_seed_005', 'booking_seed_008', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'meilin.caregiver@example.com'), 5, 'Medication instructions followed perfectly.', NOW(), NOW()),
  ('review_seed_006', 'booking_seed_010', (SELECT "id" FROM "users" WHERE "email" = 'nadia.owner@example.com'), (SELECT "id" FROM "users" WHERE "email" = 'farid.caregiver@example.com'), 4, 'Excellent care for our gecko.', NOW(), NOW())
ON CONFLICT ("id") DO UPDATE
SET
  "booking_id" = EXCLUDED."booking_id",
  "from_user_id" = EXCLUDED."from_user_id",
  "to_user_id" = EXCLUDED."to_user_id",
  "rating" = EXCLUDED."rating",
  "comment" = EXCLUDED."comment",
  "updated_at" = NOW();

-- 7) Upsert payments for seeded bookings (all completed)
INSERT INTO "payments" (
  "id", "booking_id", "amount", "status", "created_at", "updated_at", "paid_at"
)
VALUES
  ('payment_seed_001', 'booking_seed_001', 100, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_002', 'booking_seed_002', 118, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_003', 'booking_seed_003', 72, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_004', 'booking_seed_004', 198, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_005', 'booking_seed_005', 124, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_006', 'booking_seed_006', 78, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_007', 'booking_seed_007', 160, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_008', 'booking_seed_008', 136, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_009', 'booking_seed_009', 74, 'COMPLETED', NOW(), NOW(), NOW()),
  ('payment_seed_010', 'booking_seed_010', 90, 'COMPLETED', NOW(), NOW(), NOW())
ON CONFLICT ("booking_id") DO UPDATE
SET
  "amount" = EXCLUDED."amount",
  "status" = EXCLUDED."status",
  "paid_at" = EXCLUDED."paid_at",
  "updated_at" = NOW();
