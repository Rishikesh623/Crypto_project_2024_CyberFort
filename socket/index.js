const { Server } = require("socket.io");

const io = new Server({
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

//track users in each quiz room
const quizParticipants = {};
const quizCreators = {};

io.on("connection", (socket) => {
    console.log("New socket connection:", socket.id);

    //participant joins a specific quiz room - for giving quiz
    socket.on("joinQuizAsParticipant", ({ pid, pName, pEmail, quizId }) => {
        socket.join(quizId); // Join the quiz room

        // Initialize participants list if it doesn't exist for this quiz
        if (!quizParticipants[quizId]) {
            quizParticipants[quizId] = [];
        }

        // Check if the participant already exists
        const existingParticipantIndex = quizParticipants[quizId].findIndex(
            (participant) => participant.pEmail === pEmail
        );

        if (existingParticipantIndex !== -1) {
            // If participant exists, update their socket ID
            quizParticipants[quizId][existingParticipantIndex].socketId = socket.id;
        } else {
            // If not, add the new participant to the quizParticipants array
            quizParticipants[quizId].push({ pid, pName, pEmail, socketId: socket.id, blocked: false, submitted: false });
        }

        console.log(`User ${pName} joined quiz ${quizId}`);
        // console.log("Online users in quiz:", quizParticipants[quizId]);

        // Send updated participant list to the quiz creator
        const creatorSocketId = quizCreators[quizId];
        if (creatorSocketId) {
            io.to(creatorSocketId).emit("participantJoined", quizParticipants[quizId]);
        }
    });


    //creator joins the quiz room - for monitoring 
    socket.on("joinQuizAsCreator", (quizId) => {
        socket.join(quizId); //join the room

        quizCreators[quizId] = socket.id; //map the creator to the quiz room

        console.log(`Creator joined monitor for quiz ${quizId}`);

        io.to(socket.id).emit("participantJoined", quizParticipants[quizId]);

    });

    socket.on("blockParticipant", ({ quizId, pid }) => {

        const existingParticipantIndex = quizParticipants[quizId].findIndex(
            (participant) => participant.pid === pid
        );

        quizParticipants[quizId][existingParticipantIndex].blocked = true;

        const creatorSocketId = quizCreators[quizId];
        const updatedParticipantsList = quizParticipants[quizId];

        if (creatorSocketId) {
            io.to(creatorSocketId).emit("blockParticipant", { pid, updatedParticipantsList });
        }

    });

    socket.on("unBlockParticipant", ({ quizId, pid }) => {

        const existingParticipantIndex = quizParticipants[quizId].findIndex(
            (participant) => participant.pid === pid
        );

        quizParticipants[quizId][existingParticipantIndex].blocked = false;

    });

    socket.on("submitQuiz", ({ quizId, pid }) => {

        const existingParticipantIndex = quizParticipants[quizId].findIndex(
            (participant) => participant.pid === pid
        );

        quizParticipants[quizId][existingParticipantIndex].submitted = true;

        const creatorSocketId = quizCreators[quizId];
        const updatedParticipantsList = quizParticipants[quizId];

        if (creatorSocketId) {
            io.to(creatorSocketId).emit("quizSubmitUpdate", { updatedParticipantsList });
        }
    });

    // Receive offer from participant and send it to the quiz creator
    socket.on('offer', (data) => {
        const quizId = data.quizId;
        const creatorSocketId = quizCreators[quizId];

        if (creatorSocketId) {
            io.to(creatorSocketId).emit('receive-offer', { offer: data.offer, pid: data.pid });
        }

    });

    // Receive answer from quiz creator and send it to the specific participant
    socket.on('answer', (data) => {
        let targetSocketId;
        const pid = data.pid;
        const existingParticipantIndex = quizParticipants[data.quizId].findIndex(
            (participant) => participant.pid === pid
        );

        if (existingParticipantIndex !== -1) {
            targetSocketId = quizParticipants[data.quizId][existingParticipantIndex].socketId
        }

        io.to(targetSocketId).emit('receive-answer', { answer: data.answer });
    });

    // Receive ICE candidates and forward them
    socket.on('ice-candidate', (data) => {
        let targetSocketId;
        if (data.target === 'quiz-creator') {
            const quizId = data.quizId;
            targetSocketId = quizCreators[quizId];
        } else {
            const pid = data.pid;
            const existingParticipantIndex = quizParticipants[data.quizId].findIndex(
                (participant) => participant.pid === pid
            );

            if (existingParticipantIndex !== -1) {
                targetSocketId = quizParticipants[data.quizId][existingParticipantIndex].socketId
            }
        }
        
        if (targetSocketId) {
            io.to(targetSocketId).emit('receive-ice-candidate', { pid:data.pid, candidate: data.candidate });
        }
    });

    /*
    //send logs to the corresponding quiz creator
    socket.on("sendLog", (data) => {
        const creator = quizCreators.find(user => user.quizId === data.quizId);
        if (creator) {
            // Emit log data to the specific quiz creator
            io.to(creator.socketId).emit("getLogs", data.userId);
        } else {
            console.log("No creator found for quizId:", data.quizId);
        }
    });
    */

    // Handle disconnection
    socket.on("disconnect", () => {

        // Remove user from quizParticipants
        // for (const quizId in quizParticipants) {
        //     const remainingUsers = quizParticipants[quizId].filter(
        //         (user) => user.socketId !== socket.id
        //     );

        //     // Update the room list only if there was a change
        //     if (remainingUsers.length !== quizParticipants[quizId].length) {
        //         quizParticipants[quizId] = remainingUsers;
        //         io.to(quizId).emit("updateParticipants", quizParticipants[quizId]);
        //     }
        // }

        // Remove creator if they disconnect
        for (const quizId in quizCreators) {
            if (quizCreators[quizId] === socket.id) {
                delete quizCreators[quizId];
                console.log(`Creator disconnected from quiz ${quizId}`);
            }
        }
    });
});

io.listen(4000);
