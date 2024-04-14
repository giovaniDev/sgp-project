package use

import (
	"context"
	"encoding/json"
	"fmt"
	"ordora/internal/db"
)

func CreateCall(ctx context.Context, event string, arg *db.CreateCallParams) (string, error) {

	conn, err := ConnectDB()
	if err != nil {
		return "error", err
	}
	defer conn.Close()
	querie := db.New(conn)
	call, err := querie.CreateCall(ctx, *arg)

	if err != nil {
		return "", err
	}
	callJSON, err := json.MarshalIndent(map[string]interface{}{"event": &event, "call": &call}, "", "  ")

	fmt.Print(string(callJSON))

	if err != nil {
		return "", err
	}

	return string(callJSON), err
}
