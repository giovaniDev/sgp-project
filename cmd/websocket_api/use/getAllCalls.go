package use

import (
	"context"
	"encoding/json"
	"ordora/internal/db"
)

func GetAllCalls(ctx context.Context, event string, company *string) (string, error) {

	conn, err := ConnectDB()
	if err != nil {
		return "", err
	}
	querie := db.New(conn)
	calls, err := querie.GetAllCalls(ctx, *company)

	if err != nil {
		return "", err
	}

	callsJSON, _ := json.MarshalIndent(map[string]interface{}{"event": event, "call": &calls}, "", "  ")
	conn.Close()

	return string(callsJSON), err
}
