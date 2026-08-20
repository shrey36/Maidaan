const Team = require('../models/Team');
const Player = require('../models/Player');

const getMyTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({ captain: req.user._id })
      .populate('captain', '-password')
      .populate('members');

    if (!team) {
      return res.json({ message: 'No team created yet.' });
    }

    const obj = team.toObject();
    obj.id = obj._id;
    if (obj.captain) {
      obj.captain.id = obj.captain._id;
      obj.captain.fullName = obj.captain.name;
    }
    if (obj.members) {
      obj.members = obj.members.map(p => ({
        ...p,
        id: p._id,
        avatarUrl: p.profileImage
      }));
    }

    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const { name, sport, description } = req.body;

    const existingUserTeam = await Team.findOne({ captain: req.user._id });
    if (existingUserTeam) {
      return res.status(400).json({ success: false, message: 'User already manages a team' });
    }

    const existingName = await Team.findOne({ name });
    if (existingName) {
      return res.status(400).json({ success: false, message: 'Team name already exists' });
    }

    const team = await Team.create({
      name,
      sport,
      description: description || '',
      captain: req.user._id,
      maxSquadSize: 11,
      budgetTotal: 10000,
      budgetSpent: 0,
      members: []
    });

    const populated = await Team.findById(team._id).populate('captain', '-password');
    const obj = populated.toObject();
    obj.id = obj._id;
    if (obj.captain) {
      obj.captain.id = obj.captain._id;
      obj.captain.fullName = obj.captain.name;
    }

    return res.status(201).json(obj);
  } catch (error) {
    next(error);
  }
};

const addPlayerToTeam = async (req, res, next) => {
  try {
    const { teamId, playerId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    const player = await Player.findById(playerId);
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }

    if (team.members.includes(playerId)) {
      return res.status(400).json({ success: false, message: 'Player is already in squad' });
    }

    if (team.members.length >= team.maxSquadSize) {
      return res.status(400).json({ success: false, message: 'Squad size limit reached' });
    }

    team.members.push(playerId);
    await team.save();

    const updated = await Team.findById(team._id).populate('captain members');
    const obj = updated.toObject();
    obj.id = obj._id;
    if (obj.members) {
      obj.members = obj.members.map(p => ({ ...p, id: p._id, avatarUrl: p.profileImage }));
    }
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

const removePlayerFromTeam = async (req, res, next) => {
  try {
    const { teamId, playerId } = req.params;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    team.members = team.members.filter(id => id.toString() !== playerId);
    await team.save();

    const updated = await Team.findById(team._id).populate('captain members');
    const obj = updated.toObject();
    obj.id = obj._id;
    if (obj.members) {
      obj.members = obj.members.map(p => ({ ...p, id: p._id, avatarUrl: p.profileImage }));
    }
    return res.json(obj);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTeam,
  createTeam,
  addPlayerToTeam,
  removePlayerFromTeam
};
