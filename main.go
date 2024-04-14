package main

import (
	"context"
	"encoding/json"
	"fmt"
	"ordora/cmd/websocket_api/use"
	"ordora/internal/db"
	"ordora/public"
	"strconv"

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

type ErrorHand struct {
	Message string
}

type ID struct {
	Id int64 `json:"id"`
}

type Companies struct {
	Company string `json:"company"`
}

type NumberConnections struct {
	*E
	ConnLength string `json:"conn_length"`
}

type GetCallSocketInput struct {
	Call *db.GetCallParams
}

type GetAllCallsSocketInput struct {
	Call *Companies
}

type CreateCallSocketInput struct {
	Call *db.CreateCallParams `json:"call"`
}

type UpdateCallQualityInput struct {
	*E
	Call *db.UpdateCallQualityParams `json:"call"`
}

type UpdateCallManInput struct {
	*E
	Call *db.UpdateCallManutParams `json:"call"`
}

type UpdateCallEngInput struct {
	*E
	Call *db.UpdateCallEngParams `json:"call"`
}

type UpdateCallLogInput struct {
	*E
	Call *db.UpdateCallLogParams `json:"call"`
}

var (
	clients map[*websocket.Conn]Adress = make(map[*websocket.Conn]Adress)
)

var numberConnections int64

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

	numberConnections += 1

	fmt.Println("connections: ", numberConnections)

	ctx := context.Background()

	for {

		_, data, err := client.Read(c.Request().Context())
		var e E
		_ = json.Unmarshal(data, &e)

		fmt.Println(e)

		fmt.Printf("%+v\n", e)
		if err != nil {
			fmt.Println("disconnected")
			delete(clients, client)
			numberConnections -= 1
			var output NumberConnections
			e.Event = "getConnLength"
			output.E = &e
			output.ConnLength = strconv.Itoa(int(numberConnections))
			fmt.Println(output)
			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				a := clients[cli].Company
				if a != "industria" {
					cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
				}
			}
			fmt.Println("connections: ", numberConnections)
			client.CloseNow()
			break
		}

		switch e.Event {

		case string("getConnLength"):
			var output NumberConnections
			output.E = &e
			output.ConnLength = strconv.Itoa(int(numberConnections))

			callJSON, _ := json.MarshalIndent(&output, "", "  ")

			for cli := range clients {
				a := clients[cli].Company
				if a != "industria" {
					cli.Write(c.Request().Context(), websocket.MessageText, []byte(callJSON))
				}
			}

		case string("getCall"):
			var dataToStruct GetCallSocketInput
			err = json.Unmarshal(data, &dataToStruct)

			call, err := use.GetCall(ctx, e.Event, &dataToStruct.Call.IDCall, &dataToStruct.Call.Company)
			if err != nil {
				fmt.Println(err)
			}

			client.Write(c.Request().Context(), websocket.MessageText, []byte(call))

		case string("getAllCalls"):
			var dataToStruct GetAllCallsSocketInput
			err = json.Unmarshal(data, &dataToStruct)

			if err != nil {
				client.Write(c.Request().Context(), websocket.MessageText, []byte("a"))
				fmt.Println(err)
				return err
			}

			calls, err := use.GetAllCalls(ctx, e.Event, &dataToStruct.Call.Company)
			if err != nil {

				fmt.Println(err)
			}

			client.Write(c.Request().Context(), websocket.MessageText, []byte(calls))

		case string("createCall"):

			var dataToStruct CreateCallSocketInput
			err = json.Unmarshal(data, &dataToStruct)
			if err != nil {
				client.Write(c.Request().Context(), websocket.MessageText, []byte(string(`{ "error":  }`)))
				return err
			}
			call, err := use.CreateCall(ctx, e.Event, dataToStruct.Call)
			if err != nil {
				fmt.Println(err)
			}
			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(call))
			}

		case string("updateCallQuality"):

			var dataToStruct UpdateCallQualityInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallQuality(ctx, e.Event, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(call))
			}

		case string("updateCallLog"):

			var dataToStruct UpdateCallLogInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallLog(ctx, e.Event, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(call))
			}

		case string("updateCallEng"):

			var dataToStruct UpdateCallEngInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallEng(ctx, e.Event, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(call))
			}
		case string("updateCallMan"):

			var dataToStruct UpdateCallManInput
			_ = json.Unmarshal(data, &dataToStruct)

			call, err := use.UpdateCallManut(ctx, e.Event, dataToStruct.Call)

			if err != nil {
				fmt.Println(err)
			}

			for cli := range clients {
				cli.Write(c.Request().Context(), websocket.MessageText, []byte(call))
			}

		}
	}
	return err

}

func main() {

	e := echo.New()

	public.RegisterHTML(e)

	e.GET("/ws", handleWS)

	e.Logger.Fatal(e.Start(":3000"))
}
