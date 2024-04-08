package use

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

// var (
// 	host     = "localhost"
// 	port     = "5432"
// 	user     = "postgres"
// 	password = "postgres"
// 	dbname   = "postgres"
// )

var (
	host     = "dpg-co7cqln79t8c73a3u5lg-a"
	port     = "5432"
	user     = "girvx"
	password = "UZPd4bVvc6TBzA1mduSmyIBVvkc415Sn"
	dbname   = "testsgp"
)

func ConnectDB() (*sql.DB, error) {

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	conn, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		return nil, err
	}

	return conn, err

}
