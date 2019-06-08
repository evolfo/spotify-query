import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import Check from './Check';

import { CSVLink } from "react-csv";

class App extends Component {

  state = {
    searchTerm: '',
    followerAmount: 1000,
    accessToken: window.location.hash.substring(14, 177),
    playlistIds: [],
    playlists: [],
    checkedPlaylists: []
  }

  handleChange = (e) => {
  	this.setState({
  	  [e.target.name]: e.target.value,
  	})
  }

  // checked={this.state.allChecked || playlist.checked} onChange={() => this._handleCheckboxChang(playlist)}

  handleSubmit = (e) => {
  	e.preventDefault()

  	if (this.state.searchTerm.length === 0) {
  	  alert('Please type a longer search term')
  	  return
  	}

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
  	      	if(playlist.followers && playlist.followers.total > this.state.followerAmount) {
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
  	  	  <Check onClick={(e) => this.handleCheckClick(e, playlist)} />
  	  	  <li><h3>Playlist Name: {playlist.name}</h3></li>
  	  	  <li><h4>Followers: {playlist.followers.total}</h4></li>
  	  	  <li><a target="_blank" href={playlist.external_urls.spotify}>Link to Playlist</a></li>
  	  	  <li>User: {playlist.owner.display_name}</li>
  	    </ul>
  	  )
  	})
  }

  handleCheckClick = (e, playlist) => {
  	if(e.target.checked) {
      this.setState({
        checkedPlaylists: [...this.state.checkedPlaylists, playlist]
      })
    } else {
      this.setState({
      	checkedPlaylists: this.state.checkedPlaylists.filter(plist => plist.id !== playlist.id)
      })
    }
  }

  render (){
  	const style = {
  	  container: {
  	  	padding: '5rem',
  	  	border: '10px solid black'
  	  },
  	  csvLink: {
  	  	marginTop: '1rem',
  	  	marginRight: '.5rem',
  	  	display: 'inline-block',
  	  	textDecoration: 'none',
  	  	padding: '.5rem',
  	  	width: '12.5rem',
  	  	textAlign: 'center',
  	  	background: 'rgba(29, 185, 84, 0.45)'
  	  },
  	  input: {
  	  	minWidth: '11rem'
  	  }
  	}

  	// https://spotify-query.herokuapp.com/
  	// http://localhost:3000
  	// ${process.env.REACT_APP_CLIENT_ID}

  	const csvData = [['Name', 'Playlist Link', 'Follower Count']]
  	const csvSelectedData = [['Name', 'Playlist Link', 'Follower Count']]

  	this.state.playlists.map(playlist => {
      csvData.push([playlist.name, playlist.external_urls.spotify, playlist.followers.total])
	}) 

	this.state.checkedPlaylists.map(playlist => {
      csvSelectedData.push([playlist.name, playlist.external_urls.spotify, playlist.followers.total])
	}) 

	  return (
	  	<React.Fragment>
	  	  <div style={style.container}>
	  	  <a href={`https://accounts.spotify.com/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=token&redirect_uri=https://spotify-query.herokuapp.com/&scope=user-read-private%20user-read-email`}>
	  	  	Authenticate
	  	  </a>
		    <h1>Spotify Playlist Search</h1>
		    <p>This site searches the Spotify playlist database based on the search term(s). It will return all the playlists that match that have over 1,000 followers (50 items max). Be sure to authenticate first!</p>
		    <form onSubmit={this.handleSubmit}>
		      <p><input style={style.input} name="followerAmount" type="text" onChange={this.handleChange} value={this.state.followerAmount}/> Minimum amount of followers for playlist</p>
		      <p><input style={style.input} placeholder="Type your search term here" name="searchTerm" type="text" onChange={this.handleChange} value={this.state.searchTerm}/><br /></p>
		      <input type="submit" value="Submitz" />
		    </form>
		    { this.state.playlists.length > 0 ? 
		    	<React.Fragment>
		    	  <CSVLink style={style.csvLink} data={csvSelectedData}>Download Selected as CSV</CSVLink>
		    	  <CSVLink style={style.csvLink} data={csvData}>Download All as CSV</CSVLink>
		     	</React.Fragment>
		     	: null }
		    { this.state.playlistIds.length > 0 ? this.generatePlaylists() : null }
		  </div>
		</React.Fragment>
	  );
  }
}

export default App;