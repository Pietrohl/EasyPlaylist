import React from 'react';
import TrackList from '../TrackList/TrackList'
import './Playlist.css'

export default class Playlist extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }
    
componentWillReceiveProps (){
    this.renderAction();

}

    renderAction () {
        return (
            //this.state.isRemoval ? <button className="Track-action" onClick={this.removeTrack}>-</button> : <button className="Track-action" onClick={this.addTrack}>+</button> 
            <input defaultValue={this.props.name} value={this.props.name} onChange={this.handleNameChange} />
            )        
    }

    handleNameChange(event){
        let name = event.target.value
        this.props.onNameChange(name)
    }
    render() {
        return (
            <div className="Playlist">
                {this.renderAction()}
                <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
                <button className="Playlist-save" onClick={this.props.onSave}>SALVAR NO SPOTIFY</button>
            </div>
        )
    }
}