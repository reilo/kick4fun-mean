const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'kick4fun'});
});

const tournaments = require('./controllers/tournaments');
const challenges = require('./controllers/challenges');
const participants = require('./controllers/participants');

router.get('/v1/tournaments', tournaments.list);
router.get('/v1/tournaments/:id', tournaments.listOne);
router.put('/v1//tournaments/:id', tournaments.update);
router.delete('/v1/tournaments/:id', tournaments.delete);

router.get('/v1/tournaments/:id/participants', participants.list);
router.post('/v1/tournaments/:id/participants', participants.add);
router.delete('/v1/tournaments/:id/participants/:name', participants.remove);

router.get('/v1/challenges', tournaments.list);
router.get('/v1/challenges/:id', tournaments.listOne);
router.post('/v1/challenges', challenges.create);
router.get('/v1/challenges/:id/stats', challenges.getStats);

router.put('/v1/challenges/:id/prepare', challenges.prepare);
router.put('/v1/challenges/:id/start', challenges.start);
router.put('/v1/challenges/:id/stop', challenges.stop);
router.put('/v1/challenges/:id/finish', challenges.finish);

router.get('/v1/challenges/:id/matches', challenges.getMatches);
router.post('/v1/challenges/:id/matches', challenges.addMatch);

router.get('/v1/challenges/:id/rounds/:num', challenges.getRound);

router.get('/v1/challenges/:id/participants/:name/stats', challenges.getStatsParticipant);

module.exports = router;
