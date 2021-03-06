const express = require('express');
const encryptLib = require('../modules/encryption');
const pool = require('../modules/pool.js');
const router = express.Router();
const moment = require('moment');

router.post('/', (request, response) => {
  if (request.isAuthenticated()) {
    const entry = request.body.entry;
    let sqlText = `INSERT INTO coach_bio
      (id, first_name, last_name, email, job_title, personal_interests, coach_phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    pool.query(sqlText, [entry.id, entry.first_name, entry.last_name, entry.email, entry.job_title, entry.personal_interests, entry.coach_phone])
      .then((result) => {
        // console.log('Added entry:', result);
        response.sendStatus(201);
      }).catch((error) => {
        //  console.log('Error posting entry:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end POST

router.get('/viewcoach/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const sqlText = `SELECT * FROM coach_bio WHERE coach_id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end viewCoach GET

router.get('/getspecialties/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const sqlText = `SELECT specialties.specialty_name FROM specialties 
    JOIN coach_specialties ON coach_specialties.specialty_id=specialties.specialty_id
    WHERE coach_specialties.coach_id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end viewCoach GET

router.get('/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const sqlText = `SELECT * FROM coach_bio WHERE id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
});

router.get('/today/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    let date = moment().format('L');
    const sqlText = `SELECT * FROM calendar
    JOIN student_bio ON student_bio.id=calendar.student_id 
    WHERE calendar.coach_id=$1 ORDER BY calendar.property LIMIT 3`;
    pool.query(sqlText, [id])
      .then(function (result) {
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
});

router.put('/profile/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const entry = request.body.entry;
    let queryText = `UPDATE coach_bio 
    SET first_name=$2, last_name=$3, email=$4, job_title=$5, certifications=$6, personal_interests=$7, coach_bio=$8 WHERE coach_id=$1`;
    pool.query(queryText, [id, entry.first_name, entry.last_name, entry.email, entry.job_title, entry.certifications, entry.personal_interests, entry.coach_bio])
      .then((result) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end profile update

router.put('/username/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const entry = request.body.entry;
    let queryText = `UPDATE users 
    SET username=$2 WHERE id=$1`;
    pool.query(queryText, [id, entry.username])
      .then((result) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end username update

router.put('/photo/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const entry = request.body.entry;
    let queryText = `UPDATE coach_bio 
    SET coach_photo=$2 WHERE id=$1`;
    pool.query(queryText, [id, entry.coach_photo])
      .then((result) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end username update


router.get('/everyone/students/:coach', (request, response) => {
  if (request.isAuthenticated()) {
    const coach = request.params.coach;
    const sqlText = `SELECT * FROM student_bio
    JOIN schools ON schools.school_id=student_bio.school_id
    JOIN specialties ON specialties.specialty_id=student_bio.specialty_id
    WHERE student_bio.coach_id=$1`;
    pool.query(sqlText, [coach])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
});

router.get('/onestudent/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const sqlText = `SELECT * FROM student_bio
    JOIN schools ON schools.school_id=student_bio.school_id
    JOIN specialties ON specialties.specialty_id=student_bio.specialty_id
    WHERE student_bio.id=$1`;
    pool.query(sqlText, [id])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
});

router.get('/thisstudent/appts/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const sqlText = `SELECT * FROM calendar
    WHERE student_id=$1 ORDER BY date, property`;
    pool.query(sqlText, [id])
      .then(function (result) {
        //  console.log('Get result:', result);
        response.send(result.rows);
      })
      .catch(function (error) {
        //  console.log('Error on Get:', error);
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
});

router.put('/sessionnotes/:id', (request, response) => {
  if (request.isAuthenticated()) {
    const id = request.params.id;
    const entry = request.body.entry;
    let queryText = `UPDATE calendar 
    SET session_notes=$2, notes_status=$3 WHERE calendar_id=$1`;
    pool.query(queryText, [id, entry.session_notes, entry.notes_status])
      .then((result) => {
        response.sendStatus(200);
      })
      .catch((err) => {
        response.sendStatus(500);
      })
  } else {
      response.sendStatus(403);
  }
}); // end username update

module.exports = router;