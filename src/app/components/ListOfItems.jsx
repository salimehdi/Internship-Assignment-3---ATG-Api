"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import imgNotAvailable from '../assets/imgNotAvailable.svg';
import Loading from './Loading';

function ListOfItems() {
  const [items, setItems] = useState([]);
  const [errorItems, setErrorItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isMob, setIsMob] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMob(width <= 700);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const getItems = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://602e7c2c4410730017c50b9d.mockapi.io/users');
        response.data.forEach(async (item) => {
          try {
            await new Promise((resolve, reject) => {
              const img = new Image();
              img.src = item.avatar;
              img.onload = () => {
                setItems((prevItems) => [...prevItems, item]);
                resolve();
              };
              img.onerror = () => {
                setErrorItems((prevErrorItems) => [...prevErrorItems, item]);
                reject();
              };
            });
          } catch (error) {
            console.error('Error loading image:', error);
          }
        });
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    getItems();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'start',
      flexDirection: isMob ? 'column' : 'row',
      width: '100%',
      color: 'white',
    }}>
      {loading ? (
        <Loading />
      ) : (
        <>
          {selectedItem && (
            <div key={54357437} className="updated-card" style={{ marginTop: isMob ? "20px" : "calc(50vh - 150px)" }}>
              <img src={selectedItem.avatar} alt={selectedItem.username} />
              <h3 className='nameSelectedCard' style={{ fontWeight: "100" }}>
                <span style={{ fontWeight: "600" }}>Name: </span>{selectedItem.profile.firstName} {selectedItem.profile.lastName}
              </h3>
              <h3 style={{ fontWeight: "100" }}>
                <span style={{ fontWeight: "600" }}>Bio: </span>{selectedItem.Bio}
              </h3>
              <h3 style={{ fontWeight: "100" }}>
                <span style={{ fontWeight: "600" }}>Job Title: </span>{selectedItem.jobTitle}
              </h3>
              <h3 style={{ fontWeight: "100" }}>
                <span style={{ fontWeight: "600" }}>User Name: </span>{selectedItem.profile.username}
              </h3>
              <h3 style={{ fontWeight: "100" }}>
                <span style={{ fontWeight: "600" }}>Email: </span>{selectedItem.profile.email}
              </h3>
            </div>
          )}

          <div className="card-container" style={{ width: isMob ? "100%" : "70%", height: isMob ? (selectedItem ? "calc(100vh -  320px)" : "100vh") : "100vh" }}>
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="card"
                style={{
                  backgroundColor: selectedItem === item ? "black" : "rgba(255, 255, 255, 0.1)",
                }}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={item.avatar}
                  alt={item.username}
                />
                <h3 className="card-title">
                  User:{item.profile.username}
                </h3>
              </div>
            ))}
            {errorItems.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{
                  backgroundColor: selectedItem === item ? "black" : "rgba(255, 255, 255, 0.1)",
                }}
                onClick={() => setSelectedItem(item)}
              >
                <img
                  src={imgNotAvailable}
                  alt={item.username}
                />
                <h3 className="card-title">
                  {item.profile.username}
                </h3>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ListOfItems;
