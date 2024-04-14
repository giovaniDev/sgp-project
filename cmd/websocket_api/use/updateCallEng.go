package use

import (
	"context"
	"encoding/json"
	"ordora/internal/db"
)

func UpdateCallEng(ctx context.Context, event string, input *db.UpdateCallEngParams) (string, error) {

	conn, err := ConnectDB()
	if err != nil {
		return "", err
	}
	defer conn.Close()
	querie := db.New(conn)
	call, err := querie.UpdateCallEng(ctx, *input)
	if err != nil {
		return "", err
	}

	callsJSON, _ := json.MarshalIndent(map[string]interface{}{"event": event, "call": &call}, "", "  ")

	return string(callsJSON), err
}
