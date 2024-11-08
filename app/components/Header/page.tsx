"use client";
import React, { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CiMenuBurger } from "react-icons/ci";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
  isFavourite: boolean;
  quantity: number;
}

type Anchor = "right";

// Navigation items constant
const NAV_ITEMS = ["Home", "Shop", "Product", "Contact Us"] as const;
type NavItem = (typeof NAV_ITEMS)[number];

// Route mapping
const ROUTES: Record<NavItem, string> = {
  Home: "/pages/Home",
  Shop: "/pages/Shop",
  Product: "/pages/Product",
  "Contact Us": "/pages/ContactUs",
};

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeItem, setActiveItem] = useState<NavItem>("Home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  // Access user ID directly from the session
  const userId = session?.user?.id;

  useEffect(() => {
    if (userId) {
      fetchCartDetails();
    }
  }, [userId]);

  const fetchCartDetails = async () => {
    try {
      const response = await fetch(`/api/addtocart?userId=${userId}`);
      const data = await response.json();

      if (response.ok && Array.isArray(data.cartItems)) {
        const formattedData = data.cartItems.map((item: any) => ({
          id: item.productId.toString(),
          image: item.productImage,
          name: item.productName,
          price: item.productPrice,
          isFavourite: item.isFavourite,
          quantity: item.quantity || 0,
        }));
        setCartItems(formattedData);
      } else {
        console.error("Error fetching cart details:", data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  // Function to trigger auto-save to the database after a delay
  const autoSave = async () => {
    if (userId) {
      try {
        // Loop through the cartItems array and send each item as a separate request
        for (const item of cartItems) {
          const response = await fetch("/api/addtocart", {
            method: "PUT", // Use PUT to update the existing cart
            body: JSON.stringify({
              userId,
              productId: item.id, // Map id to productId
              quantity: item.quantity,
              isFavourite: item.isFavourite,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!response.ok) {
            console.error("Error saving cart item:", await response.text());
          }
        }
      } catch (error) {
        console.error("Error during auto-save:", error);
      }
    }

  };

  // Increment quantity for a specific product
  const increment = (productId: string) => {
    console.log("Incrementing item with id:", productId);
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      // Clear any existing timeout before setting a new one
      if (timeoutId) clearTimeout(timeoutId);

      // Set a new timeout to trigger auto-save after 2 seconds of no changes
      const newTimeoutId = setTimeout(() => autoSave(), 2000);
      setTimeoutId(newTimeoutId);

      return updatedItems;
    });
  };

  // Decrement quantity for a specific product
  const decrement = (productId: string) => {
    console.log("Decrementing item with id:", productId);
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );

      // Clear any existing timeout before setting a new one
      if (timeoutId) clearTimeout(timeoutId);

      // Set a new timeout to trigger auto-save after 2 seconds of no changes
      const newTimeoutId = setTimeout(() => autoSave(), 2000);
      setTimeoutId(newTimeoutId);

      return updatedItems;
    });
  };




  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setIsOpen(open);
    };

  const list = () => (
    <Box
      sx={{ width: 350 }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding className="block">
          <Typography component="div" className="pl-4 pt-3 text-2xl">
            Cart
          </Typography>
          {cartItems.map((item) => (
            <Typography component="div" className="pl-4 pt-9 text-2xl" key={item.id}>
              <div className="relative flex items-center space-x-6 p-4 bg-gray-50 rounded-md shadow-md">
                <div>
                  <img
                    src={item.image || "default_image_path"}
                    alt="img"
                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                  />
                </div>
                <div className="flex flex-col flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-semibold text-gray-800">{item.name || "Product"}</p>
                    <div className="absolute top-2 right-0 p-2 text-right text-base flex flex-col items-end">
                      <p className="text-gray-800 font-semibold">${item.price || "0.00"}</p>
                      <IoMdClose className="text-lg text-gray-600 cursor-pointer" />
                    </div>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                    <button
                      onClick={() => decrement(item.id)}
                      className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="text-base font-medium text-gray-800">{item.quantity}</span>
                    <button
                      onClick={() => increment(item.id)}
                      className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="absolute top-3 right-20 p-2 text-right text-base flex flex-col items-end">
                  {item.isFavourite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                </div>
              </div>
            </Typography>
          ))}
        </ListItem>
      </List>
    </Box>
  );

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item);
    router.push(ROUTES[item]);
    setSidebarOpen(false);
  };

  const toggleSidebar = (open: boolean) => () => {
    setSidebarOpen(open);
  };

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (session) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push("/Signin");
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    router.push("/pages/UserAccount");
    handleClose();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Logged Out Done",
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/pages/Home");
    handleClose();
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => setSidebarOpen(false)}>
            <ListItemText primary="3𝓵𝓮𝓰𝓪𝓷𝓽" />
            <IoMdClose className="text-xl ml-2 text-gray-500" />
          </ListItemButton>
        </ListItem>
      </List>

      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: 230,
          m: "0 10px",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search"
          inputProps={{ "aria-label": "search" }}
        />
        <IconButton type="button" sx={{ p: "1px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      <List>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton onClick={() => handleItemClick(item)}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ position: "fixed", bottom: 20, width: 250 }}>
        <Button
          sx={{ width: "90%", mx: "5%" }}
          variant="contained"
          className="bg-black hover:bg-gray-800"
          onClick={() => router.push("/Signin")}
        >
          Sign in
        </Button>
      </Box>
    </Box>
  );

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-[90%] mx-auto mt-11 text-3xl">
      {/* Desktop Navigation */}
      <h1 className="cursor-pointer hidden md:block">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        <ul className="flex space-x-9 text-gray-600">
          {NAV_ITEMS.map((item) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer transition-colors duration-200 hover:text-black md:text-base
              ${activeItem === item ? "text-black font-medium" : ""}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Header */}
      <div className="flex items-center justify-between w-full md:hidden mt-4">
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 focus:outline-none hover:text-black transition-colors duration-200"
            onClick={toggleSidebar(true)}
          >
            <CiMenuBurger />
          </button>
          <h1 className="cursor-pointer text-3xl">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>
        </div>
        <IoCartOutline className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200" />
      </div>

      {/* Mobile Sidebar */}
      <div className="relative md:hidden ">
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar(false)}
        >
          {DrawerList}
        </Drawer>
      </div>

      {/* Desktop-only Icons */}
      <div className="hidden md:flex items-center space-x-7 mt-4">
        <div>
          <CiSearch className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200" />
        </div>

        <div>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <FaRegCircleUser className="text-gray-800 cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200" />
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            {session && (
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            )}
          </Menu>
        </div>

        <div>
          <Button onClick={toggleDrawer(true)} className="text-black">
            <Badge badgeContent={totalItems} color="primary">
              <IoCartOutline className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200" />
            </Badge>
          </Button>
          <Drawer anchor="right" open={isOpen} onClose={toggleDrawer(false)}>
            {list()}
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header;
