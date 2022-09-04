import TopNav from '../TopNav';
import Dropdown from '../Dropdown';
import '../../styles/PlaylistView.css';
import '../../styles/content.css';
import makeRequest from '../../utils/makeRequest';
import downloadPlaylist from '../../utils/downloadPlaylist';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import ColorThief from 'colorthief';

const { PUBLIC_URL } = process.env;

function PlaylistPage({ id, user, token }) {
    const [songs, setSongs] = useState('');
    const [playlist, setPlaylist] = useState({
        tracksCount: 0,
        imgURL: '',
        playlistName: 'Untitled',
        author: user.display_name,
    });
    const [bg, setBg] = useState([0, 0, 0]);
    const [downloadURL, setDownloadURL] = useState('');
    const [downloadFile, setDownloadFile] = useState('');

    const imgRef = useRef();
    const downloadRef = useRef();

    // Get playlist info and songs
    useEffect(() => {
        let gettingLiked = id === 'me';
        if (!gettingLiked) setPlaylist({});
        setSongs([]);
        setBg([0, 0, 0]);

        const getPlaylistSongs = async (id, token, isLikedSongs) => {
            let next = `https://api.spotify.com/v1/playlists/${id}/tracks`;
            if (isLikedSongs) next = 'https://api.spotify.com/v1/me/tracks';
            let _songs;
            while (next) {
                _songs = await makeRequest(next, token);
                setSongs((s) => [...s, ..._songs.data.items]);
                next = _songs.data.next;
            }
            if (isLikedSongs) {
                setPlaylist((p) => {
                    return { ...p, tracksCount: _songs.data.total };
                });
            }
        };

        const getPlaylistInfo = async (id, token, isLikedSongs) => {
            if (isLikedSongs) {
                setPlaylist((p) => {
                    return {
                        ...p,
                        imgURL: `${PUBLIC_URL}/heart-icon.png`,
                        playlistName: 'Liked Songs',
                    };
                });
                return;
            }

            let url = `https://api.spotify.com/v1/playlists/${id}`;
            let _playlist = await makeRequest(url, token);
            _playlist = _playlist.data;
            let p = {
                tracksCount: _playlist.tracks.total,
                imgURL: _playlist.images[0].url,
                playlistName: _playlist.name,
                author: _playlist.owner.display_name,
            };
            setPlaylist(p);
        };

        getPlaylistSongs(id, token, gettingLiked);
        getPlaylistInfo(id, token, gettingLiked);
    }, [id, token]);

    useEffect(() => {
        if (downloadURL) {
            downloadRef.current.click();
            URL.revokeObjectURL(downloadURL);
            setDownloadURL('');
            return;
        } else return;
    }, [downloadURL]);

    let { tracksCount, imgURL, playlistName, author } = playlist;
    const songsList = songs
        ? songs.map((song) => {
              let _date = new Date(song.added_at);
              _date = _date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
              });
              let _duration = song.track.duration_ms;
              _duration = `${Math.floor(_duration / 60000)}:${String(
                  Math.round((_duration % 60000) / 1000)
              ).padStart(2, '0')}`;
              return (
                  <tr key={song.track.id}>
                      <td>{song.track.name}</td>
                      <td>{song.track.album.name}</td>
                      <td>{_date}</td>
                      <td>{_duration}</td>
                  </tr>
              );
          })
        : '';

    const options = [
        {
            name: 'Save as .txt',
            handler: () => {
                let url = downloadPlaylist(playlist, songs, 'txt');
                setDownloadURL(url);
                setDownloadFile('txt');
            },
        },
        {
            name: 'Save as .csv',
            handler: () => {
                let url = downloadPlaylist(playlist, songs, 'csv');
                setDownloadURL(url);
                setDownloadFile('csv');
            },
        },
        { name: 'Edit', handler: () => null },
    ];
    const bgColor = `rgb(${bg[0]},${bg[1]},${bg[1]})`;
    return (
        <div className='content'>
            <TopNav user={user}></TopNav>
            <div className='playlist' style={{ '--bg-color': bgColor }}>
                <img
                    className='playlistPic'
                    ref={imgRef}
                    src={imgURL}
                    crossOrigin={'anonymous'}
                    alt=''
                    onLoad={() => {
                        const colorthief = new ColorThief();
                        let color = colorthief.getColor(imgRef.current);
                        setBg(color);
                    }}
                ></img>
                <div className='playlistInfo'>
                    <ul>
                        <li className='name'>{playlistName}</li>
                        <li className='author'>{author}</li>
                        <li className='tracks-count'>{tracksCount} songs</li>
                        <Dropdown
                            child={<FontAwesomeIcon icon={faEllipsis}></FontAwesomeIcon>}
                            options={options}
                        ></Dropdown>
                        <a
                            style={{ display: 'none' }}
                            download={`tracks.${downloadFile}`}
                            href={downloadURL}
                            ref={downloadRef}
                        >
                            Download
                        </a>
                    </ul>
                </div>
            </div>

            <div className='playlist-songs'>
                <table className='playlist-songs-table'>
                    <tbody>
                        <tr>
                            <th className='playlist-songs-table-title'>Title</th>
                            <th className='playlist-songs-table-album'>Album</th>
                            <th className='playlist-songs-table-date'>Date Added</th>
                            <th className='playlist-songs-table-duration'>Duration</th>
                        </tr>
                        {songsList}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PlaylistPage;
