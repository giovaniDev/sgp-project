package use

import (
	"context"
	"encoding/json"
	"ordora/internal/db"
)

func UpdateCallQuality(ctx context.Context, event string, input *db.UpdateCallQualityParams) (string, error) {

	conn, err := ConnectDB()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	querie := db.New(conn)
	call, err := querie.UpdateCallQuality(ctx, *input)
	if err != nil {
		return "", err
	}

	callsJSON, _ := json.MarshalIndent(map[string]interface{}{"event": event, "call": &call}, "", "  ")

	return string(callsJSON), err
}
