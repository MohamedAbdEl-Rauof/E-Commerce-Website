// app/page.tsx
import Home from "./pages/Home/page";
import { CartProvider } from "./pages/CartContext/page"

export default function App() {
  return (
    <CartProvider> 
      <div>
        <Home />
      </div>
    </CartProvider>
  );
}
