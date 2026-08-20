const getAuctionState = async (req, res, next) => {
  try {
    return res.json({
      status: 'LIVE',
      currentLot: 'LOT #104',
      player: {
        id: '1',
        name: 'Rahul Patil',
        sport: 'Football',
        position: 'Forward / Winger',
        basePrice: 2000,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
      },
      currentBid: 2500,
      highestBidder: 'Maidaan Warriors',
      teamPurse: 10000,
      spent: 6500,
      remaining: 3500
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAuctionState };
