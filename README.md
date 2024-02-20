# How does Firebase messaging work in Node.js?

When you send notifications using Firebase methods in Node.js, you are essentially sending an HTTP POST request to FCM (Firebase Cloud Messaging) servers, which then deliver the notification to the intended app. The complete flow can be outlined as follows:

## 1. Craft Notification Payload:
You create a JSON payload containing the notification message and any accompanying data.

## 2. Send HTTP Request to FCM Servers:
An HTTP POST request is sent to the FCM endpoint (https://fcm.googleapis.com/fcm/send). This request includes:
- An Authorization header with your server key (obtained from the Firebase Console).
- The notification payload in the request body.

## 3. FCM Server Processing:
FCM servers receive the HTTP request and process it. They verify the server key and the payload.

## 4. Determine Target Devices:
FCM servers determine which devices should receive the notification based on the targeting criteria specified in the payload, such as device tokens or topics.

## 5. Deliver Notifications:
FCM servers communicate with platform-specific push notification services (e.g., Firebase Cloud Messaging for Android, APNs for iOS) to deliver the notification to the target devices. FCM acts as a unified messaging platform and handles delivery to multiple platforms, converting the notification payload into the appropriate format required by each platform.

## 6. Client-Side Handling:
The devices receive the notifications and handle them according to platform-specific behavior, such as displaying system notifications or updating the app's UI.

### Note:
- Multicast is used for a large set of devices/FCMs.
- The maximum length of the device/FCM tokens array is 500.
- If there is an invalid FCM token in the list/array, Firebase methods will skip that token and continue to send notifications to other valid tokens.

<p>Both work same</p>

<pre>
<code>
 apns: {
        headers: { 'apns-priority': '10' },
        payload: {
          aps: {
            mutableContent: true,
            contentAvailable: true,
            sound: 'default'
          }
        },
        fcmOptions: { imageUrl: image }
      },
</code>
</pre>  

<pre>
<code>
 apns: {
        headers: { 'apns-priority': '10' },
        payload: {
          aps: {
            'mutable-content': 1,
            'content-available': 1,
            sound: 'default'
          }
        },
        fcm_options: { image }
      },
</code>
</pre>

### References:
- [Firebase Admin SDK - Messaging (Firebase Methods)](https://firebase.google.com/docs/reference/admin/node/firebase-admin.messaging.messaging)
- [Firebase Cloud Messaging HTTP Protocol (Message/Payload)](https://firebase.google.com/docs/cloud-messaging/http-server-ref)
- [FCM REST API Reference (Message/Payload Structure)](https://firebase.google.com/docs/reference/fcm/rest/v1/projects.messages)
