import { BrowserRouter } from 'react-router-dom';
import Layout from '../layout/layout/Layout';
import './App.css';
import { Provider } from 'react-redux';
import store from '../../redux/store';

function App() {

    return (
        <BrowserRouter>
            <Provider store={store}>
                <Layout />
            </Provider>
        </BrowserRouter>
    );
}

export default App;
