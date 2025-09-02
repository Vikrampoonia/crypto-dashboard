import React, { useState, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { usePaginatedCryptos } from "../api/usePaginatedCrypto";
import CryptoCard from "../components/CryptoCard";
import { FlexGrid, FlexGridItem } from "../components/FlexGrid";

export default function Dashboard() {
  const [searchText, setSearchText] = useState(""); // UI input state
  const searchQueryRef = useRef(""); // 🔹 non-UI search state

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch 
  } = usePaginatedCryptos(searchQueryRef.current);

  const handleSearch = () => {
    searchQueryRef.current = searchText.trim();
    console.log("Searching for:", searchQueryRef.current);
      refetch(); 
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Top Cryptocurrencies
        </Typography>

        {/* Search Input + Button */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
          <TextField
            label="Search coin..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </div>

        {isLoading && <CircularProgress />}
        {isError && <Typography color="error">No coin found</Typography>}

        <FlexGrid gap={16}>
          {data?.pages.map((page, i) => (
            <React.Fragment key={i}>
              {page.items.map((crypto: any) => (
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
            </React.Fragment>
          ))}
        </FlexGrid>

        {hasNextPage && (
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </Button>
        )}
      </Container>
    </>
  );
}
