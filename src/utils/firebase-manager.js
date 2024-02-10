const admin = require('firebase-admin');
const serviceAccount = require('../../service-account');

const connection = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

class FirebaseManager {
    constructor () {
        this.connection = connection;
    }

    async sendNotificationToSingle(params) {
        let { fcm, title, body, data } = params;
        data = data || {};
        try {
            const payload = [
                {
                    token: fcm,
                    notification: {
                        title,
                        body,
                    },
                    data: {
                        type: data.type,
                        data: 'data' in data ? JSON.stringify(data.data) : '',
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
                },
            ]
            const response = await connection.messaging().sendEach(payload);
            console.log('res => ', JSON.stringify(response, null, 4));
        } catch (error) {
            console.log('sendNotificationToSingle_error', error);
        }
    }

    async sendNotificationToMany(params) {
        let { fcms, title, body, data } = params;
        fcms = fcms || ['null'];
        data = data || {};

        try {
            const payload = fcms.map((fcm) => ({
                token: fcm,
                notification: {
                    title,
                    body,
                },
                data: {
                    type: data.type,
                    data: 'data' in data ? JSON.stringify(data.data) : '',
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
            }));
            const response = await connection.messaging().sendEach(payload);
            console.log('res => ', JSON.stringify(response, null, 4));
        } catch (error) {
            console.log('sendNotificationToMany_error', error);
        }
    }

    async sendHTTPv1Notifications(params) {
        let { topicName, fcms, title, body, imageUrl, data } = params;
        fcms = fcms || ['null'];
        data = data || {};
        try {
            const payload = {
                topic: topicName,
                tokens: fcms,
                notification: {
                    title,
                    body,
                },
                data: {
                    type: data.type,
                    data: 'data' in data ? JSON.stringify(data.data) : '',
                },
                android: {
                    notification: {
                        imageUrl: imageUrl
                    },
                    priority: 'high',
                },
                apns: {
                    payload: {
                        aps: {
                            'mutable-content': 1,
                        },
                    },
                    fcm_options: {
                        image: imageUrl
                    },
                },
            };
            const response = await connection.messaging().sendEachForMulticast(payload);
            console.log('res => ', JSON.stringify(response, null, 4));
        } catch (error) {
            console.log('sendNotifications', error);
        }
    }
}

module.exports = FirebaseManager;