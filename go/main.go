// https://go.dev/doc/tutorial/web-service-gin#prerequisites

package main

import (
	"log"
	"net/http"
	"strconv"

	"time"

	"github.com/gin-gonic/gin"
	combinations "github.com/mxschmitt/golang-combinations"
)

type Player struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Range struct {
	Start time.Time `json:"start"`
	End   time.Time `json:"end"`
}

type Availability struct {
	PlayerId int `json:"playerId"`
	Range    Range
}

type AvailabilityData struct {
	PlayerId  int
	StartHour int
	StartMin  int
	EndHour   int
	EndMin    int
}

type AvailabilityResult struct {
	Players []Player
	Range   Range
}

type PlayerData struct {
	Player         Player         `json:"player"`
	Availabilities []Availability `json:"availabilities"`
}

// albums slice to seed record album data.
var players = []Player{
	{ID: 1, Name: "user1"},
	{ID: 2, Name: "user2"},
	{ID: 3, Name: "user3"},
}

var playerMap = makePlayerMap(players)

var availableTimes = []Availability{
	{PlayerId: 1, Range: Range{Start: todayHourMin(12, 0), End: todayHourMin(15, 0)}},
	{PlayerId: 2, Range: Range{Start: todayHourMin(13, 0), End: todayHourMin(17, 0)}},
	{PlayerId: 3, Range: Range{Start: todayHourMin(11, 0), End: todayHourMin(14, 0)}},
}

func makePlayerMap([]Player) map[int]Player {
	playerMap := make(map[int]Player)
	for _, p := range players {
		playerMap[p.ID] = p
	}
	return playerMap
}

func makePlayers(playerIds []int) []Player {
	result := []Player{}
	for _, pId := range playerIds {
		result = append(result, playerMap[pId])
	}
	return result
}

func todayHourMin(hour int, min int) time.Time {
	year, month, day := time.Now().Date()
	return time.Date(year, month, day, hour, min, 0, 0, time.Local)
}

func calculateAvailability(numberOfPlayers int) []AvailabilityResult {
	results := []AvailabilityResult{}
	availableCobinations := combinations.Combinations(availableTimes, numberOfPlayers)

	for _, combi := range availableCobinations {
		currentRange := combi[0].Range
		playerIds := []int{combi[0].PlayerId}

		for i := 1; i < len(combi); i++ {
			a := combi[i]
			playerIds = append(playerIds, a.PlayerId)
			newStart := currentRange.Start
			if currentRange.Start.Before(a.Range.Start) {
				newStart = a.Range.Start
			}
			newEnd := currentRange.End
			if currentRange.End.After(a.Range.End) {
				newEnd = a.Range.End
			}
			if newStart.Before(newEnd) {
				currentRange = Range{Start: newStart, End: newEnd}
			} else {
				break
			}
		}

		playerIds = unique(playerIds)
		if len(playerIds) == numberOfPlayers {
			results = append(results, AvailabilityResult{Players: makePlayers(playerIds), Range: currentRange})
		}
	}

	return results
}

func unique(intSlice []int) []int {
	keys := make(map[int]bool)
	list := []int{}
	for _, entry := range intSlice {
		if _, value := keys[entry]; !value {
			keys[entry] = true
			list = append(list, entry)
		}
	}
	return list
}

func login(c *gin.Context) {
	var player Player
	if err := c.BindJSON(&player); err != nil {
		log.Println("createOrUpdatePlayer err=", err)
		return
	}
	log.Println("login player=", player)
	for _, p := range players {
		if p.Name == player.Name {
			avs := []Availability{}
			for _, avt := range availableTimes {
				if avt.PlayerId == p.ID {
					avs = append(avs, avt)
				}
			}
			c.IndentedJSON(http.StatusOK, &PlayerData{Player: p, Availabilities: avs})
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, "")
}

func getPossibaleAvailabilities(c *gin.Context) {
	numberOfPlayers, _ := strconv.Atoi(c.Query("number"))
	results := calculateAvailability(numberOfPlayers)
	c.IndentedJSON(http.StatusOK, results)
}

// postAlbums adds an album from JSON received in the request body.
func createOrUpdatePlayer(c *gin.Context) {
	var player Player
	if err := c.BindJSON(&player); err != nil {
		log.Println("createOrUpdatePlayer err=", err)
		return
	}
	log.Println("createOrUpdatePlayer player=", player)
	p, conains := playerMap[player.ID]
	if conains {
		p.Name = player.Name
		p.Email = player.Email
	} else {
		players = append(players, player)
		playerMap[player.ID] = player
	}

	c.IndentedJSON(http.StatusCreated, player)
}

func createAvailability(c *gin.Context) {
	var av AvailabilityData
	if err := c.BindJSON(&av); err != nil {
		log.Println("Availability err=", err)
		return
	}
	log.Println("createAvailability availability=", av)

	availability := Availability{PlayerId: av.PlayerId, Range: Range{Start: todayHourMin(av.StartHour, av.StartMin), End: todayHourMin(av.EndHour, av.EndMin)}}
	availableTimes = append(availableTimes, availability)

	c.IndentedJSON(http.StatusCreated, availability)
}

// func getAlbumByID(c *gin.Context) {
// 	id := c.Param("id")

// 	// Loop over the list of albums, looking for
// 	// an album whose ID value matches the parameter.
// 	for _, a := range albums {
// 		if a.ID == id {
// 			c.IndentedJSON(http.StatusOK, a)
// 			return
// 		}
// 	}
// 	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "album not found"})
// }

// // postAlbums adds an album from JSON received in the request body.
// func postAlbums(c *gin.Context) {
// 	var newAlbum album

// 	// Call BindJSON to bind the received JSON to
// 	// newAlbum.
// 	if err := c.BindJSON(&newAlbum); err != nil {
// 		return
// 	}

// 	// Add the new album to the slice.
// 	albums = append(albums, newAlbum)
// 	c.IndentedJSON(http.StatusCreated, newAlbum)
// }

func main() {
	router := gin.Default()
	router.GET("/results", getPossibaleAvailabilities)
	router.POST("/login", login)
	router.POST("/player", createOrUpdatePlayer)
	router.POST("/availability", createAvailability)
	router.Run("localhost:8080")
}
