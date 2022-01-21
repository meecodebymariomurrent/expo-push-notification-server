# Expo example snippet for registering a subscriber

````javascript
import * as Notifications from 'expo-notifications';
import { deviceLog } from '@utils/logger';
import * as Device from 'expo-device';
import axios, { AxiosResponse } from 'axios';
import { Notification, NotificationResponse } from 'expo-notifications';

const notificationBackendServer = 'expo-push-notification-server';
const experienceId = 'custom-experience-id';
let token: string | null = null;

const registerForPushNotificationsAsync = async (): Promise<void> => {
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            deviceLog.error('Failed to get push token for push notification!');
            return;
        }
    } else {
        deviceLog.error('Must use physical device for Push Notifications');
    }

    try {
        token = (await Notifications.getExpoPushTokenAsync({ experienceId: experienceId })).data;
        if (token) {
            await registerSubscriber(token);
        }
    } catch (error) {
        deviceLog.error('Error while registering subscriber', error);
    }

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true
        })
    });

    Notifications.addNotificationReceivedListener((notification: Notification) => {
        deviceLog.info(notification);
    });

    Notifications.addNotificationResponseReceivedListener((response: NotificationResponse) => {
        deviceLog.info(response);
    });
};

const registerSubscriber = async (token: string): Promise<void> => {
    try {
        const isRegistered = await isSubscriberRegistered(token);
        if (!isRegistered) {
            return new Promise((resolve, reject) => {
                axios
                    .post(`${notificationBackendServer}/subscriber/create`, {
                        token,
                        appIdentifierId: 'app-identifier'
                    })
                    .then(() => {
                        deviceLog.info('Subscribing to notification successful');
                        resolve();
                    })
                    .catch((error) => {
                        deviceLog.error('Error while subscribing to notifications', error);
                        reject(error);
                    });
            });
        }
    } catch (error) {
        deviceLog.error('Error while handling subscriber', error);
        return Promise.reject();
    }
};

const isSubscriberRegistered = (token: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        axios
            .post(`${notificationBackendServer}/subscriber/exists`, {
                token,
                appIdentifierId: 'app-identifier'
            })
            .then((response: AxiosResponse<any>) => {
                deviceLog.info('Subscribing to notification successful');
                resolve(response.data.exists);
            })
            .catch((error) => {
                deviceLog.error('Error while subscribing to notifications', error);
                reject(error);
            });
    });
};

````
