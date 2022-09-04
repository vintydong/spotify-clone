import '../styles/TopNav.css';
import { useNavigate } from 'react-router-dom';
import Dropdown from './Dropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';

const { REACT_APP_BACKEND_URL } = process.env;

function TopNav({ user }) {
    const login = user.display_name ? (
        <div className='TopNav-Profile'>
            <img src={user.images[0].url} />
            <div className='TopNav-Profile-name'>{user.display_name}</div>
            <Dropdown
                isRight={true}
                child={<FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>}
                options={[
                    { name: 'Profile', handler: () => navigate('/') },
                    {
                        name: 'Logout',
                        handler: () => {
                            window.location = `${REACT_APP_BACKEND_URL}/logout`;
                        },
                    },
                ]}
            />
        </div>
    ) : (
        <div className='TopNav-Profile'>
            <img src={'/empty-profile.png'} />
            <a href={`${REACT_APP_BACKEND_URL}/login`}>Login</a>
        </div>
    );

    const navigate = useNavigate();
    const back = () => navigate(-1);
    const forw = () => navigate(1);
    return (
        <div className='TopNav'>
            <div className='TopNavButtons'>
                <div className='TopNav-Left'>
                    <FontAwesomeIcon onClick={back} icon={faAngleLeft} />
                </div>
                <div className='TopNav-Right'>
                    <FontAwesomeIcon onClick={forw} icon={faAngleRight} />
                </div>
            </div>
            {login}
        </div>
    );
}

export default TopNav;
