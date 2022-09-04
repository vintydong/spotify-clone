import '../styles/Dropdown.css';
import { useState, useRef } from 'react';

function Dropdown({ isRight, child, options }) {
    const [drop, setDrop] = useState(false);
    const ref = useRef('menu');

    document.addEventListener('mousedown', (event) => {
        if (ref && ref.current && !ref.current.contains(event.target)) {
            setDrop(false);
        }
    });

    const handleClick = () => {
        setDrop(!drop);
    };
    const menu =
        !drop ||
        options.map((option) => (
            <li key={option.name} onClick={option.handler}>
                {option.name}
            </li>
        ));

    const style = isRight ? { right: 0 } : { left: 0 };
    return (
        <div ref={ref} className='dropdown-container'>
            <button className='dropdown-button' onClick={handleClick}>
                {child}
            </button>
            <div style={style} className='dropdown-items'>
                {menu}
            </div>
        </div>
    );
}

export default Dropdown;
