import '../../styles/Sidebar.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faHouse, faMagnifyingGlass, faFolder, faHeart } from '@fortawesome/free-solid-svg-icons';

function Sidebar(props) {
    let sidebarTop = (
        <div className='sidebarTop'>
            <div className='sidebarLogo'>
                <FontAwesomeIcon icon={faSpotify} size='2x'></FontAwesomeIcon> Spotify
            </div>
            <div className='sidebarMenu'>
                <ul>
                    <Link to={'/'}>
                        <li>
                            <FontAwesomeIcon icon={faHouse}></FontAwesomeIcon>Home
                        </li>
                    </Link>
                    <Link to={'/'}>
                        <li>
                            <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                            Search
                        </li>
                    </Link>
                    <Link to={'/collection'}>
                        <li>
                            <FontAwesomeIcon icon={faFolder}></FontAwesomeIcon>Library
                        </li>
                    </Link>
                    <Link to={'/collection/tracks'}>
                        <li>
                            <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>Liked Songs
                        </li>
                    </Link>
                </ul>
            </div>
            <hr />
        </div>
    );

    let playlists = props.playlists
        ? props.playlists.map((p) => (
              <Link to={`/playlist/${p.id}`} key={p.id}>
                  <li>{p.name}</li>
              </Link>
          ))
        : [];

    let sidebarPlaylists = (
        <div className='sidebarPlaylists'>
            <ul>{playlists}</ul>
        </div>
    );
    return (
        <div className='Sidebar'>
            {sidebarTop}
            {sidebarPlaylists}
        </div>
    );
}

export default Sidebar;
