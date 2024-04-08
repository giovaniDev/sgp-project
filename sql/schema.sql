CREATE TABLE calls (
    id_call BIGSERIAL PRIMARY KEY,
    origin INT NOT NULL,
    destination INT NOT NULL,
    part_number VARCHAR(40) NOT NULL,
    operation INT NOT NULL,
    employee_id INT NOT NULL,
    setup BOOLEAN NOT NULL,
    urgent BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMP NOT NULL,
    qual_description VARCHAR(250) NOT NULL,
    qual_check_id INT NOT NULL,
    qual_check_datetime_at TIMESTAMP NOT NULL,
    eng_description VARCHAR(250) NOT NULL,
    eng_check_id INT NOT NULL,
    eng_check_datetime_at TIMESTAMP NOT NULL,
    log_description VARCHAR(250) NOT NULL,
    log_check_id INT NOT NULL,
    log_check_datetime_at TIMESTAMP NOT NULL,
    man_description VARCHAR(250) NOT NULL,
    man_check_id INT NOT NULL,
    man_check_datetime_at TIMESTAMP NOT NULL,
    company VARCHAR(15) NOT NULL
);

CREATE TABLE users (
    id_user INT PRIMARY KEY,
    name_user VARCHAR(250) NOT NULL,
    sector VARCHAR(15) NOT NULL,
    company VARCHAR(15) NOT NULL
);