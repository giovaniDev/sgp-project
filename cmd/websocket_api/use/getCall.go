package use

import (
	"context"
	"ordora/internal/db"
)

func GetCall(ctx context.Context, id *int64, company *string) (*db.Call, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.GetCall(ctx, db.GetCallParams{IDCall: *id, Company: *company})
	if err != nil {
		return nil, err
	}
	conn.Close()

	return &call, err
}
