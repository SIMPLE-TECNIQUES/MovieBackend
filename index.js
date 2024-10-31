
const express = require("express");
const env = require("dotenv");
const cors = require("cors");
const connectDB = require("./Database/Db");
const Routes = require("./Routes/Routes");
const upload = require("./middleware/upload"); 
const http = require("http");
const { Server } = require("socket.io");

env.config();

const app = express();
const server = http.createServer(app);

connectDB();
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5174',"https://criticsmohanadmin.netlify.app","https://criticsmohanmoviwreview.netlify.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174',"https://criticsmohanadmin.netlify.app","https://criticsmohanmoviwreview.netlify.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    credentials: true, 
};


app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is Running");
});


app.use("/api", Routes(upload));

io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("newComment", (comment) => {

        io.emit("newComment", comment);
    });

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 8000;


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true); 
    next();
  });


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
