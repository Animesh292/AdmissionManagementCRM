const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const admissionRoutes = require('./route/admission.route');
const admissionConfirmationRoutes = require('./route/admissionConfirmation.route')
const dashboardRoutes = require("./route/dashboard.route");
const apiRoutes = require("./route/api.route");

const app = express();

app.use(cors());
app.use(express.json());
app.use('/admission', admissionRoutes, admissionConfirmationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", apiRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Admission Management System API');
});

sequelize.authenticate()
    .then(() => {
        console.log('DB Connected');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});