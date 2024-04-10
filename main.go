package main

import (
	"context"
	"encoding/json"
	"fmt"
	"ordora/cmd/websocket_api/use"
	"ordora/internal/db"
	"ordora/public"
	"os"

	"nhooyr.io/websocket"

	"github.com/labstack/echo/v4"
	_ "github.com/lib/pq"
)

type Adress struct {
	Machine string
	Company string
}

type E struct {
	Event string `json:"event"`
}

type ID struct {
	Id int64 `json:"id"`
}

type Companies struct {
	Company string `json:"company"`
}

type GetCallSocketInput struct {
	Call *db.GetCallParams
}

type GetAllCallsSocketInput struct {
	Call *Companies
}

type GetCallSocketOutput struct {
	*E
	Call *db.Call `json:"call"`
}

type CreateCallSocketInput struct {
	Call *db.CreateCallParams `json:"call"`
}

type GetAllCallsSocketOutput struct {
	*E
	Call *[]db.Call `json:"call"`
}

type CreateCallOutput struct {
	*E
	*db.Call `json:"call"`
}

type UpdateCallQualityInput struct {
	*E
	Call *db.UpdateCallQualityParams `json:"call"`
}

type UpdateCallQualityOutput struct {
	*E
	Call *db.UpdateCallQualityRow `json:"call"`
}

type UpdateCallManInput struct {
	*E
	Call *db.UpdateCallManutParams `json:"call"`
}

type UpdateCallManOutput struct {
	*E
	Call *db.UpdateCallManutRow `json:"call"`
}

type UpdateCallEngInput struct {
	*E
	Call *db.UpdateCallEngParams `json:"call"`
}

type UpdateCallEngOutput struct {
	*E
	Call *db.UpdateCallEngRow `json:"call"`
}

type UpdateCallLogInput struct {
	*E
	Call *db.UpdateCallLogParams `json:"call"`
}

type UpdateCallLogOutput struct {
	*E
	Call db.UpdateCallLogRow `json:"call"`
}

var (
	clients map[*websocket.Conn]Adress = make(map[*websocket.Conn]Adress)
)

func handleWS(c echo.Context) error {

	client, err := websocket.Accept(c.Response().Writer, c.Request(), &websocket.AcceptOptions{
		InsecureSkipVerify: true,
	})

	if err != nil {
		fmt.Println(err)
		client.CloseNow()
		return err
	}

	clients[client] = Adress{
		Company: c.QueryParams().Get("company"),
		Machine: c.QueryParams().Get("machine"),
	}

	fmt.Println("connections: ", clients)

	ctx := context.Background()

	for {

		_, data, err := client.Read(c.Request().Context())
		if err != nil {
			fmt.Println("disconnected")

			delete(clients, client)
			fmt.Println(clients)
			client.CloseNow()
			break
		}

		var e E
		_ = json.Unmarshal(data, &e)

		fmt.Printf("%+v\n", e)

		switch e.Event {

		case string("getCall"):
			var dataToStruct GetCallSocketInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.GetCall(ctx, &dataToStruct.Call.IDCall, &dataToStruct.Call.Company)
			if err != nil {
				fmt.Println(err)
			}

			var output GetCallSocketOutput

			output.E = &e
			output.Call = call

			callJSON, err := json.MarshalIndent(&output, "", "  ")

			if err != nil {
				fmt.Println(err)
			}

			client.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))

		case string("getAllCalls"):
			var dataToStruct GetAllCallsSocketInput
			_ = json.Unmarshal(data, &dataToStruct)

			calls, err := use.GetAllCalls(ctx, &dataToStruct.Call.Company)
			if err != nil {
				fmt.Println(err)
			}

			var output GetAllCallsSocketOutput

			output.E = &e
			output.Call = &calls

			callsJSON, _ := json.MarshalIndent(&output, "", "  ")

			client.Write(c.Request().Context(), websocket.MessageText, []byte(callsJSON))

		case string("createCall"):

			var dataToStruct CreateCallSocketInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.CreateCall(ctx, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			var output CreateCallOutput

			output.E = &e
			output.Call = call

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
			}

		case string("updateCallQuality"):

			var dataToStruct UpdateCallQualityInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallQuality(ctx, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			var output UpdateCallQualityOutput

			output.E = &e
			output.Call = call

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
			}

		case string("updateCallLog"):

			var dataToStruct UpdateCallLogInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallLog(ctx, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			var output UpdateCallLogOutput

			output.E = &e
			output.Call = *call

			fmt.Println(output.Call == *call)

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
			}

		case string("updateCallEng"):

			var dataToStruct UpdateCallEngInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallEng(ctx, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			var output UpdateCallEngOutput

			output.E = &e
			output.Call = call

			fmt.Println(&output.Call == &call)

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
			}
		case string("updateCallMan"):

			var dataToStruct UpdateCallManInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallManut(ctx, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			var output UpdateCallManOutput

			output.E = &e
			output.Call = call

			fmt.Println(&output.Call == &call)

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
			}

		}

	}
	return err

}

func main() {

	e := echo.New()

	fmt.Println(os.Getenv(`POSTGRES_PORT`))

	public.RegisterHTML(e)

	e.GET("/ws", handleWS)

	e.Logger.Fatal(e.Start(":3000"))
}
