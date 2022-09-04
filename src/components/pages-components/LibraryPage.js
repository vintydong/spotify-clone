import TopNav from '../TopNav';
import '../../styles/LibraryPage.css';
import '../../styles/content.css';
import makeRequest from '../../utils/makeRequest';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';

function LibraryPage({ user, token }) {
    const [playlists, setPlaylists] = useState('');

    useEffect(() => {
        const getPlaylists = async (token) => {
            let _playlists = await makeRequest(
                'https://api.spotify.com/v1/me/playlists',
                token
            );
            setPlaylists(_playlists.data.items);
        };

        getPlaylists(token);
    }, [token]);

    const replaceChars = {
        '&#x27;': "'",
        '&quot;': '"',
        '&lt;': '<',
        '&gt;': '>',
        '&amp;': '&',
        '&#x2F;': '\\',
    };
    const replaceRegex = /(&#x27;)|(&quot;)|(&lt;)|(&gt;)|(&amp;)|(&#x2F;)/g;

    const playlistElements = playlists
        ? playlists.map((playlist) => {
              let desc = playlist.description
                  ? playlist.description.replace(replaceRegex, (match) => {
                        return replaceChars[match];
                    })
                  : `By ${playlist.owner.display_name}`;
              let { name, images } = playlist;
              return (
                  <Link to={`/playlist/${playlist.id}`}>
                      <div className='playlist-card'>
                          <div className='playlist-card-image'>
                              {images && images[0] ? (
                                  <img src={images[0].url} />
                              ) : (
                                  <FontAwesomeIcon
                                      icon={faMusic}
                                      size='10x'
                                  ></FontAwesomeIcon>
                              )}
                          </div>
                          <div className='playlist-card-title'>{name}</div>
                          <div className='playlist-card-desc'>{desc}</div>
                      </div>
                  </Link>
              );
          })
        : '';
    return (
        <div className='content'>
            <TopNav user={user}></TopNav>
            <div className='grid-container'>{playlistElements}</div>
        </div>
    );
}

export default LibraryPage;
