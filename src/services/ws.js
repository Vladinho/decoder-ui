class Ws {
    WS_URL = 'wss://decoderws.onrender.com/ws'
    constructor(roomId, gameId, onMessage, onConnect) {
        if (!Ws._instance) {
            this.roomId = roomId;
            this.gameId = gameId;
            this.onMessage = onMessage;
            this.onConnect = onConnect;
            this._create();
            setInterval(this._webSocketChecker, 3000);
            Ws._instance = this;
        }
        return Ws._instance;
    }

    reload = (roomId, gameId) => {
        this.roomId = roomId;
        this.gameId = gameId;
        this._create();
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
        if ((this.ws?.readyState === 2 || this.ws?.readyState === 3 || !this.ws) && this.onMessage && this.roomId && this.gameId) {
            this.ws = null;
            return this._create();
        }
    }
    _create =  () => {
        if (!this.roomId || !this.gameId) {
            return;
        }
        this._connectToServer().then(async (ws) => {
            this.onConnect();
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