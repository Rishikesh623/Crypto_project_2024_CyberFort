const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST"],
    },
});

// Store online users and quiz creators
let onlineParticipants = [];
let quizCreators = [];

io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    // Add participant to the onlineParticipants list
    socket.on("addParticipant", (userId) => {
        // Check if the user is already online
        if (!onlineParticipants.some(user => user.userId === userId)) {
            onlineParticipants.push({
                userId,
                socketId: socket.id // Associate userId with socketId
            });

            console.log("Online Participants:", onlineParticipants);

            // Emit the updated list of participants to all clients
            io.emit("getParticipants", onlineParticipants);
        }
    });

    // Add quiz creator to the quizCreators list
    socket.on("addCreator", (quizId) => {
        // Check if the quiz creator is already added
        if (!quizCreators.some(creator => creator.quizId === quizId)) {
            quizCreators.push({
                quizId,
                socketId: socket.id // Associate quizId with socketId
            });

            console.log("Quiz Creators:", quizCreators);
        }
    });

    // Send logs to the corresponding quiz creator
    socket.on("sendLog", (data) => {
        const creator = quizCreators.find(user => user.quizId === data.quizId);
        if (creator) {
            // Emit log data to the specific quiz creator
            io.to(creator.socketId).emit("getLogs", data.userId);
        } else {
            console.log("No creator found for quizId:", data.quizId);
        }
    });

    // Remove user from onlineParticipants on disconnect
    socket.on("disconnect", () => {
        console.log("Socket disconnected:", socket.id);
        onlineParticipants = onlineParticipants.filter(user => user.socketId !== socket.id);
        quizCreators = quizCreators.filter(creator => creator.socketId !== socket.id);
        
        // Optionally, you can emit the updated list of participants
        io.emit("getParticipants", onlineParticipants);
    });
});

// Start the socket server on port 4000
io.listen(4000);
