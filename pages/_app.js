// pages/_app.js
import "../styles/globals.css";

// INTERNAL IMPORT
import { VotingProvider } from "../context/Voter";
import Navbar from "../components/NavBar/NavBar";

const MyApp = ({ Component, pageProps }) => (
  <VotingProvider>
    <div>
      <Navbar />
      {/* Render the active page component dynamically */}
      <Component {...pageProps} />
    </div>
  </VotingProvider>
);

export default MyApp;
