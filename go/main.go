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
	ID       int   `json:"id"`
	PlayerId int   `json:"playerId"`
	Range    Range `json:"range"`
}

type AvailabilityData struct {
	PlayerId  int
	StartHour int
	StartMin  int
	EndHour   int
	EndMin    int
}

type AvailabilityResult struct {
	Players []Player `json:"players"`
	Range   Range    `json:"range"`
}

type PlayerData struct {
	Player         Player         `json:"player"`
	Availabilities []Availability `json:"availabilities"`
}

// albums slice to seed record album data.
var players = []Player{
	{ID: 1, Name: "user1", Email: "email1"},
	{ID: 2, Name: "user2", Email: "email2"},
	{ID: 3, Name: "user3", Email: ""},
}

var playerMap = makePlayerMap(players)

var availableTimes = []Availability{
	{ID: 11, PlayerId: 1, Range: Range{Start: todayHourMin(12, 30), End: todayHourMin(15, 30)}},
	{ID: 12, PlayerId: 1, Range: Range{Start: todayHourMin(10, 00), End: todayHourMin(11, 00)}},
	{ID: 13, PlayerId: 1, Range: Range{Start: todayHourMin(16, 15), End: todayHourMin(16, 45)}},
	{ID: 2, PlayerId: 2, Range: Range{Start: todayHourMin(13, 0), End: todayHourMin(17, 0)}},
	{ID: 3, PlayerId: 3, Range: Range{Start: todayHourMin(11, 0), End: todayHourMin(14, 0)}},
}

func makePlayerMap([]Player) map[int]Player {
	playerMap := make(map[int]Player)
	for _, p := range players {
		playerMap[p.ID] = p
	}
	log.Println("makePlayerMap -->", playerMap)
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
			p = playerMap[p.ID]
			c.IndentedJSON(http.StatusOK, &PlayerData{Player: p, Availabilities: getPalyerAvailabilities(p.ID)})
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, "")
}

func getPlayer(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	for _, p := range players {
		if p.ID == id {
			p = playerMap[p.ID]
			c.IndentedJSON(http.StatusOK, &PlayerData{Player: p, Availabilities: getPalyerAvailabilities(p.ID)})
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, "")
}

func getPalyerAvailabilities(playerId int) []Availability {
	avs := []Availability{}
	for _, avt := range availableTimes {
		if avt.PlayerId == playerId {
			avs = append(avs, avt)
		}
	}
	return avs
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
		playerMap[player.ID] = player
		log.Println("createOrUpdatePlayer playerMap[player.ID]=", playerMap[player.ID])
	} else {
		players = append(players, player)
		playerMap[player.ID] = player
		log.Println("createOrUpdatePlayer playerMap[player.ID]=", playerMap[player.ID])
	}

	c.IndentedJSON(http.StatusCreated, &PlayerData{Player: player, Availabilities: getPalyerAvailabilities(player.ID)})
}

func createOrUpdateAvailability(c *gin.Context) {
	var av Availability
	if err := c.BindJSON(&av); err != nil {
		log.Println("createOrUpdateAvailability err=", err)
		return
	}
	log.Println("createOrUpdateAvailability av=", av)
	_, conains := playerMap[av.PlayerId]
	if conains {
		if av.ID > 0 {
			for idx, avt := range availableTimes {
				if avt.ID == av.ID {
					availableTimes[idx] = av
					log.Println("createOrUpdateAvailability update=", availableTimes[idx])
				}
			}
		} else {
			availableTimes = append(availableTimes, av)
			log.Println("createOrUpdateAvailability create=", av)
		}
		c.IndentedJSON(http.StatusOK, getPalyerAvailabilities(av.PlayerId))
	} else {
		c.IndentedJSON(http.StatusNotFound, "")
	}
}
func deleteAvailability(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	for idx, av := range availableTimes {
		if av.ID == id {
			availableTimes = append(availableTimes[:idx], availableTimes[idx+1:]...)
			c.IndentedJSON(http.StatusOK, getPalyerAvailabilities(av.PlayerId))
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, "")
}

func main() {
	router := gin.Default()
	router.GET("/results", getPossibaleAvailabilities)
	router.POST("/login", login)
	router.GET("/player/:id", getPlayer)
	router.POST("/player", createOrUpdatePlayer)
	router.POST("/availability", createOrUpdateAvailability)
	router.DELETE("/availability/:id", deleteAvailability)
	router.Run("localhost:8080")
}
