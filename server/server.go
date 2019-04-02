package main

import "github.com/gin-gonic/gin"
import (
	"github.com/gin-contrib/static"
	"net/http"
)

func main() {
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile("../client/cube", false)))
	router.LoadHTMLGlob("../client/cube/*.html")

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	router.Run() // listen and serve on 0.0.0.0:8080
}
