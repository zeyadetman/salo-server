CREATE OR REPLACE FUNCTION check_constraints_on_parcel()
  RETURNS TRIGGER
AS $$
BEGIN
  IF (SELECT type FROM "User" WHERE id = NEW."ownerId") != 'SENDER' THEN
    RAISE EXCEPTION 'Only sender can create parcel';
  END IF;
  IF NEW."pickupId" = NEW."dropoffId" THEN
    RAISE EXCEPTION 'Pickup and dropoff address cannot be the same';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_constraints_on_order()
  RETURNS TRIGGER
AS $$
BEGIN
  IF (SELECT type FROM "User" WHERE id = NEW."bikerId") != 'BIKER' THEN
    RAISE EXCEPTION 'Only biker can create order';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;


CREATE TRIGGER "Parcel_constraints_check" BEFORE INSERT OR UPDATE ON "Parcel"
FOR EACH ROW
EXECUTE PROCEDURE "check_constraints_on_parcel"();

CREATE TRIGGER "Order_constraints_check" BEFORE INSERT OR UPDATE ON "Order"
FOR EACH ROW
EXECUTE PROCEDURE "check_constraints_on_order"();