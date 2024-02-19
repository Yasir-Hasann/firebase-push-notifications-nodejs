# Note: 
- Multicast is used for large set of devices/fcms.
- Maximum devices/fcm tokens array length is 500.
- If there is an invalid fcm token in the list/array, the firebase methods will skip that fcm token and continue to send notification to the other valid fcms/tokens of the list/array.

Reference: https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.messaging

