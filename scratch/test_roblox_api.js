const fetch = require('node-fetch');

async function testRoblox() {
  const placeId = '14875626099';
  
  // Method 1: universe search
  const universeUrl = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
  const proxyUniverse = `https://api.allorigins.win/raw?url=${encodeURIComponent(universeUrl)}`;
  
  try {
    console.log("Fetching universe ID via allorigins...");
    const res = await fetch(proxyUniverse);
    const data = await res.json();
    console.log("Universe data:", data);
    
    if (data.universeId) {
      const gamesUrl = `https://games.roblox.com/v1/games?universeIds=${data.universeId}`;
      const proxyGames = `https://api.allorigins.win/raw?url=${encodeURIComponent(gamesUrl)}`;
      console.log("Fetching games data via allorigins...");
      const res2 = await fetch(proxyGames);
      const data2 = await res2.json();
      console.log("Games data:", data2);
    }
  } catch (err) {
    console.error("Method 1 Error:", err);
  }

  // Method 2: multiget-place-details
  const detailsUrl = `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`;
  const proxyDetails = `https://api.allorigins.win/raw?url=${encodeURIComponent(detailsUrl)}`;
  try {
    console.log("Fetching multiget-place-details via allorigins...");
    const res = await fetch(proxyDetails);
    const data = await res.json();
    console.log("Details data:", data);
  } catch (err) {
    console.error("Method 2 Error:", err);
  }
}

testRoblox();
