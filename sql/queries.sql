-- name: CreateCall :one
INSERT INTO calls (origin, destination, part_number, operation, employee_id, setup, urgent, closed_at, qual_description, qual_check_id, qual_check_datetime_at, eng_description, eng_check_id, eng_check_datetime_at, log_description, log_check_id, log_check_datetime_at, man_description, man_check_id, man_check_datetime_at, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21) RETURNING *;
-- name: GetCall :one
SELECT * FROM calls WHERE id_call = $1 AND company = $2;
-- name: GetAllCalls :many
SELECT * FROM calls WHERE company = $1 ORDER BY id_call DESC ;
-- name: UpdateCallQuality :one
UPDATE calls
SET qual_check_id=$1, qual_check_datetime_at=NOW()
WHERE id_call=$2
RETURNING id_call, qual_check_id, qual_check_datetime_at;
-- name: UpdateCallEng :one
UPDATE calls
SET eng_check_id=$1, eng_check_datetime_at=NOW()
WHERE id_call=$2
RETURNING id_call, eng_check_id, eng_check_datetime_at;
-- name: UpdateCallLog :one
UPDATE calls
SET log_check_id=$1, log_check_datetime_at=NOW()
WHERE id_call=$2
RETURNING id_call, log_check_id, log_check_datetime_at;
-- name: UpdateCallManut :one
UPDATE calls
SET man_check_id=$1, man_check_datetime_at=NOW()
WHERE id_call=$2
RETURNING id_call, man_check_id, man_check_datetime_at;

-- name: CreateUser :one
INSERT INTO users (id_user, name_user, sector, company) VALUES ($1, $2, $3, $4) RETURNING *;
-- name: GetUser :one
SELECT * FROM users WHERE id_user = $1;