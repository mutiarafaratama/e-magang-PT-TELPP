package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/telpp/emagang/internal/middleware"
	"github.com/telpp/emagang/internal/models"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Client merepresentasikan satu koneksi WebSocket
type Client struct {
	Hub    *Hub
	Conn   *websocket.Conn
	Send   chan []byte
	UserID uuid.UUID
	Role   models.UserRole
}

// WsMessage adalah format pesan yang dikirim lewat WebSocket
type WsMessage struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

// Hub mengelola semua koneksi aktif
type Hub struct {
	clients    map[uuid.UUID]*Client
	broadcast  chan *WsMessage
	register   chan *Client
	unregister chan *Client
	mu         sync.RWMutex
}

var GlobalHub = NewHub()

func NewHub() *Hub {
	return &Hub{
		clients:    make(map[uuid.UUID]*Client),
		broadcast:  make(chan *WsMessage, 256),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			h.clients[client.UserID] = client
			h.mu.Unlock()
			log.Printf("🔗 WebSocket: user %s terhubung (role: %s)", client.UserID, client.Role)

		case client := <-h.unregister:
			h.mu.Lock()
			if _, ok := h.clients[client.UserID]; ok {
				delete(h.clients, client.UserID)
				close(client.Send)
			}
			h.mu.Unlock()
			log.Printf("🔌 WebSocket: user %s terputus", client.UserID)

		case message := <-h.broadcast:
			data, _ := json.Marshal(message)
			h.mu.RLock()
			for _, client := range h.clients {
				select {
				case client.Send <- data:
				default:
					close(client.Send)
					delete(h.clients, client.UserID)
				}
			}
			h.mu.RUnlock()
		}
	}
}

// SendToUser kirim pesan ke user tertentu
func (h *Hub) SendToUser(userID uuid.UUID, msgType string, payload interface{}) {
	h.mu.RLock()
	client, ok := h.clients[userID]
	h.mu.RUnlock()

	if !ok {
		return
	}

	msg := &WsMessage{Type: msgType, Payload: payload}
	data, err := json.Marshal(msg)
	if err != nil {
		return
	}

	select {
	case client.Send <- data:
	default:
		h.mu.Lock()
		delete(h.clients, userID)
		close(client.Send)
		h.mu.Unlock()
	}
}

// SendToRole kirim pesan ke semua user dengan role tertentu
func (h *Hub) SendToRole(role models.UserRole, msgType string, payload interface{}) {
	msg := &WsMessage{Type: msgType, Payload: payload}
	data, _ := json.Marshal(msg)

	h.mu.RLock()
	defer h.mu.RUnlock()

	for _, client := range h.clients {
		if client.Role == role {
			select {
			case client.Send <- data:
			default:
			}
		}
	}
}

func (c *Client) writePump() {
	defer func() {
		c.Conn.Close()
	}()

	for {
		message, ok := <-c.Send
		if !ok {
			c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
			return
		}
		if err := c.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return
		}
	}
}

func (c *Client) readPump() {
	defer func() {
		c.Hub.unregister <- c
		c.Conn.Close()
	}()

	for {
		_, _, err := c.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("WebSocket error: %v", err)
			}
			break
		}
	}
}

// Handler: endpoint WebSocket
func ServeWS(hub *Hub) gin.HandlerFunc {
	return func(c *gin.Context) {
		conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
		if err != nil {
			log.Printf("WebSocket upgrade error: %v", err)
			return
		}

		userID := middleware.GetUserID(c)
		role := middleware.GetUserRole(c)

		client := &Client{
			Hub:    hub,
			Conn:   conn,
			Send:   make(chan []byte, 256),
			UserID: userID,
			Role:   role,
		}

		hub.register <- client

		go client.writePump()
		go client.readPump()
	}
}
