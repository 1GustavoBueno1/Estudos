const express = require('express');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const { errorHandler } = require('./utils/errors');

const app = express();
app.use(express.json());

app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/appointments', appointmentRoutes);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));
app.use(errorHandler);

module.exports = app;
