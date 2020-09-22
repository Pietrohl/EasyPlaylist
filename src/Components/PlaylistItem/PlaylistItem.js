import React from 'react';
import './PlaylistItem.css';


export default class PlaylistItem extends React.Component {

    constructor(props) {
        super(props);
        this.State = {
            selected: false
        }

        this.onSelect = this.onSelect.bind(this);
       // this.onDissmiss = this.onDissmiss.bind(this);
    }

    onSelect() {
        this.setState({
            selected: true
        });
        this.props.selectPlaylist(this.props.playlist);
    }

    /*onDissmiss() {
        console.log(`Playlist dissmissed`)
        this.setState({
            selected: false
        });
    }*/

    render () {
        return (<div  className="PlaylistInstance" key={this.props.playlist.id} >
                                <div className="PlaylistThumb" ><img  alt='' src={this.props.playlist.image} onClick={this.onSelect}/></div>
                                <div className="PlaylistInfo"><h3>{this.props.playlist.name}</h3></div>
                            </div>)

    }

}