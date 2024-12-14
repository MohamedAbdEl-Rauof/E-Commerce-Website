// app/page.tsx
import Home from "./pages/Home/page";
import {CartProvider} from "./pages/CartContext/CartContextProvider";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
    return (
        <CartProvider>
            <div>
                <ToastContainer/>
                <Home/>
            </div>
        </CartProvider>
    );
}
