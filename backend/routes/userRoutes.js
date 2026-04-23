const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add User
router.post('/add', userController.addUser);

// Connect Users
router.post('/connect', userController.connectUsers);

// Get Full Network
router.get('/network', userController.getNetwork);

// Find Influencer
router.get('/influencer', userController.findInfluencer);

// Shortest Path
router.get('/shortest-path/:startId/:endId', userController.shortestPath);

// Recommend Friends
router.get('/recommend/:userId', userController.recommendFriends);

// Detect Communities
router.get('/communities', userController.getCommunities);

module.exports = router;
