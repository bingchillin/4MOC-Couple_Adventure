/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.ui.modal.openModal({
        title: "WorkAdventure website",
        src: 'http://localhost:5173/iframe_tags_form.html',
        allow: "fullscreen",
        allowApi: true,
        position: "center"
    });

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)
    WA.room.area.onEnter('quiz').subscribe(startQuiz)

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
