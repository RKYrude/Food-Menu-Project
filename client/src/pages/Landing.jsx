import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../styles/landing.scss";

function Landing() {

  const navigate = useNavigate(); 

  const handleClick = () => {
    setTimeout(() => {
      navigate('/home'); 
    }, 130); 
  };

  return (
    <div className="main">
      <header>
        <h1>Dev Fast Food</h1>
        <h3>Scan. Choose. Savor.</h3>
      </header>

      <img src="/images/food_landing.png" alt="" />

      <button onClick={handleClick}>See Menu</button>
      
    </div>
  )
}

export default Landing
