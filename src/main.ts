/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');

    if(WA.room.mapURL === 'http://localhost:5173/map.tmj' && WA.player.state.tags === undefined){
        WA.ui.modal.openModal({
            title: "WorkAdventure website",
            src: 'http://localhost:5173/iframe_tags_form.html',
            allow: "fullscreen",
            allowApi: true,
            position: "center",
        },
        () => {
            console.log(WA.player.state.tags);
        }
        );
    }

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
        console.log(WA.player.state.tags);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
