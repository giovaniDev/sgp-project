package public

import (
	"embed"

	"github.com/labstack/echo/v4"
)

var (
	//go:embed all:dist
	dist embed.FS

	//go:embed dist/index.html
	indexHtml embed.FS

	distDirFS  = echo.MustSubFS(dist, "dist")
	distHtmlFS = echo.MustSubFS(indexHtml, "dist")
)

func RegisterHTML(e *echo.Echo) {
	e.FileFS("/", "index.html", distHtmlFS)
	e.StaticFS("/", distDirFS)

}
