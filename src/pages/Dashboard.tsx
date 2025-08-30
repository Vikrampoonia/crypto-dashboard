import { Container, Typography, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar";
import { useCryptos } from "../api/useCryptos";
import CryptoCard from "../components/CryptoCard";
import { FlexGrid, FlexGridItem } from "../components/FlexGrid";

const Dashboard = () => {
  const { data, isLoading, isError } = useCryptos();

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Top Cryptocurrencies
        </Typography>

        {isLoading && <CircularProgress />}
        {isError && <Typography color="error">Failed to load data</Typography>}

        <FlexGrid gap={16}>
          {data?.map((crypto: any) => (
            <FlexGridItem key={crypto.id}>
              <CryptoCard
                id={crypto.id}
                name={crypto.name}
                symbol={crypto.symbol}
                price={crypto.current_price}
                image={crypto.image}
              />
            </FlexGridItem>
          ))}
        </FlexGrid>
      </Container>
    </>
  );
};

export default Dashboard;
