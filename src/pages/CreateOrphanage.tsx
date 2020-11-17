import React, {ChangeEvent, FormEvent, useState} from "react";
import { Map, Marker, TileLayer } from 'react-leaflet';
import {LeafletEvent} from 'leaflet';
import L from 'leaflet';
import { useHistory } from "react-router-dom";

import { FiPlus } from "react-icons/fi";

import mapMarkerImg from '../images/MapaLogo.svg';

import '../styles/pages/create-orphanage.css';
import Sidebar from "../components/Sidebar";
import api from "../services/api";

const happyMapIcon = L.icon({
  iconUrl: mapMarkerImg,

  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [0, -60]
})


export default function CreateOrphanage() {
  const history = useHistory();
  const [position, setPosition] = useState({latitude: 0, longitude: 0})
  const[name, setName]= useState("");
  const[latitude, setLatitude]= useState("");
  const[about, setAbout]= useState("");
  const[openingHours, setOpeningHours]= useState("");
  const[openOnWeekends, setOpenOnWeekends]= useState(false);
  const[instructions, setInstructions]= useState("");
  const[images, setImages]= useState<File[]>([])
  const [previewImages, setPreviewImage] = useState<string[]>([])



  function handleMapClick(event: any){

    const {lat, lng} = event.latlng;
    const aux ={
      latitude: lat,
      longitude: lng
    }
     setPosition({
       latitude: lat,
       longitude: lng
     })

  }
  async function  handleSubmit(event: FormEvent){
      event.preventDefault();
      const {latitude, longitude} = position;

      const data =new  FormData();

      data.append('name', name);
      data.append('latitude', String(latitude));
      data.append('longitude', String(longitude));
      data.append('about', about);
      data.append('openingHours', openingHours);
      data.append('openOnWeekends', String(openOnWeekends));
      data.append('instructions', instructions);
      images.forEach(image=>{
        data.append('images', image);
      })

    await  api.post('orphanages', data);
      alert('Cadastro realizado com sucesso')
    history.push('/App')
;
  }

  function  handleSelectedImage(event: ChangeEvent<HTMLInputElement>){
      // console.log(event.target.files);
    if(!event.target.files){
      return;
    }
    const selectedImages = Array.from(event.target.files)
    setImages(selectedImages)

    const selectedImagesPreview = selectedImages.map(image=>{
      return URL.createObjectURL(image);
    })
    setPreviewImage(selectedImagesPreview);

  }

  return (


    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form
            className="create-orphanage-form"
            onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>Dados</legend>

            <Map 
              center={[-25.9158687,32.5484543]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer 
                url={`https://api.mapbox.com/styles/v1/mapbox/light-v10/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />
              {
                position.latitude !== 0
                  &&
                <Marker interactive={false}
                        icon={happyMapIcon}
                        position={[position.latitude,position.longitude]}
                />
              }


            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input id="name"
                     value={name}
                     onChange={event => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea id="name"
                        maxLength={300}
                        value={about}
                        onChange={event => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">

                {previewImages.map(image=>{
                  return(
                      <img src={image} alt={name}/>
                  )

                })}
                <label htmlFor="image[]" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>

                <input
                    multiple
                    type="file"
                    id="image[]"
                    onChange={handleSelectedImage}
                />

              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea id="instructions"
                        value={instructions}
                        onChange={event => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horas de Funcionamento</label>
              <input id="opening_hours"
                     maxLength={300}
                     value={openingHours}
                     onChange={event => setOpeningHours(event.target.value)}

              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button type="button"
                        className={openOnWeekends? 'active': ''}
                        onClick={()=>setOpenOnWeekends(true)}

                >Sim</button>
                <button
                    type="button"
                    className={!openOnWeekends? 'active': ''}
                    onClick={()=>setOpenOnWeekends(false)}
                >Não</button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar

          </button>
        </form>
      </main>
    </div>
  );
}

// return `https://a.tile.openstreetmap.org/${z}/${x}/${y}.png`;
