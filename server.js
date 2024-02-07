const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require("dotenv");
const database = require("./config/database");
const Location = require("./models/Location");
const cors = require('cors');
//const {createLocation} = require('./controllers/Location');

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`App is running at ${PORT}`);
})

const io = socketIO(server);

database.connect();

app.use(express.json());

app.use(
    cors(
        {
          origin: "http://localhost:3000"  
        }
    )
);

const createLocation = async (req, res) => {

    try {
        const {name, latitude, longitude, heading} = req.body;

        const nameExist = await Location.findOne({name: name});
        if(nameExist) {
            nameExist.latitude = latitude;
            nameExist.longitude = longitude;
            nameExist.heading = heading;

            const updatedLocation = await nameExist.save();

            io.emit(nameExist.name, updatedLocation);
            res.status(201).json(
                {
                    success: true,
                    message: "Loaction Updated Successfully",
                    data : updatedLocation
                }
            );
        } else {
            const newLocation = await Location.create({
                name: name,
                latitude: latitude,
                longitude: longitude,
                heading: heading
            });
            io.emit(name, newLocation);

            return res.status(201).json(
                {
                    success: true,
                    message: "Loaction Created Successfully",
                    data : newLocation
                }
            )

        }

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

app.get("/", (req, res) => {
    io.emit('location-from-socket', "sjh");

    return res.json({
        success: true,
        message: "Your Server is up and running...."
    });
});

app.post('/location', createLocation);

module.exports = io;
