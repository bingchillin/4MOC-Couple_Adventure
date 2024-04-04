await WA.players.configureTracking();
const players = WA.players.list();
for (const player of players) {
    if (player.tags.includes("admin")) {
        player.sendEvent("my-event", "my payload");
    }
}