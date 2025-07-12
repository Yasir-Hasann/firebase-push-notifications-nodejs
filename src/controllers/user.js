// module imports
const asyncHandler = require('express-async-handler');

// file imports
const UserModel = require('../models/user');
const firebaseManager = require('../utils/firebase-manager');
const ErrorResponse = require('../utils/error-response');

// @desc   Add User
// @route  POST /api/v1/user
// @access Public
exports.addUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create(req.body);
  if (!user) return next(new ErrorResponse('Something went wrong', 500));

  res.status(200).json(user);
});

// @desc   Update User
// @route  PUT /api/v1/user/:id
// @access Public
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
  if (!user) return next(new ErrorResponse('Something went wrong', 500));

  await firebaseManager().sendNotificationToMany({ fcms: user.fcm, title: 'Profile Updated', body: 'Your profile has been updated.', data: { type: 'update', data: { isProfileUpdated: 'yes' } } });

  // if (user && Array.isArray(user.fcm))
  //   for (let fcm of user.fcm) {
  //     await firebaseManager().sendNotificationToSingle({ fcm: fcm.toString(), title: 'Profile Updated', body: 'Your profile has been updated.', data: { type: 'update', data: { isProfileUpdated: 'yes' } } });
  //   }

  // const users = await UserModel.find();
  // if (users.length > 0) {
  //   for (let user of users) {
  //     if (Array.isArray(user.fcm))
  //       for (let fcm of user.fcm) {
  //         await firebaseManager().sendNotificationToSingle({ fcm: fcm.toString(), title: 'Profile Updated', body: 'Your profile has been updated.', data: { type: 'update', data: { isProfileUpdated: 'yes' } } });
  //       }
  //   }
  // }

  res.status(200).json(user);
});

// @desc   Send Notifications
// @route  POST /api/v1/user/notifications
// @access Public
exports.sendNotifications = asyncHandler(async (req, res, next) => {
  const { title, body, imageUrl, targets, isSpecific } = req.body;

  const query = {};
  if (isSpecific) {
    if (targets) query._id = { $in: targets };
    else return next(new ErrorResponse('Please enter users!', 400));
  }

  const users = await UserModel.find(query).select('fcm');
  const fcms = users.map((user) => user.fcm).flat();

  await firebaseManager().sendHTTPv1Notifications({ fcms, title, body, imageUrl, data: { type: 'test-data', data: { isTest: 'yes' } } });
  res.status(200).json({ success: true });
});
