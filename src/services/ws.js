class Ws {
    WS_URL = 'wss://decoder-web-sockets.herokuapp.com/ws'
    constructor(roomId, gameId, onMessage, beforeConnect) {
        if (!Ws._instance) {
            this.roomId = roomId;
            this.gameId = gameId;
            this.onMessage = onMessage;
            this.beforeConnect = beforeConnect;
            this._create();
            setInterval(this._webSocketChecker, 3000);
            Ws._instance = this;
        }
        return Ws._instance;
    }

    updateAll = () => {
        this.updateRoom();
        this.updateGame();
        this.updateAnswers();
    }

    updateRoom = () => this.ws?.send(JSON.stringify({data: 'update room'}));
    updateGame = () => this.ws?.send(JSON.stringify({data: 'update game'}));
    updateAnswers = () => this.ws?.send(JSON.stringify({data: 'update answers'}));
    _connectToServer = async () =>  {
        this.ws = new WebSocket(`${this.WS_URL}?roomId=${this.roomId}&gameId=${this.gameId}`);
        this.ws.onclose = () => {
            this.ws = null;
            setTimeout(this._create, 2000);
        };
        return new Promise((resolve) => {
            const timer = setInterval(() => {
                if(this.ws?.readyState === 1) {
                    clearInterval(timer)
                    resolve(this.ws);
                }
            }, 10);
        });
    }

    _webSocketChecker = () => {
        if ((this.ws?.readyState === 2 || this.ws?.readyState === 3 || !this.ws) && this.onMessage) {
            this.ws = null;
            return this._create();
        }
    }
    _create =  () => {
        this.beforeConnect();
        this._connectToServer().then(async (ws) => {
            ws.onmessage = (webSocketMessage) => {
                if (webSocketMessage && webSocketMessage.data) {
                    this.onMessage(webSocketMessage.data)
                }
            }
            ws.onclose = () => {
                this.ws = null;
                setTimeout(() => this._create(), 2000)
            }
        }).catch(() => {
            this.ws = null;
            setTimeout(() => this._create(), 2000);
        });
    }
}

export default Ws;