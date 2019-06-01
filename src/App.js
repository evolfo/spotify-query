import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

import { CSVLink } from "react-csv";

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

  	this.setState({
  	  playlistIds: []
  	})

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
  	  .then(placeholder => {this.getPlaylists()})
  }

  getPlaylists = () => {
  	console.log('hi')
  	this.setState({
  	  playlists: []
  	})

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
  	  	<ul key={playlist.id}>
  	  	  <li><h3>Playlist Name: {playlist.name}</h3></li>
  	  	  <li><h4>Followers: {playlist.followers.total}</h4></li>
  	  	  <li><a target="_blank" href={playlist.external_urls.spotify}>Link to Playlist</a></li>
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
  	  },
  	  csvLink: {
  	  	marginTop: '1rem',
  	  	display: 'block',
  	  	textDecoration: 'none',
  	  	padding: '.5rem',
  	  	width: '7rem',
  	  	background: 'rgba(29, 185, 84, 0.45)'
  	  }
  	}

  	console.log(this.state.playlists)
  	// https://spotify-query.herokuapp.com/
  	// http://localhost:3000
  	// ${process.env.CLIENT_ID}

  	const csvData = [['Name', 'Playlist Link', 'Follower Count']]

	this.state.playlists.map(playlist => {
      csvData.push([playlist.name, playlist.external_urls.spotify, playlist.followers.total])
	}) 

	  return (
	  	<React.Fragment>
	  	  <div style={style.container}>
	  	  <a href={`https://accounts.spotify.com/authorize?client_id=${process.env.CLIENT_ID}&response_type=token&redirect_uri=https://spotify-query.herokuapp.com/&scope=user-read-private%20user-read-email`}>
	  	  	Authenticate
	  	  </a>
		    <h1>Query Spotify</h1>
		    <form onSubmit={this.handleSubmit}>
		      <input name="searchTerm" type="text" onChange={this.handleChange} value={this.state.searchTerm}/>
		      <input type="submit" value="Submitz" />
		    </form>
		    { this.state.playlists.length > 0 ? <CSVLink style={style.csvLink} data={csvData}>Download CSV</CSVLink> : null }
		    {this.generatePlaylists()}
		  </div>
		</React.Fragment>
	  );
  }
}

export default App;