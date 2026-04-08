-- DropIndex
DROP INDEX "bookings_owner_id_caregiver_id_pet_id_start_date_key";

-- CreateIndex
CREATE INDEX "bookings_owner_id_caregiver_id_pet_id_start_date_idx" ON "bookings"("owner_id", "caregiver_id", "pet_id", "start_date");
