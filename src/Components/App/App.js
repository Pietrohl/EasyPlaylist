import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from  '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import PlaylistList from '../PlaylistList/PlaylistList'

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName:  "Nova Playlist",
      playlistList: [],
      currentPlaylistId: null
    }
    this.search = this.search.bind(this); 
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);
  }

  async componentDidMount(){
    await window.addEventListener('load', () => {Spotify.getAccessToken()})
    await window.addEventListener('load', () => {Spotify.getUserPlaylists().then(results => this.setState({
      playlistList: results 
    }))})
  }

  

  search(searchTerm){
    Spotify.search(searchTerm).then(newResults =>  this.setState({
      searchResults: newResults
    })) 
  }

  addTrack(track){  
    if (!this.state.playlistTracks.some((playlistTrack)=>playlistTrack.id === track.id)){
    let newPlaylist = this.state.playlistTracks;
    newPlaylist.push(track);
    this.setState({
      playlistTracks: newPlaylist
    })
    }
  } 

  removeTrack(track) {
    this.setState({
      playlistTracks: this.state.playlistTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    })
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  async savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs,this.state.currentPlaylistId).then(() => {
      this.setState({
        playlistTracks: []
      })
      this.updatePlaylistName('Name');
    });
    Spotify.getUserPlaylists().then(results => this.setState({
      playlistList: results 
    }));
    setTimeout(() => {
      Spotify.getUserPlaylists().then(results => this.setState({
      playlistList: results 
    }));
    }, 5000);

  }

  async selectPlaylist(playlist) {
      let  loadedPlaylist = await Spotify.getPlaylist(playlist.id);
      this.setState({
        currentPlaylistId: playlist.id
      })
      if(loadedPlaylist) {
          this.setState({
            playlistName: playlist.name,
            playlistTracks: loadedPlaylist
        })
    }
    
  }

  render() {
    return (
      <div>
        <h1>Easy <span className="highlight">Play</span>list</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} name={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
            <PlaylistList playlistList={this.state.playlistList} selectPlaylist={this.selectPlaylist}  />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
