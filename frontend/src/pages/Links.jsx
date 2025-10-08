import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import MenuBar from '../components/MenuBar';
import './Shop.css';

const linkItems = [
    {
        id: 'trainline',
        title: 'Trainline',
        description: 'Check and book trains across Europe.',
        href: 'https://www.thetrainline.com/'
    },
    {
        id: 'pkp',
        title: 'Poland - PKP',
        description: 'Trainline doesn’t carry Polish trains, so use PKP to determine price.',
        href: 'https://www.pkp.pl/en/'
    },
    {
        id: 'regiojet',
        title: 'Czechia - Regiojet',
        description: 'Trainline carries Regiojet, which doesn’t show on Interrail app, but requires seat reservations.',
        href: 'https://regiojet.com/'
    },
    {
        id: 'cd',
        title: 'Czechia - CD',
        description: 'Trainline doesn’t carry national service, so use CD to determine price.',
        href: 'https://www.cd.cz/en/'
    },
    {
        id: 'slovakia',
        title: 'Slovakia - SK',
        description: 'Trainline doesn’t carry national service, so use SK to determine price.',
        href: 'http://www.slovakrail.sk/en.html'
    },
    {
        id: 'slovenia',
        title: 'Slovenia - OBB',
        description: 'Trainline doesn’t carry national service, so use OBB to determine price.',
        href: 'https://shop.oebbtickets.at/en/ticket'
    },
    {
        id: 'random',
        title: 'Random Choice Generator',
        description: 'Pick a random option with this generator.',
        href: 'https://www.generatorslist.com/random/misc/random-choice-generator'
    },
    {
        id: 'circle-tool',
        title: 'Circle Drawing Tool',
        description: 'Draw circles on maps with this tool.',
        href: 'https://www.calcmaps.com/map-radius/'
    },
    // NOT CURRENTLY WORKING
    // {
    //     id: 'live-departure',
    //     title: 'Live Departure Boards',
    //     description: 'Check live departures for Hamburg Hbf.',
    //     href: 'https://euro-train.com/station/159-hamburg-hbf-hamburg-main-station'
    // },
];

const LinkCard = ({ item }) => {
    return (
        <div className="item-card">
            <div className="card-header">
                <div className="card-info">
                    <h3 className="card-name">{item.title}</h3>
                </div>
            </div>
            <p className="card-comments">{item.description}</p>
            <a 
                className="item-button button-primary" 
                href={item.href} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                Visit
                <ArrowRight size={18} />
            </a>
        </div>
    );
};

const Links = () => {

    return (
        <div className="shop-container"><MenuBar />
            <div className="shop-content-wrapper main-content-padding">
                <div className="shop-header">
                    <h1 className="shop-title">USEFUL LINKS</h1>
                </div>

                <div className="item-list">
                    {linkItems.map(item => (
                        <LinkCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Links;
