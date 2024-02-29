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

    async sendHTTPv1Notifications1(params) {
        let { fcms, title, body, image, data } = params;
        fcms = fcms || ['null'];
        data = data || {};
        try {
            const batchSize = 500;
            const chunks = [];

            for (let i = 0; i < fcms.length; i += batchSize) {
                chunks.push(fcms.slice(i, i + batchSize));
            }

            for (const fcm of chunks) {
                const payload = {
                    tokens: fcm,
                    notification: {
                        title,
                        body,
                    },
                    data: {
                        type: data?.type,
                        data: 'data' in data ? JSON.stringify(data.data) : '',
                    },
                    android: {
                        priority: 'high',
                        notification: {
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
                };
                const res = await admin.messaging().sendEachForMulticast(payload);
                console.log('res => ', JSON.stringify(res, null, 4));
            }
        } catch (error) {
            console.error('sendHTTPv1Notifications', error);
        }
    };
}

module.exports = FirebaseManager;
