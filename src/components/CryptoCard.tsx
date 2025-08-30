import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import { useCryptoStore } from "../store/cryptoStore";

interface Props {
  id: string;
  name: string;
  symbol: string;
  price: number;
  image: string;
}

const CryptoCard = ({ id, name, symbol, price, image }: Props) => {
  const { favorites, toggleFavorite } = useCryptoStore();
  const isFav = favorites.includes(id);

  return (
    <Card sx={{ display: "flex", alignItems: "center", p: 2 }}>
      <img src={image} alt={name} width={40} height={40} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{name} ({symbol.toUpperCase()})</Typography>
        <Typography variant="body2">${price.toLocaleString()}</Typography>
      </CardContent>
      <IconButton onClick={() => toggleFavorite(id)} color={isFav ? "warning" : "default"}>
        {isFav ? <Star /> : <StarBorder />}
      </IconButton>
    </Card>
  );
};

export default CryptoCard;
