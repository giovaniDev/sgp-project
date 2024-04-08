package use

import (
	"context"
	"ordora/internal/db"
)

func UpdateCallEng(ctx context.Context, input *db.UpdateCallEngParams) (*db.UpdateCallEngRow, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.UpdateCallEng(ctx, *input)
	if err != nil {
		return nil, err
	}
	conn.Close()

	return &call, err
}
