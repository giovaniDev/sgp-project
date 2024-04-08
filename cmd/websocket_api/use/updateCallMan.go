package use

import (
	"context"
	"ordora/internal/db"
)

func UpdateCallManut(ctx context.Context, input *db.UpdateCallManutParams) (*db.UpdateCallManutRow, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.UpdateCallManut(ctx, *input)
	if err != nil {
		return nil, err
	}
	conn.Close()

	return &call, err
}
