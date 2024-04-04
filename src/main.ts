/// <reference types="@workadventure/iframe-api-typings" />

import { Popup } from "@workadventure/iframe-api-typings";
import { RemotePlayer } from "@workadventure/iframe-api-typings/front/Api/Iframe/Players/RemotePlayer";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;
let scoreTotal = 0;
let HobbiesCommun: string;
let i = 0;
let results: number[]=[];
const Interests = ["Art ", "Cuisine", "Cinema", "Sport", "Culture"]
const questions: { [key: string]: string[] } = {
    Art: [
        "Pablo Picasso était un célèbre artiste espagnol ?",
        "'La Nuit étoilée' est une célèbre peinture de Claude Monet ?",
        "Les pyramides de Gizeh sont considérées comme des chefs-d'œuvre architecturaux de l'Égypte antique?",
        "Le 'Mona Lisa' est une sculpture de Michel-Ange?",
        "Le 'Cri' est une œuvre célèbre du peintre norvégien Edvard Munch ?"
    ],
    Cuisine: [
        "La cuisine italienne est réputée pour ses pâtes et ses pizzas ?",
        "Le riz cantonais est un plat traditionnel français?",
        "Le sushi est originaire du Mexique ?",
        "Le basilic est une épice commune dans la cuisine indienne ?",
        "Le gâteau au fromage est un dessert classique américain ?"
    ],
    Cinema: [
        "'Le Parrain' est un film réalisé par Steven Spielberg?",
        "'Harry Potter et la Chambre des Secrets' est le premier film de la série Harry Potter?",
        "'Jurassic Park' est un film sur des dinosaures créés grâce à des effets spéciaux numériques?",
        "Alfred Hitchcock est célèbre pour ses films d'horreur ?",
        "'Titanic' est un film basé sur une histoire vraie sur le naufrage du paquebot RMS Titanic ?"
    ],
    Sport: [
        "Le football est le sport le plus populaire au monde en termes de nombre de spectateurs et de pratiquants ?",
        "Le Tour de France est une compétition annuelle de course à pied ?",
        "Le basketball a été inventé en France ?",
        "Le tennis se joue avec une balle de golf ?",
        "Le hockey sur glace est un sport d'équipe qui se joue avec un palet et des patins à glace ?"
    ],
    Culture: [
        "Do you like reading books?",
        "Do you prefer novels over essays?",
        "Have you ever joined a book club?",
        "Do you enjoy discussing books with others?"
    ]
};
const responses: { [key: string]: number[] } = {
    Art: [
        1,
        0,
        1,
        0,
        1
    ], 
    Cuisine: [
        1,
        0,
        1,
        0,
        1
    ],
    Cinema: [
        1,
        0,
        1,
        0,
        1
    ],
    Sport: [
        1,
        0,
        1,
        0,
        1
    ],
    Culture: [
        1,
        0,
        1,
        0
    ]
};
    
function getQuestionsOfInterest(interest: string) {
    return questions[interest];

}

function getResponsesOfInterest(interest: string) {
    return responses[interest];

}

function calculeScoreForOneUser(userReponse: number[], interest: string):number {
    let score = 0;
    let reponseExact: number[] = getResponsesOfInterest(interest);
    

    for (let i = 0; i < userReponse.length; i++) {
        if (userReponse[i] == reponseExact[i]) {
            score++;
        }
    }
    
    return score;

}

function Ismatch(hobiesListPlayer1 : string[] , hobiesListPlayer2 : string[]) {
    let score = 0;
    
    for (let i = 0; i < hobiesListPlayer1.length; i++) {
        for (let j = 0; j < hobiesListPlayer2.length; j++) {
            if (hobiesListPlayer1[i] == hobiesListPlayer2[j]) {
                HobbiesCommun = hobiesListPlayer1[i];
                score++;
            }
        }
    }
    return score;
}

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');

    if(WA.player.state.tags === undefined){
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
    let helloWorldPopup: Popup;
    const tags = WA.player.state.tags as string[];
    const score = WA.player.state.Score;
    const hobiesList: string = "Hobby \n" + tags.join("\n");
    console.log('Player owner',WA.player.state.name);
    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer: RemotePlayer) => {
        const remoteTags = remotePlayer.state.tags as string[];
        let r1 = Ismatch(tags, remoteTags as string[]);

        console.log('Player clicked:', remotePlayer.name);
        remotePlayer.addAction('Afficher les hoobies', () => {
            helloWorldPopup = WA.ui.openPopup("clockPopup", "" + hobiesList + "\n", [
                {
                    label: "Match",
                    className: "primary",
                    callback: (popup) => {
                        match();
                        popup.close();

                    }
                },

                {
                    label: "No",
                    className: "success",
                    callback: (popup) => {
                        popup.close();
                    }
                }
            ])
        }),


            remotePlayer.addAction('View interest', () => {
                helloWorldPopup = WA.ui.openPopup("clockPopup", "" + hobiesList + "\n" + "Score : " + score, [
                

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

function match() {
    let questionsSet : string[] = getQuestionsOfInterest(HobbiesCommun);
    
    const cuisine = getQuestionsOfInterest("Cuisine"); 
    if (i < 4) {
        WA.ui.openPopup("clockPopup", `${questionsSet[i]}\n`, [
            {
                label: "yes",
                className: "primary",
                callback: (popup) => {
                    i++; // Incrémente i
                    results.push(1);
                    console.log("yes",results)

                    popup.close();
                    match(); 
                }
            },
            {
                label: "No",
                className: "success",
                callback: (popup) => {
                    i++; 
                    results.push(0);
                    console.log("no",results)

                    popup.close();
                    match();
                }
            }
        ]);
    }
else{

    scoreTotal =  calculeScoreForOneUser(results,"Cuisine");

}
}

export {};
