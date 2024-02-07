const Location = require("../models/Location");
const io = require('../server');


exports.createLocation = async (req, res) => {

    try {
        const {name, latitude, longitude} = req.body;

        const nameExist = await Location.findOne({name: name});
        if(nameExist) {
            nameExist.latitude = latitude;
            nameExist.longitude = longitude;
            const updatedLocation = await nameExist.save();

            io.emit('location-from-socket', updatedLocation);
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
                longitude: longitude
            });

            io.emit('location-from-socket', newLocation);

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