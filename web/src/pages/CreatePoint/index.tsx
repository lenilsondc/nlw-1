import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Link, useHistory } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Map, TileLayer, Marker } from "react-leaflet";
import { LeafletMouseEvent } from "leaflet";
import axios from "axios";

import "./styles.css";
import logo from "../../assets/logo.svg";
import api from "../../services/api";

interface Item {
  id: number;
  title: string;
  image_url: string;
}

const CreatePoint: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const [initialPosition, setInitialPosition] = useState<[number, number]>([
    // defaults to São Paulo - SP
    -23.5608059,
    -46.7010909,
  ]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
  });

  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([
    0,
    0,
  ]);

  const history = useHistory();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      setInitialPosition([coords.latitude, coords.longitude]);
    });
  }, []);

  useEffect(() => {
    api.get("items").then((res) => {
      setItems(res.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get<{ sigla: string }[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((res) => setStates(res.data.map((state) => state.sigla)));
  }, []);

  useEffect(() => {
    if (!selectedState) return;

    axios
      .get<{ nome: string }[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios`
      )
      .then((res) => setCities(res.data.map((state) => state.nome)));
  }, [selectedState]);

  function handleMapClick({ latlng }: LeafletMouseEvent) {
    setSelectedPosition([latlng.lat, latlng.lng]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const { name, email, whatsapp } = formData;
    const city = selectedCity;
    const state = selectedState;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;

    const point = {
      name,
      email,
      whatsapp,
      city,
      state,
      latitude,
      longitude,
      items,
    };

    await api.post("points", point);

    alert("Collection point successfully registered!");

    history.push("/");
  }

  function handleSelectItem({ id }: Item) {
    const alreadySelected = selectedItems.some((item) => item === id);

    if (alreadySelected) {
      const filteredItems = selectedItems.filter((item) => item !== id);

      setSelectedItems(filteredItems);
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta" />

        <Link to="/">
          <FiArrowLeft />
          Back to home
        </Link>
      </header>

      <form onSubmit={handleSubmit}>
        <h1>
          Collection point
          <br />
          registration
        </h1>

        <fieldset>
          <legend>
            <h2>Info</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Entity name</label>
            <input
              type="text"
              name="name"
              id="name"
              onChange={handleInputChange}
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                onChange={handleInputChange}
              />
            </div>
            <div className="field">
              <label htmlFor="name">Whatsapp</label>
              <input
                type="text"
                name="whatsapp"
                id="whatsapp"
                onChange={handleInputChange}
              />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Address</h2>
            <span>Select an address on the map</span>
          </legend>

          <Map center={initialPosition} zoom={13} onClick={handleMapClick}>
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={selectedPosition} />
          </Map>

          <div className="field">
            <label htmlFor="email">Country</label>
            <input
              type="text"
              name="country"
              id="country"
              value="Brazil"
              disabled
            />
          </div>

          <div className="field-group">
            <div className="field">
              <label htmlFor="state">State</label>
              <select
                name="state"
                id="state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
              >
                <option value="">Select a state</option>
                {states.map((state) => (
                  <option value={state} key={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">City</label>
              <select
                name="city"
                id="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option value={city} key={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Items</h2>
            <span>Select one or more items bellow</span>
          </legend>

          <ul className="items-grid">
            {items.map((item) => (
              <li
                key={item.id}
                className={selectedItems.includes(item.id) ? "selected" : ""}
                onClick={() => handleSelectItem(item)}
              >
                <img alt="item" src={item.image_url} />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </fieldset>

        <button type="submit">Register collection point</button>
      </form>
    </div>
  );
};

export default CreatePoint;
