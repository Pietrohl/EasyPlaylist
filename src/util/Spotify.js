
const clientID = 'e9a1d274a4f440cfa78ce5fcf63708fc';
const redirectUri = 'http://localhost:3000/'
let accessToken;


const Spotify = {
    getAccessToken(){
        if(accessToken) {
            console.log(`Same Access Token mantained ${accessToken}`);
            return accessToken;
        }
        

        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const tokenExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && tokenExpiresIn){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(tokenExpiresIn[1]);

            //this clears the access parameters
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log(`New Access Token Requested ${accessToken}`);
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&redirect_uri=${redirectUri}&scope=playlist-modify-private&response_type=token`
            window.location = accessUrl;
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { 
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
         }).then(response => response.json()
         ).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            } 
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
         })
    },

    savePlaylist(playlistName, uris) {
        console.log('Inside SavePlaylist')
        if (!playlistName || !uris.length) {
            console.log('Returning')
            return;
        }
        let accessTokenSave = this.getAccessToken();
        console.log(`Acess Token defined ${accessTokenSave}`)
        const headers = {'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessTokenSave}`};
        let userId; // = '12178898226';
        
        return fetch('https://api.spotify.com/v1/me', {headers: headers}).then(response => response.json()
        ).then(jsonResponse => {
            console.log(`Json Response User ID: ${jsonResponse.id}`)
            console.log(typeof jsonResponse.id)
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({name: playlistName, public: true})
            }).then(response => response.json()
            ).then(jsonResponse => {
                console.log(`Json Response Playlist ID: ${jsonResponse.id}`)
                console.log(typeof jsonResponse.id)
                const playlistId = jsonResponse.id;
                accessTokenSave = this.getAccessToken(); 
                return fetch(`http://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks/`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({"uris": uris})
                })
            })
        }).then(function(response) {console.log(response.status)})
        
    }

}
    

export default Spotify;