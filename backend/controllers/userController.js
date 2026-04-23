const User = require('../models/User');

// Add User
exports.addUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Connect two users (bidirectional)
exports.connectUsers = async (req, res) => {
  try {
    const { userId1, userId2 } = req.body;
    if (userId1 === userId2) return res.status(400).json({ error: "Cannot connect a user to themselves" });

    const user1 = await User.findById(userId1);
    const user2 = await User.findById(userId2);

    if (!user1 || !user2) return res.status(404).json({ error: "User not found" });

    if (!user1.connections.includes(userId2)) {
      user1.connections.push(userId2);
      await user1.save();
    }
    if (!user2.connections.includes(userId1)) {
      user2.connections.push(userId1);
      await user2.save();
    }

    res.json({ message: "Users connected successfully", user1, user2 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Network Graph
exports.getNetwork = async (req, res) => {
  try {
    const users = await User.find().populate('connections', 'name');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Find Influencer (User with highest connections)
exports.findInfluencer = async (req, res) => {
  try {
    const influencer = await User.findOne()
      .sort({ connections: -1 }) // This might not work directly on array length in some MongoDB versions
      .exec();
    
    // Better way: aggregations or fetch all and compare
    const users = await User.find();
    let maxConnections = -1;
    let mainInfluencer = null;

    users.forEach(u => {
      if (u.connections.length > maxConnections) {
        maxConnections = u.connections.length;
        mainInfluencer = u;
      }
    });

    res.json({ influencer: mainInfluencer, connectionCount: maxConnections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Shortest Path (BFS)
exports.shortestPath = async (req, res) => {
  try {
    const { startId, endId } = req.params;
    if (startId === endId) return res.json({ path: [startId] });

    const queue = [[startId]];
    const visited = new Set([startId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const node = path[path.length - 1];

      const user = await User.findById(node).populate('connections');
      for (let neighbor of user.connections) {
        const neighborId = neighbor._id.toString();
        if (neighborId === endId) {
          return res.json({ path: [...path, neighborId] });
        }
        if (!visited.has(neighborId)) {
          visited.add(neighborId);
          queue.push([...path, neighborId]);
        }
      }
    }

    res.json({ path: null, message: "No path found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Recommend Friends (Mutual Connections)
exports.recommendFriends = async (req, res) => {
  try {
    const { userId } = req.params;
    const targetUser = await User.findById(userId).populate('connections');
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    const targetConnections = new Set(targetUser.connections.map(c => c._id.toString()));
    const recommendations = {};

    const allUsers = await User.find({ _id: { $ne: userId } }).populate('connections');

    allUsers.forEach(user => {
      const uId = user._id.toString();
      if (targetConnections.has(uId)) return; // Already friends

      let mutualCount = 0;
      user.connections.forEach(conn => {
        if (targetConnections.has(conn._id.toString())) {
          mutualCount++;
        }
      });

      if (mutualCount > 0) {
        recommendations[uId] = {
          name: user.name,
          mutualCount,
          userId: uId
        };
      }
    });

    const sortedRecs = Object.values(recommendations).sort((a, b) => b.mutualCount - a.mutualCount);
    res.json(sortedRecs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Community Detection (Connected Components using BFS)
exports.getCommunities = async (req, res) => {
  try {
    const users = await User.find().populate('connections');
    const visited = new Set();
    const communities = [];

    const userMap = {};
    users.forEach(u => userMap[u._id.toString()] = u);

    for (let user of users) {
      const uId = user._id.toString();
      if (!visited.has(uId)) {
        const component = [];
        const queue = [uId];
        visited.add(uId);

        while (queue.length > 0) {
          const currId = queue.shift();
          const currUser = userMap[currId];
          component.push({ id: currId, name: currUser.name });

          for (let neighbor of currUser.connections) {
            const nId = neighbor._id.toString();
            if (!visited.has(nId)) {
              visited.add(nId);
              queue.push(nId);
            }
          }
        }
        communities.push(component);
      }
    }

    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
