import "./App.css";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";

function App() {

  const initialCart = ()=>{
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }
  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(()=>{
     localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  function addToCart(item) {
    const itemExist = cart.findIndex((product) => product.id === item.id);
    if (itemExist >= 0) {
      const updateCart = [...cart];
      updateCart[itemExist].quantity++;
      setCart(updateCart);
    } else {
      item.quantity = 1
      setCart([...cart, item]);
    }
  }
  const removeFromCart = (id)=>{
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  const addQuantity = (id)=>{
    setCart(prevCart => 
      prevCart.map(guitar => {
        if (guitar.id === id) {
          return { ...guitar, quantity: guitar.quantity + 1 };
        }
        return guitar;
      })
    );
  }

  const decreaseQuantity = (id)=>{
    setCart(prevCart =>
      prevCart.map(guitar => {
        if (guitar.id === id) {
          const newQuantity = guitar.quantity - 1;
          if (newQuantity === 0) {
            removeFromCart(id);
          } else {
            return { ...guitar, quantity: newQuantity };
          }
        }
        return guitar;
      })
    );
  }
  const deleteCart = ()=>{
    setCart([])
  }
  
  
  return (
    <>
      <Header cart={cart} removeFromCart={removeFromCart}
       addQuantity={addQuantity}
       decreaseQuantity={decreaseQuantity}
       deleteCart={deleteCart}
       />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
