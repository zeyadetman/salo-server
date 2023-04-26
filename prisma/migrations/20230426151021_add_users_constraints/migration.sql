CREATE OR REPLACE FUNCTION user_type_check_on_parcel()
  RETURNS TRIGGER
AS $$
BEGIN
  IF (SELECT type FROM "User" WHERE id = NEW.ownerId) != 'SENDER' THEN
    RAISE EXCEPTION 'Only sender can create parcel';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;




CREATE OR REPLACE FUNCTION user_type_check_on_order()
  RETURNS TRIGGER
AS $$
BEGIN
  IF (SELECT type FROM "User" WHERE id = NEW.bikerId) != 'BIKER' THEN
    RAISE EXCEPTION 'Only biker can create order';
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;


CREATE TRIGGER "User_type_check" BEFORE INSERT OR UPDATE ON "Parcel"
FOR EACH ROW
EXECUTE PROCEDURE "user_type_check_on_parcel"();

CREATE TRIGGER "User_type_check" BEFORE INSERT OR UPDATE ON "Order"
FOR EACH ROW
EXECUTE PROCEDURE "user_type_check_on_order"();