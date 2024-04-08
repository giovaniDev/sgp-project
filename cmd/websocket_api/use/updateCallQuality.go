package use

import (
	"context"
	"ordora/internal/db"
)

func UpdateCallQuality(ctx context.Context, input *db.UpdateCallQualityParams) (*db.UpdateCallQualityRow, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.UpdateCallQuality(ctx, *input)
	if err != nil {
		return nil, err
	}
	conn.Close()

	return &call, err
}
