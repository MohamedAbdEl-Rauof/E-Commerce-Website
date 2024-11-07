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
  image: string;
  name: string;
  price: number;
  isFavourite: boolean;
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

const Header = ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [activeItem, setActiveItem] = useState<NavItem>("Home");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/addtocart?userId=${userId}&productId=${productId}`
        );
        const data = await response.json();
        
        if (response.ok) {
          setProduct({
            image: data.image,
            name: data.name,
            price: data.price,
            isFavourite: data.isFavourite,
          });
        } else {
          console.error("Error fetching product details:", data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchProductDetails();
  }, [userId, productId]);

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  
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
        {[""].map((text) => (
          <ListItem key={text} disablePadding className="block">
            <Typography component="div" className="pl-4 pt-3 text-2xl">
              Cart
            </Typography>
            <Typography component="div" className="pl-4 pt-9 text-2xl">
              <div className="relative flex items-center space-x-6 p-4 bg-gray-50 rounded-md shadow-md">
                {/* Image Section */}
                <div>
                  <img
                    src="path_to_image"
                    alt="img"
                    className="w-16 h-16 object-cover rounded-md border border-gray-300"
                  />
                </div>

                {/* Counter and Description Section */}
                <div className="flex flex-col flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-semibold text-gray-800">
                      Product
                    </p>
                    {/* Top Right - Price and Close Section */}
                    <div className="absolute top-2 right-0 p-2 text-right text-base flex flex-col items-end">
                      <p className="text-gray-800 font-semibold">$19.19</p>
                      <IoMdClose className="text-lg text-gray-600 cursor-pointer" />
                    </div>
                  </div>

                  {/* Counter Section */}
                  <div className="flex items-center border border-gray-300 rounded-md bg-white w-20">
                    <button
                      onClick={decrement}
                      className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-l-md"
                    >
                      -
                    </button>
                    <span className="text-base font-medium text-gray-800">
                      {count}
                    </span>
                    <button
                      onClick={increment}
                      className="text-lg font-bold text-gray-700 px-3 py-1 hover:bg-gray-200 rounded-r-md"
                    >
                      +
                    </button>
                  </div>
                </div>
                {/* Hear icon */}
                <div className="absolute top-3 right-20 p-2 text-right text-base flex flex-col items-end">
                  <FaHeart className="text-red-500" />
                  <FaRegHeart />
                </div>
              </div>
            </Typography>
          </ListItem>
        ))}
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
            <Badge badgeContent={3} color="primary">
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
