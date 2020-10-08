const clientID = process.env.REACT_APP_client_ID;
const redirectUri = 'http://localhost:3000/'; 
let accessToken;
let userId;



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

  getCurentUserId() {
    
    if(userId) {
      return userId;
    }

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
      return fetch('https://api.spotify.com/v1/me', {headers: headers}
      ).then(async (response) => {       
          return await response.json();
        }
      ).then(function(response) {
        return  response.id;
      });   
      
      } catch(error) {
        console.log(error.message);
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



  async savePlaylist(name, trackUris, playlistId) {
    if (!name || !trackUris.length) {
      return;
    }
    const accessToken = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = await Spotify.getCurentUserId();  
    

    try {
      if (!playlistId) {
     
      playlistId = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: name, public: true})
      }).then(async (response) =>  {
        
          if(response.ok) {
            return await response.json();
          }

        }
      ).then(jsonResponse => jsonResponse.id)
      } else {
        await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}`, {
          headers: headers,
          method: 'PUT',
          body: JSON.stringify({name: name})
        }).then(function(response) {console.log(response.status)});
      }    

      return await fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({uris: trackUris})
      }).then(function(response) {console.log(response.status)});

    } catch(error){
      console.log(error.message);
    }   
    
    
  },

  async getUserPlaylists() {
    
    const accessToken = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = await Spotify.getCurentUserId();
    

    try { 
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: headers,
        method: 'GET',        
      }).then(response => response.json()
      ).then(jsonResponse => {
        if (!jsonResponse.items) {
          return [];
        }
        return jsonResponse.items.map(playlist =>  {
          return ({
            id: playlist.id,
            name: playlist.name,
            image: (playlist.images[0] ? playlist.images[0].url : awaitForImage()),
            uri: playlist.uri
          })
          function awaitForImage(){
          
           // window.setTimeout(() => {this.getUserPlaylists()}, 1000);
            return 'https://media3.giphy.com/media/3o7bu3XilJ5BOiSGic/giphy.gif?cid=ecf05e47k38a66rybe6p8buui8nxx4ojz6pa9fo97fbolbpj&rid=giphy.gif'
          }
        });
      });


    } catch(error) {
      console.log(error.message);
    }

  },

  async getPlaylist (id) {
     
    const accessToken = await Spotify.getAccessToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    let userId = await Spotify.getCurentUserId();  

    return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${id}/tracks`, {
      headers: headers,
      method: 'GET',        
    }).then(response => response.json()
    ).then(jsonResponse => {
      
      if (!jsonResponse.items) {
        return [];
      }
      return jsonResponse.items.map(item  => ({
        id: item.track.id,
        name: item.track.name,
        artist: item.track.artists[0].name,
        album: item.track.album.name,
        uri: item.track.uri
      }))
   })
  }
};

export default Spotify;