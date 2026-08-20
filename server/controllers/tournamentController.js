const Tournament = require('../models/Tournament');

const getTournaments = async (req, res, next) => {
  try {
    const tournaments = await Tournament.find().sort({ createdAt: -1 });
    const formatted = tournaments.map(t => {
      const obj = t.toObject();
      obj.id = obj._id;
      return obj;
    });
    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getTournamentById = async (req, res, next) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }
    const obj = tournament.toObject();
    obj.id = obj._id;
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const createTournament = async (req, res, next) => {
  try {
    const tournament = await Tournament.create(req.body);
    const obj = tournament.toObject();
    obj.id = obj._id;
    return res.status(201).json(obj);
  } catch (error) {
    next(error);
  }
};

module.exports = { getTournaments, getTournamentById, createTournament };
