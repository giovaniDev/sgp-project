package use

import (
	"context"
	"ordora/internal/db"
)

func UpdateCallLog(ctx context.Context, input *db.UpdateCallLogParams) (*db.UpdateCallLogRow, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.UpdateCallLog(ctx, *input)
	if err != nil {
		return nil, err
	}
	conn.Close()

	return &call, err
}
