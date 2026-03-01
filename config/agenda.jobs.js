const { Agenda } = require('agenda');
const { MongoBackend } = require('@agendajs/mongo-backend');
require('dotenv').config();

const agenda = new Agenda({
    backend: new MongoBackend({
        address: process.env.DB_URL,
        collection: 'agendaJobs'
    })
});

agenda.on('start', job => console.log(`Job <${job.attrs.name}> starting`));
agenda.on('complete', job => console.log(`Job <${job.attrs.name}> finished`));
agenda.on('fail', (err, job) => console.error(`Job <${job.attrs.name}> failed: ${err.message}`));

module.exports = agenda;