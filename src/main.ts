//<reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
 WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.ui.modal.openModal({
        title: "WorkAdventure website",
        src: 'http://localhost:5173/iframe_tags_form.html',
        allow: "fullscreen",
        allowApi: true,
        position: "center"
    });

    WA.room.area.onEnter('clock').subscribe(async () => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);

    WA.event.broadcast("my-event", "my payload");
    
    // Send events
    await WA.players.configureTracking();
    const players = WA.players.list();
    for (const player of players) {
        player.sendEvent("my-event", "my payload");
    }

    // Subscribe to events
    WA.event.on("my-event").subscribe((event) => {
        console.log("Event received", event.data);
    });
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)
    WA.room.area.onEnter('quiz').subscribe(startQuiz)

    // Disable proximity meeting when entering the 'myZone' layer
    WA.room.onEnterLayer('player').subscribe(() => {
        WA.controls.disablePlayerProximityMeeting();
    });
    
    WA.room.onLeaveLayer('player').subscribe(() => {
        WA.controls.restorePlayerProximityMeeting();
    });


    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function startQuiz() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
    WA.ui.openPopup("quizPopup", "Quiz", []);
}

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
