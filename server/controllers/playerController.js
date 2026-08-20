const Player = require('../models/Player');

const getPlayers = async (req, res, next) => {
  try {
    const { query, sport, skillLevel } = req.query;
    let filter = {};

    if (query) {
      const regex = new RegExp(query, 'i');
      filter.$or = [
        { name: regex },
        { position: regex },
        { location: regex }
      ];
    }

    if (sport) {
      filter.sport = new RegExp(sport, 'i');
    }

    if (skillLevel) {
      filter.skillLevel = new RegExp(skillLevel, 'i');
    }

    const players = await Player.find(filter).sort({ matchesPlayed: -1 });

    const formatted = players.map(p => {
      const obj = p.toObject();
      obj.id = obj._id;
      obj.avatarUrl = obj.profileImage;
      obj.goalsPoints = obj.goals;
      obj.teamName = obj.team;
      return obj;
    });

    return res.json(formatted);
  } catch (error) {
    next(error);
  }
};

const getPlayerById = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    const obj = player.toObject();
    obj.id = obj._id;
    obj.avatarUrl = obj.profileImage;
    obj.goalsPoints = obj.goals;
    obj.teamName = obj.team;
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const createPlayer = async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    const obj = player.toObject();
    obj.id = obj._id;
    return res.status(201).json(obj);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPlayers, getPlayerById, createPlayer };
