// app/layout.tsx
import {AuthProvider} from "@/app/components/Providers";
import {CartProvider} from "@/app/pages/CartContext/page";
import {SelectedCategoryProvider} from "@/app/pages/SelectedCategoryForProductContext/page";
import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";
import {ProductProvider} from "@/app/pages/context/ProductContext";
import {CartSideBar} from '@/app/pages/context/CartSideBar';
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <AuthProvider>
            <CartProvider>
                <SelectedCategoryProvider>
                    <ProductProvider>
                        <CartSideBar>
                            <ToastContainer        // for listen the toast on all page of project
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={true}
                                closeButton={false}
                                rtl={false}
                                pauseOnFocusLoss={false}
                                pauseOnHover={false}
                                theme="light"
                            />
                            {children}
                        </CartSideBar>
                    </ProductProvider>
                </SelectedCategoryProvider>
            </CartProvider>
        </AuthProvider>
        </body>
        </html>
    );
}
