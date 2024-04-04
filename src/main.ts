/// <reference types="@workadventure/iframe-api-typings" />

import { Popup } from "@workadventure/iframe-api-typings";
import { RemotePlayer } from "@workadventure/iframe-api-typings/front/Api/Iframe/Players/RemotePlayer";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;
let helloWorldPopup: Popup;
// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
    WA.player.state.hobbies=["Football", "SQL", "JAVA", "Dormir", "Gaming"];

    const hobbies: any =  WA.player.state.hobbies
    const hobbiesList: string = "Hobby \n \n"+ hobbies.join("\n");
    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer: RemotePlayer) => {
        remotePlayer.addAction('Afficher les hobbies', () => {
            helloWorldPopup = WA.ui.openPopup("clockPopup", ""+hobbiesList, [
                {
                    label: "Match",
                    className: "primary",
                    callback: (popup) => {
                        match();
                        popup.close();
                    }
                },
    
                {
                    label: "Close",
                    className: "success",
                    callback: (popup) => {
                        popup.close();
                    }
                }
            ])
        });
    });

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
function match(): void {
   
    console.log("Correspondance");
    WA.player.moveTo(76, 144);

  
}




export {};
