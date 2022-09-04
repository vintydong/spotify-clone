import '../styles/Carousel.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

function Carousel({ children, title }) {
    const [start, setStart] = useState(0);
    const maxChildren = 5;

    let items = [];
    if (children) {
        let index = start;
        for (let i = 0; i < maxChildren; i++) {
            items.push(children[index]);
            index++;
            if (index > children.length - 1) index = 0;
            if (index < 0) index = children.length - 1;
        }
    }

    const handleClick = (increase) => {
        let newStart = start + increase;
        if (newStart < 0) newStart = children.length - 1;
        if (newStart > children.length - 1) newStart = 0;
        const handler = () => setStart(newStart);
        return handler;
    };

    return (
        <div className='carousel'>
            <div className='carousel-title'>{title}</div>
            <div className='carousel-display'>
                <FontAwesomeIcon
                    className='carousel-button-left'
                    onClick={handleClick(-1)}
                    icon={faAngleLeft}
                />
                <div className='carousel-children'>{items}</div>
                <FontAwesomeIcon
                    className='carousel-button-right'
                    onClick={handleClick(1)}
                    icon={faAngleRight}
                />
            </div>
        </div>
    );
}

export default Carousel;
