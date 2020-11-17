// @flow 
import React, {useEffect, useState } from 'react';

import mapMarkerimg from '../images/MapaLogo.svg';
import {Link} from 'react-router-dom';
import {FiPlus, FiArrowRight} from 'react-icons/fi';
import leaflet from 'leaflet';
import { Map, TileLayer, Marker, Popup} from 'react-leaflet';


import 'leaflet/dist/leaflet.css'
import '../styles/pages/orphanages.css';
import api from "../services/api";


const mapIcon = new leaflet.Icon({
   iconUrl: mapMarkerimg,
    iconSize: [58,68],
    iconAnchor:[29, 68],
    popupAnchor: [20, -55]
})

interface  Orphanage {
    id: number,
    latitude: number,
    longitude: number,
    name: string

};

function OrfanagesMap() {
    const [orphanages, setOrphanages ]= useState<Orphanage[]>([]);


    useEffect(()=>{
        api.get('orphanages').then(response=>{
                setOrphanages(response.data);
        })
    }, []);


    return (
        <div className="page-map">
            <aside>
                <header>
                    <img src={mapMarkerimg} alt="Logo do Mapa" />

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas Criancas estao esperando a sua visita</p>
                </header>

                <footer>
                    <strong>Maputo</strong>
                    <span>Hulene</span>
                </footer>

            </aside>

            <Map 
                center={[-25.8960874,32.5406434]}
                zoom={11}
                style={{ width: '100%', height: '100%' }}

            >
                <TileLayer
                    // url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                >

                </TileLayer>

                {
                    orphanages.map(orphanage=>{
                        return(
                            <Marker
                                position={[orphanage.latitude,orphanage.longitude]}
                                icon = {mapIcon}
                                key={orphanage.id}
                            >

                                <Popup closeButton={false} minWidth={240} maxWidth={240}
                                       className="map-popup">
                                    {
                                        orphanage.name
                                    }
                                    <Link to={`/orphanages/${orphanage.id}`}>
                                        <FiArrowRight size={20} color={"FFF"} />
                                    </Link>
                                </Popup>

                            </Marker>

                        );
                    })
                }

            </Map>

            <Link to="/orphanages/create" className="create-orphanage">
                <FiPlus size={32} color="#fff"/>
            </Link>
        </div>
    );
};
export default OrfanagesMap;