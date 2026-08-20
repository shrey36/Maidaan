const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Turf = require('../models/Turf');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Booking = require('../models/Booking');

const seedData = async () => {
  try {
    await connectDB();

    // SAFETY: Do not wipe existing production / Atlas data by default.
    // Only clear collections when FORCE_SEED=true is set in the environment.
    if (process.env.FORCE_SEED === 'true') {
      console.log('FORCE_SEED=true – clearing existing database collections...');
      await User.deleteMany();
      await Turf.deleteMany();
      await Player.deleteMany();
      await Team.deleteMany();
      await Tournament.deleteMany();
      await Booking.deleteMany();
    } else {
      console.log('Preserving existing data (set FORCE_SEED=true to wipe and reseed).');
    }

    console.log('Ensuring demo / admin users exist (no duplicates)...');
    let adminUser = await User.findOne({ email: 'admin@maidaan.com' });
    if (!adminUser) {
      adminUser = await User.create({
        name: 'System Admin',
        email: 'admin@maidaan.com',
        phone: '+91 98765 43210',
        password: 'admin1234',
        preferredSport: 'Football',
        location: 'Panjim, Goa',
        role: 'ADMIN'
      });
      console.log('Created admin@maidaan.com');
    } else {
      console.log('Admin user already exists – skipped');
    }

    let normalUser = await User.findOne({ email: 'user@maidaan.com' });
    if (!normalUser) {
      normalUser = await User.create({
        name: 'Shreyas Naik',
        email: 'user@maidaan.com',
        phone: '+91 98221 12345',
        password: 'password123',
        preferredSport: 'Football',
        location: 'Mapusa, Goa',
        role: 'USER'
      });
      console.log('Created user@maidaan.com');
    } else {
      console.log('Demo user already exists – skipped');
    }

    // Seed sample content only when the database has no turfs yet
    const existingTurfCount = await Turf.countDocuments();
    if (existingTurfCount > 0 && process.env.FORCE_SEED !== 'true') {
      console.log(`Turfs already present (${existingTurfCount}). Skipping sample turf/player/team/tournament/booking seed.`);
      console.log('✅ Seed finished (existing data preserved).');
      process.exit(0);
    }

    console.log('Seeding 10 Turfs...');
    const turfs = await Turf.create([
      {
        name: 'Maidaan Arena',
        location: 'Mapusa, Goa',
        address: 'Near Xaviers College Road, Mapusa, Goa',
        sports: ['Football', 'Cricket', 'Futsal'],
        rating: 4.7,
        pricePerHour: 800,
        imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
        description: 'FIFA approved artificial turf with high luminosity LED floodlights and professional dugout.',
        facilities: ['Parking', 'Washroom', 'Changing Room', 'Floodlights', 'Drinking Water'],
        rules: 'Studs required. No Smoking. Arrive 10 mins prior.',
        contactPhone: '+91 98221 00001',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'Starlight Sports Turf',
        location: 'Porvorim, Goa',
        address: 'Opposite Mall De Goa, Porvorim',
        sports: ['Box Cricket', 'Football'],
        rating: 4.8,
        pricePerHour: 700,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        description: 'High-cage boxed turf optimized for 6v6 box cricket and futsal.',
        facilities: ['Parking', 'Washroom', 'Floodlights', 'Refreshment Kiosk'],
        rules: 'No metal cleats permitted.',
        contactPhone: '+91 98221 00002',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'Bayview Sports Hub',
        location: 'Panjim, Goa',
        address: 'Miramar Beach Road, Panjim, Goa',
        sports: ['Badminton', 'Basketball', 'Volleyball'],
        rating: 4.9,
        pricePerHour: 1000,
        imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        description: 'Premium indoor multi-sport arena equipped with wooden flooring.',
        facilities: ['AC Lounge', 'Shower Rooms', 'Parking', 'Pro Shop'],
        rules: 'Non-marking rubber shoes required.',
        contactPhone: '+91 98221 00003',
        availableToday: true,
        turfType: 'Indoor'
      },
      {
        name: 'Sunset Turf Park',
        location: 'Calangute, Goa',
        address: 'Main Beach Highway, Calangute',
        sports: ['Football', 'Futsal'],
        rating: 4.6,
        pricePerHour: 900,
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        description: 'Spacious 7v7 football turf surrounded by coconut palms off the strip.',
        facilities: ['Parking', 'Floodlights', 'Washroom', 'Music System'],
        rules: 'Alcohol strictly prohibited.',
        contactPhone: '+91 98221 00004',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'Coastal Turf & Club',
        location: 'Candolim, Goa',
        address: 'Fort Aguada Road, Candolim',
        sports: ['Football', 'Cricket'],
        rating: 4.9,
        pricePerHour: 1200,
        imageUrl: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
        description: 'Luxury sports resort turf featuring championship green turf layer.',
        facilities: ['VIP Lounge', 'Cafe', 'Valet Parking', 'Changing Room'],
        rules: 'Gentlemanly conduct required.',
        contactPhone: '+91 98221 00005',
        availableToday: true,
        turfType: 'Hybrid'
      },
      {
        name: 'Portside Arena',
        location: 'Vasco, Goa',
        address: 'Airport Road, Vasco da Gama',
        sports: ['Futsal', 'Box Cricket'],
        rating: 4.5,
        pricePerHour: 600,
        imageUrl: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80',
        description: 'Affordable high-octane community turf located near Vasco port.',
        facilities: ['Parking', 'Floodlights', 'Washroom'],
        rules: 'Pay at venue prior to entering turf field.',
        contactPhone: '+91 98221 00006',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'South Goa Sports Complex',
        location: 'Margao, Goa',
        address: 'Fatorda Stadium Annex, Margao',
        sports: ['Football', 'Cricket', 'Badminton'],
        rating: 4.7,
        pricePerHour: 800,
        imageUrl: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800&q=80',
        description: 'Multi-purpose turf complex next to Nehru Stadium Fatorda.',
        facilities: ['Parking', 'Washroom', 'Changing Room', 'Floodlights'],
        rules: 'Standard sports attire compulsory.',
        contactPhone: '+91 98221 00007',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'Palm Grove Turf',
        location: 'Margao, Goa',
        address: 'Borda Ring Road, Margao',
        sports: ['Football', 'Futsal', 'Volleyball'],
        rating: 4.4,
        pricePerHour: 500,
        imageUrl: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80',
        description: 'Budget friendly turf designed for quick neighborhood matches.',
        facilities: ['Parking', 'Washroom', 'Water Station'],
        rules: 'Quiet hours after 11 PM.',
        contactPhone: '+91 98221 00008',
        availableToday: true,
        turfType: 'Outdoor'
      },
      {
        name: 'Panjim Champions Arena',
        location: 'Panjim, Goa',
        address: 'Santa Cruz Highway, Panjim',
        sports: ['Football', 'Cricket'],
        rating: 4.8,
        pricePerHour: 950,
        imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&q=80',
        description: 'High-ceiling covered multi-court facility with scoreboard.',
        facilities: ['Parking', 'Floodlights', 'Referee Support', 'AC Waiting Room'],
        rules: 'Advance slot reservation required.',
        contactPhone: '+91 98221 00009',
        availableToday: true,
        turfType: 'Hybrid'
      },
      {
        name: 'Ocean Breeze Turf',
        location: 'Calangute, Goa',
        address: 'Baga Creek Road, Calangute',
        sports: ['Futsal', 'Volleyball'],
        rating: 4.6,
        pricePerHour: 750,
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        description: 'Breezy night court right next to Baga stream with music speakers.',
        facilities: ['Parking', 'Floodlights', 'Juice Bar'],
        rules: 'Soft ground shoes recommended.',
        contactPhone: '+91 98221 00010',
        availableToday: true,
        turfType: 'Outdoor'
      }
    ]);

    console.log('Seeding Players...');
    const players = await Player.create([
      {
        name: 'Rahul Patil',
        sport: 'Football',
        position: 'Forward',
        location: 'Mapusa, Goa',
        skillLevel: 'Intermediate',
        matchesPlayed: 28,
        goals: 19,
        team: 'Maidaan Warriors',
        bio: 'Pacy winger with clinical finishing inside the box.',
        availability: 'Available Evenings',
        basePrice: 2500,
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'
      },
      {
        name: "Vikram D'Souza",
        sport: 'Football',
        position: 'Midfielder',
        location: 'Panjim, Goa',
        skillLevel: 'Advanced',
        matchesPlayed: 42,
        goals: 12,
        team: 'FC Panjim Strikers',
        bio: 'Playmaker with sharp vision and precision passing skills.',
        availability: 'Available Weekends',
        basePrice: 3200,
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80'
      },
      {
        name: 'Samir Fernandez',
        sport: 'Cricket',
        position: 'All-Rounder',
        location: 'Porvorim, Goa',
        skillLevel: 'Pro',
        matchesPlayed: 65,
        goals: 840,
        team: 'Porvorim Kings',
        bio: 'Hard hitting middle order batsman and deceptive leg spinner.',
        availability: 'Available Nights',
        basePrice: 4000,
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80'
      },
      {
        name: 'Rohan Kamat',
        sport: 'Football',
        position: 'Goalkeeper',
        location: 'Calangute, Goa',
        skillLevel: 'Intermediate',
        matchesPlayed: 31,
        goals: 0,
        team: 'Maidaan Warriors',
        bio: 'Agile shot stopper with quick reflexes and commanding voice.',
        availability: 'Available 6 PM onwards',
        basePrice: 2000,
        profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80'
      }
    ]);

    console.log('Seeding Personal Team...');
    await Team.create({
      name: 'Maidaan Warriors',
      sport: 'Football',
      description: 'Premier amateur football squad playing across North Goa turfs.',
      captain: normalUser._id,
      maxSquadSize: 11,
      budgetTotal: 10000,
      budgetSpent: 4500,
      members: [players[0]._id, players[3]._id]
    });

    console.log('Seeding Tournaments...');
    await Tournament.create([
      {
        name: 'Goa Football Championship 2026',
        sport: 'Football',
        location: 'Maidaan Arena, Mapusa',
        startDate: '2026-09-01',
        endDate: '2026-09-05',
        prizePool: 150000,
        entryFee: 3000,
        maxTeams: 16,
        organizer: 'Maidaan Sports Org',
        status: 'UPCOMING',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        description: 'The biggest 7v7 monsoon football knockout tournament in Goa.'
      },
      {
        name: 'Panjim Box Cricket Masters',
        sport: 'Cricket',
        location: 'Bayview Sports Hub, Panjim',
        startDate: '2026-09-12',
        endDate: '2026-09-14',
        prizePool: 50000,
        entryFee: 1500,
        maxTeams: 12,
        organizer: 'Panjim Sports Club',
        status: 'COMING_SOON',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&q=80',
        description: 'High energy night box cricket series with DJ music.'
      }
    ]);

    console.log('Seeding Initial Booking...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    const dateFormatted = tomorrowStr.replace(/-/g, '');

    await Booking.create({
      user: normalUser._id,
      turf: turfs[0]._id,
      date: tomorrowStr,
      startTime: '07:00 PM',
      endTime: '08:00 PM',
      duration: 1,
      amount: 800,
      status: 'CONFIRMED',
      paymentMethod: 'PAY_AT_VENUE',
      paymentStatus: 'PAY_AT_VENUE',
      bookingId: `MAA-${dateFormatted}-1001`
    });

    console.log('✅ Maidaan MongoDB Seed Data Successfully Created!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error Seeding Data:', error);
    process.exit(1);
  }
};

seedData();
