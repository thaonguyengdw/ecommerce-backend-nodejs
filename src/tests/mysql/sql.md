// CREATE TABLE
CREATE TABLE test_table(
    id INT NOT NULL,
    name varchar(255) DEFAULT NULL,
    age INT DEFAULT NULL,
    address varchar(255) DEFAULT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

// CREATE PROCEDURE

CREATE DEFINE=`thaonguyengdw`@'%' PROCEDURE `insert_data`()
BEGIN
    DECLARE max_id INT DEFAULT 1000000;
    DECLARE i INT DEFAULT 1;
    WHILE i <= max_id DO
    INSERT INTO test_table (id, name, age, adress) VALUES (i, CONCAT('name', i), i%100, CONCAT('address', i));
    SET  i = i + 1;
    END WHILE;
    END
