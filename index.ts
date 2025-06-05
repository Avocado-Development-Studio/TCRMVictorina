import { activateKeepAwakeAsync } from 'expo-keep-awake';

import * as ScreenOrientation from 'expo-screen-orientation';
async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
}
(async() => {
    await changeScreenOrientation();
    await activateKeepAwakeAsync('global')
})()

import 'expo-router/entry';