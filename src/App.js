import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  state = {
    searchTerm: '',
    accessToken: window.location.hash.substring(14, 177),
    playlistIds: [],
    playlists: []
  }

  handleChange = (e) => {
  	this.setState({
  	  searchTerm: e.target.value,
  	})
  }

  handleSubmit = (e) => {
  	e.preventDefault()
  	fetch(`https://api.spotify.com/v1/search?q=${this.state.searchTerm}&type=playlist&limit=50`, {
  	  method: 'GET',
  	  headers: {
  	  	'Authorization': 'Bearer ' + this.state.accessToken
  	  }
  	})
  	  .then(res => res.json())
  	  .then(playlists => {
  	  	playlists.playlists.items.map(playlist => {
  	  	  this.setState({
  	  	  	playlistIds: [...this.state.playlistIds, playlist.id]
  	  	  })
  	  	})
  	  })
  }

  getPlaylists = () => {
  	if (this.state.playlistIds.length > 49) {
  	  this.state.playlistIds.map(playlistId => {
  	    fetch(`https://api.spotify.com/v1/playlists/` + playlistId, {
  	      method: 'GET',
  	  	  headers: {
  	  	    'Authorization': 'Bearer ' + this.state.accessToken
  	  	  }
  	    })
  	      .then(res => res.json())
  	      .then(playlist => {
  	      	if(playlist.followers && playlist.followers.total > 999) {
  	      	  this.setState({
  	      	  	playlists: [...this.state.playlists, playlist]
  	      	  })
  	      	}
  	      })
  	  })
  	}
  }

  generatePlaylists = () => {
  	return this.state.playlists.map(playlist => {
  	  return (
  	  	<ul>
  	  	  <li><h3>Playlist Name: {playlist.name}</h3></li>
  	  	  <li><h4>Followers: {playlist.followers.total}</h4></li>
  	  	  <li><a href={playlist.href}>Link to Playlist</a></li>
  	  	  <li>User: {playlist.owner.display_name}</li>
  	    </ul>
  	  )
  	})
  }

  render (){
  	const style = {
  	  container: {
  	  	padding: '5rem',
  	  	border: '10px solid black'
  	  }
  	}

  	console.log(this.state.playlists)

	  return (
	  	<React.Fragment>
	  	  <div style={style.container}>
	  	  <a href='https://accounts.spotify.com/authorize?client_id=3b65d5b25ce043c6b3f1004e13b733e0&response_type=token&redirect_uri=http://localhost:3000&scope=user-read-private%20user-read-email'>
	  	  	Authenticate
	  	  </a>
		    <h1>Query Spotify</h1>
		    <form onSubmit={this.handleSubmit}>
		      <input name="searchTerm" type="text" onChange={this.handleChange} value={this.state.searchTerm}/>
		      <input type="submit" value="Submitz" />
		    </form>
		    <button onClick={this.getPlaylists}>Show Playlists</button>
		    {this.generatePlaylists()}
		  </div>
		</React.Fragment>
	  );
  }
}

export default App;