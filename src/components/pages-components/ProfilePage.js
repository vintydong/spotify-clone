import TopNav from '../TopNav';
import Carousel from '../Carousel';
import '../../styles/Profile.css';
import '../../styles/content.css';
import makeRequest from '../../utils/makeRequest';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProfilePage({ user, token }) {
    const [featuredPlaylists, setFeaturedPlaylists] = useState('');
    const [categories, setCategories] = useState('');

    useEffect(() => {
        setFeaturedPlaylists('');
        setCategories('');
        const getFeaturedPlaylists = async (token) => {
            let _playlists = await makeRequest(
                'https://api.spotify.com/v1/browse/featured-playlists',
                token
            );
            setFeaturedPlaylists(_playlists.data.playlists);
        };

        const getCategories = async (token) => {
            let _categories = await makeRequest(
                'https://api.spotify.com/v1/browse/categories',
                token
            );
            setCategories(_categories.data.categories);
        };

        getFeaturedPlaylists(token);
        getCategories(token);
    }, [token]);

    const imgURL = user.images ? user.images[0].url : 'empty-profile.png';
    const display_name = user.display_name || 'Not logged in';
    const followers = (user.followers ? user.followers.total : 0) + ' followers';

    const fplaylists = featuredPlaylists
        ? featuredPlaylists.items.map((playlist) => (
              <Link to={`/playlist/${playlist.id}`}>
                  <li>
                      <img src={playlist.images[0].url} />
                  </li>
              </Link>
          ))
        : '';
    const browseCategories = categories
        ? categories.items.map((cateogory) => (
              <li>
                  <img src={cateogory.icons[0].url} />
              </li>
          ))
        : '';
    return (
        <div className='content'>
            <TopNav user={user}></TopNav>
            <div className='profile'>
                <img className='profilePic' src={imgURL} alt=''></img>
                <div className='profileInfo'>
                    <ul>
                        <li className='name'>{display_name}</li>
                        <li className='followers'>{followers}</li>
                    </ul>
                </div>
            </div>
            <div>
                <Carousel title='Featured Playlists'>{fplaylists}</Carousel>
                <Carousel title='Browse Categories'>{browseCategories}</Carousel>
            </div>
        </div>
    );
}

export default ProfilePage;
