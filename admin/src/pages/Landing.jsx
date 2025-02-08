import { useNavigate } from 'react-router-dom';
import "../styles/landing.scss";

function Landing() {

  const navigate = useNavigate();

  const handleClick = () => {
    setTimeout(() => {
      navigate('/admin');
    }, 130);
  };

  return (
    <div className="main">
      <header>
        <h1>Dev Fast Food</h1>
        <h3>Scan. Choose. Savor.</h3>
      </header>

      <img src="/images/food_landing.png" alt="Food Plate Imgae" />

      <button onClick={handleClick}>Admin Panel</button>

      <section className="credits">
        <p>Designed By <span>Niha Das</span></p>
        <p>Developed By <span>Sourashish Das</span></p>
      </section>

    </div>
  )
}

export default Landing
