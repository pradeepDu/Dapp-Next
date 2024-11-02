import "../styles/globals.css";

// INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import Navbar from "../components/NavBar/NavBar";

const MyApp = ({ Component, pageProps }) => (
    <VotingProvider>
        <div>
            <Navbar />
            <div>
                <Component {...pageProps} />
            </div>
        </div>
    </VotingProvider>
);

export default MyApp;
