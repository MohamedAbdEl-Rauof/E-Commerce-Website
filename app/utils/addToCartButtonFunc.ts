import {toast} from "react-toastify";
import Swal from "sweetalert2";

interface AddToCart {
    userId: string;
    productId: string;
    quantity: number;
    isFavourite: boolean;
}

export const addToCart = async ({
                                    userId,
                                    productId,
                                    quantity,
                                    isFavourite,
                                    router,
                                }: AddToCart & { router: any }) => {
    if (!userId) {
        Swal.fire({
            title: "Please Log In",
            text: "You must be logged in to add products to your cart.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Go to Log In Page",
        }).then((result) => {
            if (result.isConfirmed) {
                router.push("/Signin");
            }
        });
        return;
    }

    try {
        const response = await fetch("/api/addtocart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({userId, productId, quantity, isFavourite}),
        });

        const data = await response.json();

        if (response.status === 401 && data.redirect) {
            toast.warning(data.message, {
                onClose: () => {
                    window.location.href = data.redirect;
                },
            });
        } else if (response.ok) {
            toast.success(data.message);
            console.log("toast her ya rouuuuuuuuuuuuuuuuf", data.message);
        } else {
            toast.error(data.message || "Could not add to cart");
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("An error occurred while adding to the cart.");
    }
};
