const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
const admissionRoutes = require('./route/admission.route');
const admissionConfirmationRoutes = require('./route/admissionConfirmation.route')
const dashboardRoutes = require("./route/dashboard.route");
const apiRoutes = require("./route/api.route");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin is not allowed by CORS'));
    },
}));
app.use(express.json());
app.use('/admission', admissionRoutes, admissionConfirmationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", apiRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Admission Management System API');
});

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        const port = process.env.PORT || 3000;
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

startServer();
