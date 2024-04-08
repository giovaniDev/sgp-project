package use

import (
	"context"
	"fmt"
	"ordora/internal/db"
)

func CreateCall(ctx context.Context, arg *db.CreateCallParams) (*db.Call, error) {

	conn, err := ConnectDB()
	if err != nil {
		return nil, err
	}
	querie := db.New(conn)
	call, err := querie.CreateCall(ctx, *arg)

	fmt.Print(&call)

	if err != nil {
		return nil, err
	}

	conn.Close()

	return &call, err
}
