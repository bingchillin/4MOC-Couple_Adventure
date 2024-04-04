/// <reference types="@workadventure/iframe-api-typings" />

import { Popup } from "@workadventure/iframe-api-typings";
import { RemotePlayer } from "@workadventure/iframe-api-typings/front/Api/Iframe/Players/RemotePlayer";
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { match } from "assert";

console.log('Script started successfully');

let currentPopup: any = undefined;


const Interests = ["Art ", "Cuisine" , "Cinema" , "Sport" , "Culture"]
const questions :{ [key: string]: string[] } = {
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

const responses :{ [key: string]: string[] } = {
    Art: [
        "Yes",
        "No",
        "Yes",
        "No"
    ],
    Cuisine: [
        "Yes",
        "No",
        "Yes",
        "Yes"
    ],
    Cinema: [
        "Yes",
        "No",
        "No",
        "Yes"
    ],
    Sport: [
        "No",
        "No",
        "Yes",
        "Yes"
    ],
    Culture: [
        "Yes",
        "Yes",
        "Yes",
        "No"
    ]
};


function getQuestionsOfInterest(interest: string) {
    return questions[interest]; 

}

function getResponsesOfInterest(interest: string) {
    return responses[interest]; 

}

function calculeScoreForOneUser(userReponse : string[] , interest :string)
{ let score = 0;
    let reponseExact : string[] = getResponsesOfInterest(interest);
    for (let i = 0; i < userReponse.length; i++) {
        if (userReponse[i] === reponseExact[i]) {
            score++;
        }
    }
    return score;

}

function MatchTwoUsers(Score_user1: number, Score_user2: number) {
    if (Score_user1 > 5 && Score_user2 > 5) {
        return "You Match";
    } 
    else {
        return "You have different interests";
    }
}

function SetScore()
{
    return 6
}
 








// Waiting for the API to be ready
WA.onInit().then(() => {
    WA.player.state.prenom=["Football", "SQL", "JAVA", "Dormir", "Gaming"];
    let helloWorldPopup: Popup;
    WA.player.state.Score = SetScore();
    const score  = WA.player.state.Score;
    const hobiesList: string = "Hobby \n"+ Interests.join("\n");
    WA.ui.onRemotePlayerClicked.subscribe((remotePlayer: RemotePlayer) => {
        remotePlayer.addAction('Afficher les hoobies', () => {
            helloWorldPopup = WA.ui.openPopup("clockPopup", ""+hobiesList +"\n" + "Score : "+ score, [
                {
                    label: "Match",
                    className: "primary",
                    callback: (popup) => {
                        
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
            helloWorldPopup = WA.ui.openPopup("clockPopup", ""+hobiesList +"\n" + "Score : "+ score, [
                {
                    label: "Match",
                    className: "primary",
                    callback: (popup) => {
                        
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
        });
    });
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)
    

    
    const test = WA.player.state.Test
    WA.ui.openPopup('popup',"test" +test , [])
    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
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
