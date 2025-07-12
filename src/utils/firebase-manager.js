// module imports
const admin = require('firebase-admin');

// file imports
const serviceAccount = require('../../service-account');

const connection = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

class FirebaseManager {
  static instance = null;
  constructor() {
    this.connection = connection;
  }

  async sendNotificationToSingle(params) {
    let { fcm, title, body, data = {} } = params;

    try {
      const message = {
        token: fcm,
        notification: {
          title,
          body,
        },
        data: data in data ? JSON.stringify(data.data) : {},
        android: {
          priority: 'high',
          notification: {
            title,
            body,
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
        webpush: {
          notification: {
            title,
            body,
            icon: 'your_website_log_url',
            renotify: true,
            requireInteraction: true,
          },
          fcmOptions: {
            link: 'your_website_url',
          },
        },
      };
      const response = await connection.messaging().send(message);
      console.log('res => ', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('sendNotificationToSingle_error', error);
    }
  }

  async sendNotificationToMany(params) {
    let { fcms = [], title, body, data = {} } = params;
    try {
      const message = {
        tokens: fcms,
        notification: {
          title,
          body,
        },
        data: data in data ? JSON.stringify(data.data) : {},
        android: {
          priority: 'high',
          notification: {
            title,
            body,
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
        webpush: {
          notification: {
            title,
            body,
            icon: 'your_website_logo_url',
            renotify: true,
            requireInteraction: true,
          },
          fcmOptions: {
            link: 'your_website_url',
          },
        },
      };
      const response = await connection.messaging().sendEachForMulticast(message);
      console.log('res => ', JSON.stringify(response, null, 2));
    } catch (error) {
      console.log('sendNotificationToMany_error', error);
    }
  }

  async sendHTTPv1Notifications(params) {
    let { fcms = [], title, body, image, data = {} } = params;
    try {
      const batchSize = 500;
      const chunks = [];

      for (let i = 0; i < fcms.length; i += batchSize) {
        chunks.push(fcms.slice(i, i + batchSize));
      }

      await Promise.all(
        chunks.map(async (fcmBatch) => {
          const message = {
            tokens: fcmBatch,
            notification: {
              title,
              body,
            },
            data: data in data ? JSON.stringify(data.data) : {},
            android: {
              priority: 'high',
              notification: {
                title,
                body,
                imageUrl: image,
              },
            },
            apns: {
              headers: {
                'apns-priority': '10',
              },
              payload: {
                aps: {
                  mutableContent: true,
                  contentAvailable: true,
                  sound: 'default',
                },
              },
              fcmOptions: {
                imageUrl: image,
              },
            },
            webpush: {
              notification: {
                title,
                body,
                icon: 'your_website_logo_url',
                renotify: true,
                requireInteraction: true,
              },
              fcmOptions: {
                link: 'your_website_url',
              },
            },
          };

          const response = await connection.messaging().sendEachForMulticast(message);
          console.log('res => ', JSON.stringify(response, null, 2));
        })
      );
    } catch (error) {
      console.error('sendHTTPv1Notifications', error);
    }
  }

  async sendHTTPv1Notifications1(params) {
    let { fcms = [], title, body, image, data = {} } = params;
    try {
      const message = {
        tokens: fcms,
        notification: {
          title,
          body,
        },
        data: data in data ? JSON.stringify(data.data) : {},
        android: {
          priority: 'high',
          notification: {
            title,
            body,
            imageUrl: image,
          },
        },
        apns: {
          payload: {
            aps: {
              mutableContent: true,
              contentAvailable: true,
              sound: 'default',
            },
          },
          fcmOptions: {
            imageUrl: image,
          },
        },
        webpush: {
          notification: {
            title,
            body,
            icon: 'your_website_logo_url',
            renotify: true,
            requireInteraction: true,
          },
          fcmOptions: {
            link: 'your_website_url',
          },
        },
      };
      const response = await connection.messaging().sendEachForMulticast(message);
      console.log('res => ', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('sendHTTPv1Notifications', error);
    }
  }

  static getInstance() {
    if (!FirebaseManager.instance) {
      FirebaseManager.instance = new FirebaseManager();
    }
    return FirebaseManager.instance;
  }
}

module.exports = FirebaseManager.getInstance();
