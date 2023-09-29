import './home.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const handleNavigateToBoard = (isAI) => {
        navigate('/Board', { state: { id: 1, AI: isAI } });
    };

    return (
        <div>
            <section>
                <span></span>
                <span></span>
                <span></span>
                <span></span>


                <div className='btn-container'>
                    <div className='justify-content-center internal-div'>
                        <h3 className='neonText'>Tic Tac Toe</h3>
                    </div>

                    <div className='internal-div'>
                        <button className="btn-84 " onClick={() => handleNavigateToBoard(false)}>2 Player</button>
                        <button className="btn-84" onClick={() => handleNavigateToBoard(true)}>Vs AI</button>
                    </div>
                </div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

                <span></span>

            </section>
            <div class="parent">
                <div class="bottom">
                    <div>
                        <p className='format'>Developed by:</p>
                    </div>
                    <div>
                        {/* <p``> */}
                            <a href="https://www.linkedin.com/in/muhammad-dawar-shamim-54480520a/"  className='format'  target="_blank">M. Dawar Shamim</a>
                        {/* </p> */}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Home;
