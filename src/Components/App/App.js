import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from  '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      searchResults: [],
      playlistTracks: [],
      playlistName:  "New Playlist"
    }
    this.search = this.search.bind(this); 
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  componentDidMount(){
    window.addEventListener('load', () => {Spotify.getAccessToken()})
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

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
    
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistTracks: []
      })
      this.updatePlaylistName("Name");
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} name={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
