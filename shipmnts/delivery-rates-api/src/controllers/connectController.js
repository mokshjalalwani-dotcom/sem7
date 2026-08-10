const User = require('../models/User');
const Connection = require('../models/Connection');

// Checks if there is already a PENDING or ACCEPTED connection
// between two users, in EITHER direction (a->b or b->a).
async function hasExistingRelationship(userA, userB) {
  const existing = await Connection.findOne({
    status: { $in: ['PENDING', 'ACCEPTED'] },
    $or: [
      { fromUserId: userA, toUserId: userB },
      { fromUserId: userB, toUserId: userA }
    ]
  });
  return !!existing;
}

async function sendConnectionRequest(req, res) {
  try {
    const currentUserId = req.currentUserId;
    const { toUserId } = req.body;

    if (!toUserId) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'toUserId is required' });
    }
    if (toUserId === currentUserId) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'A user cannot connect with themselves' });
    }

    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'USER_NOT_FOUND', message: `No user found with id ${toUserId}` });
    }

    const alreadyRelated = await hasExistingRelationship(currentUserId, toUserId);
    if (alreadyRelated) {
      return res.status(409).json({ error: 'ALREADY_CONNECTED', message: 'These users are already connected' });
    }

    const connection = await Connection.create({
      fromUserId: currentUserId,
      toUserId,
      status: 'PENDING'
    });

    return res.status(201).json({
      id: connection._id,
      fromUserId: connection.fromUserId,
      toUserId: connection.toUserId
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong, please try again' });
  }
}

async function respondToConnection(req, res) {
  try {
    const currentUserId = req.currentUserId;
    const { connectionId, action } = req.body;

    if (!connectionId || !action) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'connectionId and action are required' });
    }
    if (!['ACCEPT', 'REJECT'].includes(action)) {
      return res.status(400).json({ error: 'VALIDATION_ERROR', message: 'action must be either ACCEPT or REJECT' });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ error: 'CONNECTION_NOT_FOUND', message: `No connection request found with id ${connectionId}` });
    }

    // Only the RECEIVER can respond
    if (connection.toUserId.toString() !== currentUserId) {
      return res.status(403).json({ error: 'NOT_AUTHORIZED', message: 'Only the receiver of the connection request can respond to it' });
    }

    if (connection.status !== 'PENDING') {
      return res.status(400).json({ error: 'INVALID_STATUS', message: 'Only pending connection requests can be responded to' });
    }

    if (action === 'ACCEPT') {
      connection.status = 'ACCEPTED';
      connection.acceptedAt = new Date();
    } else {
      connection.status = 'REJECTED';
      connection.rejectedAt = new Date();
    }
    await connection.save();

    return res.status(200).json({
      id: connection._id,
      fromUserId: connection.fromUserId,
      toUserId: connection.toUserId,
      status: connection.status,
      createdAt: connection.createdAt,
      ...(connection.status === 'ACCEPTED' ? { acceptedAt: connection.acceptedAt } : {}),
      ...(connection.status === 'REJECTED' ? { rejectedAt: connection.rejectedAt } : {})
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Something went wrong, please try again' });
  }
}

module.exports = { sendConnectionRequest, respondToConnection, hasExistingRelationship };
