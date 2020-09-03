import React from 'react';
import './Track.css'

export  class Track extends React.Component {    
    constructor(props){
        super(props);
        this.state = { 
            isRemoval: this.props.isRemoval
        }
        
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    addTrack() {
        this.setState( {
            isRemoval: !this.props.isRemoval
        })
        this.props.onAdd(this.props.track);
    }
    removeTrack() {
        this.setState( {
            isRemoval: !this.props.isRemoval
        })
        this.props.onRemove(this.props.track);   
    }



    renderAction () {
        return (
            this.state.isRemoval ? <button className="Track-action" onClick={this.removeTrack}>-</button> : <button className="Track-action" onClick={this.addTrack}>+</button> 
        )        
    }
    
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>Artista: {this.props.track.artist} | Album: {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        )
    }
};