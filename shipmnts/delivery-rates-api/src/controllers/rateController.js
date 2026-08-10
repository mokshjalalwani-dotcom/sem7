const Rate = require('../models/Rate');
const Connection = require('../models/Connection');

// Checks if two users have an ACCEPTED connection, in either direction.
async function isConnected(userA, userB) {
  const connection = await Connection.findOne({
    status: 'ACCEPTED',
    $or: [
      { fromUserId: userA, toUserId: userB },
      { fromUserId: userB, toUserId: userA }
    ]
  });
  return !!connection;
}

async function createRate(req, res) {
  try {
    const currentUserId = req.currentUserId;
    const { type, fromLocation, toLocation, validFrom, validTo, price, currency, transitDays } = req.body;

    if (!['BUY', 'SELL'].includes(type)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'type must be either BUY or SELL' });
    }
    if (!(price > 0)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'price must be greater than 0' });
    }
    if (!(transitDays > 0)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'transitDays must be greater than 0' });
    }

    await Rate.create({
      userId: currentUserId,
      type, fromLocation, toLocation, validFrom, validTo, price, currency, transitDays
    });

    return res.status(201).json({ success: true, message: 'Rate created successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong, please try again' });
  }
}

// Given ONE rate document, decide: can currentUser "buy" this route through it?
// Returns the rate if visible, or null if it should stay hidden.
async function visibleAsBuyRate(rate, currentUserId, date) {
  const isValidToday = rate.validFrom <= date && date <= rate.validTo;
  if (!isValidToday) return null;

  if (rate.userId.toString() === currentUserId) {
    // it's your own rate — only your own BUY rates are visible to you
    return rate.type === 'BUY' ? rate : null;
  }

  // it's someone else's rate — only visible if it's their SELL and you're connected
  if (rate.type === 'SELL') {
    const connected = await isConnected(currentUserId, rate.userId.toString());
    if (connected) return rate;
  }
  return null;
}

// Finds every visible "buyable" rate for one exact leg (from -> to)
async function findVisibleLegs(currentUserId, from, to, date) {
  const candidates = await Rate.find({ fromLocation: from, toLocation: to });
  const visible = [];
  for (const rate of candidates) {
    const result = await visibleAsBuyRate(rate, currentUserId, date);
    if (result) visible.push(result);
  }
  return visible;
}

async function searchRates(req, res) {
  try {
    const currentUserId = req.currentUserId;
    const { fromLocation, toLocation, date } = req.body;

    if (!fromLocation || !toLocation) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'fromLocation and toLocation are both required' });
    }

    const results = [];

    // ---- Part A: direct routes ----
    const directLegs = await findVisibleLegs(currentUserId, fromLocation, toLocation, date);
    for (const leg of directLegs) {
      results.push({
        fromLocation,
        toLocation,
        via: null,
        price: leg.price,
        currency: leg.currency,
        transitDays: leg.transitDays
      });
    }

    // ---- Part B: one-stop routes (fromLocation -> middleCity -> toLocation) ----
    // Step 1: find every possible middle city by looking at ALL rates
    // that start at fromLocation and don't go straight to toLocation.
    const possibleFirstLegs = await Rate.find({ fromLocation, toLocation: { $ne: toLocation } });
    const middleCities = [...new Set(possibleFirstLegs.map(r => r.toLocation))];

    for (const mid of middleCities) {
      const legsA = await findVisibleLegs(currentUserId, fromLocation, mid, date);
      const legsB = await findVisibleLegs(currentUserId, mid, toLocation, date);

      for (const a of legsA) {
        for (const b of legsB) {
          if (a.currency !== b.currency) continue; // must be the same currency to combine

          // must NOT have a validity gap: their date ranges must overlap
          const noGap = a.validTo >= b.validFrom && b.validTo >= a.validFrom;
          if (!noGap) continue;

          results.push({
            fromLocation,
            toLocation,
            via: mid,
            price: a.price + b.price,
            currency: a.currency,
            transitDays: a.transitDays + b.transitDays
          });
        }
      }
    }

    return res.status(200).json({ results });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong, please try again' });
  }
}

module.exports = { createRate, searchRates };
