//<reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { send } from "process";

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
        if (event.senderId !== undefined) {
            const player = WA.players.get(event.senderId);
            if (player) {
                const playerName = player.name;
                notifyPlayerInteraction(playerName);
            } else {
                console.log("Player not found");
            }
        } else {
            console.log("Event senderId is undefined");
        }
    });
    })

    

    WA.room.area.onLeave('clock').subscribe(closePopup)
    //WA.room.area.onEnter('quiz').subscribe(startQuiz)

    // Disable proximity meeting when entering the 'myZone' layer
    WA.room.onEnterLayer('player').subscribe(() => {
        WA.controls.disablePlayerProximityMeeting();
    });
    
    WA.room.onLeaveLayer('player').subscribe(() => {
        WA.controls.restorePlayerProximityMeeting();
    });


    let helloWorldPopup: any;

    // Open the popup when we enter a given zone
    WA.room.onEnterLayer('Player1').subscribe(() => {
        // helloWorldPopup = WA.ui.openPopup("popupRectangle", 'Hello world!', [{
        //     label: "Close",
        //     className: "primary",
        //     callback: (popup) => {
        //         // Close the popup when the "Close" button is pressed.
        //         popup.close();
        //     }
        // }]);

        WA.ui.openPopup("popupRectangle", 'Veux-tu interagir avec cette personne!', [{
             
                label: "Oui",
                className: "primary",
                callback: (popup: any) => {
                    popup.close();
                    notifyPlayerInteraction("otherPlayerName");
                }
            },
            {
                label: "Non",
                className: "normal",
                callback: (popup: any) => {
                    popup.close();
                    notifyPlayerInteraction("otherPlayerName");
                }
            }
        ]);
    });

    // Close the popup when we leave the zone.
    WA.room.onLeaveLayer("myZone").subscribe(() => {
        helloWorldPopup.close();
    })

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));


}).catch(e => console.error(e));

// function startQuiz() {
//     if (currentPopup !== undefined) {
//         currentPopup.close();
//         currentPopup = undefined;
//     }
//     WA.ui.openPopup("quizPopup", "Quiz", []);
// }

// function closePopup(){
//     if (currentPopup !== undefined) {
//         currentPopup.close();
//         currentPopup = undefined;
//     }
// }


function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}


function notifyPlayerInteraction(otherPlayerName: string) {
    const popupId = 'interactionPopup';
    const popupTitle = `Player Interaction`;
    const popupButtons = [
        {
            label: 'Yes',
            callback: (popup: any) => {
                popup.close();
                // Code to handle when the player wants to interact goes here
                startConversationWith(otherPlayerName);
            },
        },
        {
            label: 'No',
            callback: (popup: any) => {
                popup.close();
                // Code to handle when the player does not want to interact goes here
                ignorePlayer(otherPlayerName);
            }
        }
    ];
    console.log('popupbuttons', popupButtons);

    WA.ui.openPopup(popupId, `${popupTitle}: Do you want to interact with ${otherPlayerName}?`, popupButtons);

    // Notify the player when entering the 'interactionZone'
    WA.room.onEnterLayer('interactionZone').subscribe(() => {
        notifyPlayerInteraction('otherPlayerName');
    }, (error: any) => {
        console.error(error);
    });
}

function startConversationWith(playerName: string) {
    // Code to start a conversation with the other player
    console.log(`Starting conversation with ${playerName}`);
}

function ignorePlayer(playerName: string) {
    // Code to ignore the other player
    console.log(`Ignoring ${playerName}`);
}


export {};
