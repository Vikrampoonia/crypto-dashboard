import { Container, Typography } from "@mui/material";
import { useCryptoStore } from "../store/cryptoStore";
import CryptoCard from "../components/CryptoCard";
import { useCryptos } from "../api/useCryptos";
import Navbar from "../components/Navbar";


const Favorites = () => {
  const { favorites } = useCryptoStore();
  const { data } = useCryptos();

  const favoriteCryptos = data?.filter((crypto: any) =>
    favorites.includes(crypto.id)
  );

  return (
    <>
      <Navbar/>
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Your Favorites
        </Typography>

        {favoriteCryptos?.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteCryptos.map((crypto: any) => (
              <CryptoCard
                key={crypto.id}
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.current_price}
                image={crypto.image}
              />
            ))}
          </div>
        ) : (
          <Typography>No favorites yet.</Typography>
        )}
      </Container>    
    </>
    
  
  );
};

export default Favorites;
