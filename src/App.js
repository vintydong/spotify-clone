import './styles/App.css';
import Sidebar from './components/sidebar-components/Sidebar.js';
import Footer from './components/Footer.js';
import ProfilePage from './components/pages-components/ProfilePage.js';
import PlaylistPage from './components/pages-components/PlaylistPage.js';
import LibraryPage from './components/pages-components/LibraryPage.js';
import axios from 'axios';
import makeRequest from './utils/makeRequest';
import { useEffect, useState } from 'react';
import { Routes, Route, useMatch, Navigate } from 'react-router-dom';

const { REACT_APP_BACKEND_URL } = process.env;

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [access_token, setAccessToken] = useState(false);
    const [playlists, setPlaylists] = useState(false);
    const [user, setUser] = useState(false);

    let match = useMatch('/playlist/:id');

    useEffect(() => {
        // If auth server is error, not logged in
        const loadInfo = async (access_token) => {
            const loadUser = makeRequest(
                'https://api.spotify.com/v1/me',
                access_token
            );
            const loadPlaylists = makeRequest(
                'https://api.spotify.com/v1/me/playlists',
                access_token
            );

            try {
                const [_user, _playlists] = await Promise.all([
                    loadUser,
                    loadPlaylists,
                ]);
                setUser(_user.data);
                setPlaylists(_playlists.data.items);
            } catch (error) {
                console.log('Error loading user info');
            }
        };
        axios
            .get(`${REACT_APP_BACKEND_URL}/refresh`, {
                withCredentials: true,
            })
            .then((res) => {
                if (res.data.access_token) {
                    setAccessToken(res.data.access_token);
                    setLoggedIn(true);
                    _token = res.data.access_token;
                    loadInfo(_token);
                } else {
                    console.log('No access token received');
                }
            })
            .catch((err) => console.log(err));
    }, []);

    if (!match) match = { params: { id: '' } };

    return (
        <div className='App'>
            <div className='Top'>
                <Sidebar loggedIn={loggedIn} playlists={playlists}></Sidebar>
                <Routes>
                    <Route
                        path='/collection'
                        element={<Navigate to='/collection/playlists' />}
                    ></Route>
                    <Route
                        path='/collection/playlists'
                        element={
                            <LibraryPage token={access_token} user={user} />
                        }
                    ></Route>
                    <Route
                        path='/collection/tracks'
                        element={
                            <PlaylistPage
                                id={'me'}
                                token={access_token}
                                user={user}
                            />
                        }
                    ></Route>
                    <Route
                        path='/'
                        element={
                            <ProfilePage token={access_token} user={user} />
                        }
                    ></Route>
                    <Route
                        path='/playlist/:id'
                        element={
                            <PlaylistPage
                                id={match.params.id}
                                token={access_token}
                                user={user}
                            />
                        }
                    ></Route>
                </Routes>
            </div>
            <Footer></Footer>
        </div>
    );
}

export default App;
