
const clientID = 'e9a1d274a4f440cfa78ce5fcf63708fc';
//const redirectUri = 'http://localhost:3000/';
const redirectUri = 'http://easy-playlist.surge.sh'; 
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); 
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
        return [];
      }
      return jsonResponse.tracks.items.map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      }));
    });
  },

  async savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) {
      return;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId;
  
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {headers: headers}
      ).then(async (response) => {
        
          if(response.ok) {
            return await response.json();
          }

        }
      ).then(async (jsonResponse) => {
        userId = jsonResponse.id;
        try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({name: name, public: true})
        }).then(async (response) =>  {
        
          if(response.ok) {
            return await response.json();
          }

        }
        ).then(async (jsonResponse) => {
          const playlistId = jsonResponse.id;
          try { 
            const response = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
              headers: headers,
              method: 'POST',
              body: JSON.stringify({uris: trackUris})
            });
            return response;
            
          } catch(error){
            console.log(error.message);
          }        
        });

        return response;

        } catch (error) {
          console.log(error.message);
        }

      }).then(function(response) {console.log(response.status)});

      return response;

    } catch(error) {
      console.log(error.message);
    }
  }
};

export default Spotify;