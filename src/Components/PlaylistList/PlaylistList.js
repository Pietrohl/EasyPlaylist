import React from 'react';
import PlaylistItem from '../PlaylistItem/PlaylistItem';
import './PlaylistList.css';


export default class PlaylistList extends React.Component {





    render () {
        return (
            <div className="PlaylistList"> 
                <h2 className="PlaylistListHeader">Playlists Gravadas</h2>
                    <div className="PlaylistListContent">{
                        this.props.playlistList.map((playlist) => { 
                            return <PlaylistItem playlist={playlist} selectPlaylist={this.props.selectPlaylist} key={playlist.id} />
                        } )
                    }
                </div>
            </div>
        );
    };

};
