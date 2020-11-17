import React, {useEffect, useState} from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import Leaflet from 'leaflet';
import {useParams} from 'react-router-dom';

import mapMarkerImg from '../images/MapaLogo.svg';

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";
import {Loading} from "../components/Loading";

const happyMapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})

interface  Image{
  id: number,
  path: string
}

interface  Orphanage {
  id: number,
  latitude: number,
  longitude: number,
  name: string,
  about: string,
  instructions: string,
  openingHours: string,
  openOnWeekends: string
  images: Image[]
};

interface OrphanageParams{
  id: string,
}

export default function Orphanage() {
  const params = useParams<OrphanageParams>();

  const [selectedOrphanage, setSelectedOrphanage]= useState<Orphanage>();
  const [activeImageIndex, setActiveImageIndex]= useState(0);


  useEffect(()=>{
    api.get(`orphanages/${params.id}`).then(response=>{
      setTimeout(() => {
        setSelectedOrphanage(response.data);
      }, 2000);
    })
  }, [params.id]);

  if(!selectedOrphanage){
    return(
     <Loading />
    )
  }

  return (
    <div id="page-orphanage">

    <Sidebar></Sidebar>

      <main>
        <div className="orphanage-details">
          {}
          <img src={selectedOrphanage.images[activeImageIndex].path ?
                selectedOrphanage.images[activeImageIndex].path:
              "https://www.gcd.com.br/wp-content/uploads/2020/08/safe_image.jpg"
          }
               alt={selectedOrphanage?.name} />

          <div className="images">

            {
              selectedOrphanage.images?.map((image, index)=>(
                  <button
                      className="active"
                      type="button"
                      key={image.id}
                      onClick={()=>{
                        setActiveImageIndex(index)
                      }}
                  >
                    <img src={image?.path? image.path: "https://www.gcd.com.br/wp-content/uploads/2020/08/safe_image.jpg"}
                         alt={selectedOrphanage?.name} />
                  </button>
              ))
            }
          </div>

          <div className="orphanage-details-content">
            <h1>{selectedOrphanage.name}</h1>
            <p>{selectedOrphanage.about}</p>

            <div className="map-container">
              <Map
                center={[selectedOrphanage.latitude, selectedOrphanage.longitude]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={happyMapIcon} position={[selectedOrphanage.latitude,selectedOrphanage.longitude]} />
              </Map>

              <footer>
                <a href="">Ver rotas no Google Maps</a>
              </footer>
            </div>

            <hr />

            <h2>{selectedOrphanage.instructions}</h2>
            <p>Venha como se sentir mais à vontade e traga muito amor para dar.</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {selectedOrphanage.openOnWeekends}
              </div>
              {selectedOrphanage.openOnWeekends?

                <div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83"/>
                Atendemos <br/>
                fim de semana
              </div>:
                  <div className="no-open-on-weekends">
                    <FiInfo size={32} color="#39CC83"/>
                    Atendemos <br/>
                    fim de semana
                  </div>

              }
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}