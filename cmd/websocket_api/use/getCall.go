package use

import (
	"context"
	"encoding/json"
	"ordora/internal/db"
)

func GetCall(ctx context.Context, event string, id *int64, company *string) (string, error) {

	conn, err := ConnectDB()
	if err != nil {
		return "", err
	}
	defer conn.Close()

	querie := db.New(conn)
	call, err := querie.GetCall(ctx, db.GetCallParams{IDCall: *id, Company: *company})
	if err != nil {
		return "", err
	}

	callsJSON, _ := json.MarshalIndent(map[string]interface{}{"event": event, "call": &call}, "", "  ")

	return string(callsJSON), err
}
