package use

import (
	"context"
	"ordora/internal/db"
)

func GetAllCalls(ctx context.Context, company *string) ([]db.Call, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	calls, err := querie.GetAllCalls(ctx, *company)

	if err != nil {
		return nil, err
	}
	conn.Close()

	return calls, err
}
