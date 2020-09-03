import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from  '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'

class App extends React.Component {
  constructor(props) {
    super(props);
    let genericTrack1 = {
      name: 'Musica',
      artist: 'Pietro',
      album: 'album',
      id: '1',
      uri: '1'
    }
    let genericTrack2 = {
      name: 'Musica2',
      artist: 'Pietro2',
      album: 'album2',
      id: '2',
      uri: '2'
    }
    let genericTrack3 = {
      name: 'Musica3',
      artist: 'Pietro3',
      album: 'album3',
      id: '3',
      uri: '3'
    }
    let genericSearchResults = [genericTrack1, genericTrack2, genericTrack3];
    

    this.state = {
      searchResults: genericSearchResults,
      playlistTracks: [],
      playlistName:  "Playlist do Pietro"
    }
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.UpdatePlaylistName = this.UpdatePlaylistName.bind(this);
    this.SavePlaylist = this.SavePlaylist.bind(this);
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

  UpdatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  SavePlaylist() {
    let trackURIs = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} name={this.state.playlistName} onRemove={this.removeTrack} onNameChange={this.UpdatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
