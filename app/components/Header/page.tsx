"use client";
import React, { useState } from 'react';
import { CiSearch } from 'react-icons/ci';
import { FaRegCircleUser } from 'react-icons/fa6';
import { IoCartOutline } from 'react-icons/io5';
import { CiMenuBurger } from 'react-icons/ci';
import { IoMdClose } from 'react-icons/io';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  InputBase,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Badge,
  TextField,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import { useCart } from '../../pages/context/CartSideBar';
import CartDrawer from '../../pages/CartDrawer/page';

const NAV_ITEMS = ['Home', 'Shop', 'Categories', 'Contact Us'] as const;
type NavItem = (typeof NAV_ITEMS)[number];

const ROUTES: Record<NavItem, string> = {
  Home: '/',
  Shop: '/pages/Shop',
  Categories: '/pages/Categories',
  'Contact Us': '/pages/ContactUs',
};

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const { cartItems, isOpen, openCart, closeCart } = useCart();
  const [activeItem, setActiveItem] = useState<NavItem>('Home');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleItemClick = (item: NavItem) => {
    setActiveItem(item);
    router.push(ROUTES[item]);
    setSidebarOpen(false);
  };

  const toggleSidebar = (open: boolean) => () => {
    setSidebarOpen(open);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (session) {
      setAnchorEl(event.currentTarget);
    } else {
      router.push('/Signin');
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMyAccount = () => {
    router.push('/pages/UserAccount');
    handleClose();
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Logged Out Done',
      showConfirmButton: false,
      timer: 1500,
    });
    router.push('/pages/Home');
    handleClose();

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  };

  const toggleInputVisibility = () => {
    setIsInputVisible(!isInputVisible);
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center w-[90%] mx-auto mt-11 text-3xl">
      <Link href="/">
        <h1 className="cursor-pointer hidden md:block">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>
      </Link>

      <nav className="hidden md:flex">
        <ul className="flex space-x-9 text-gray-600">
          {NAV_ITEMS.map((item) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              className={`cursor-pointer transition-colors duration-200 hover:text-black md:text-base
              ${activeItem === item ? 'text-black font-medium' : ''}`}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>

      <div className="flex items-center justify-between w-full md:hidden mt-4">
        <div className="flex items-center space-x-4">
          <button
            className="text-gray-600 focus:outline-none hover:text-black transition-colors duration-200"
            onClick={toggleSidebar(true)}
          >
            <CiMenuBurger />
          </button>
          <Link href="/">
            <h1 className="cursor-pointer hidden md:block">3𝓵𝓮𝓰𝓪𝓷𝓽</h1>
          </Link>
        </div>
        <IoCartOutline
          className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200"
          onClick={openCart}
        />
      </div>

      <div className="relative md:hidden">
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={toggleSidebar(false)}
        >
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
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 230,
                m: '0 10px',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
              />
              <IconButton type="button" sx={{ p: '1px' }} aria-label="search">
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

            <Box sx={{ position: 'fixed', bottom: 20, width: 250 }}>
              {session?.user?.id ? (
                <div className="flex items-center space-x-4 p-2">
                  <Button
                    sx={{
                      width: '150px',
                      height: '40px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                    }}
                    variant="contained"
                    className="bg-black hover:bg-gray-800"
                    onClick={() => router.push('/pages/UserAccount')}
                  >
                    My Account
                  </Button>
                  <Button
                    sx={{
                      width: '150px',
                      height: '40px',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      fontSize: '0.8rem',
                    }}
                    variant="contained"
                    className="bg-red-500 hover:bg-red-700"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  sx={{ width: '90%', mx: '5%' }}
                  variant="contained"
                  className="bg-black hover:bg-gray-800"
                  onClick={() => router.push('/Signin')}
                >
                  Sign in
                </Button>
              )}
            </Box>
          </Box>
        </Drawer>
      </div>

      <div className="hidden md:flex items-center space-x-7 mt-4">
        <div className="relative flex items-center">
          <div
            className={`absolute top-0 right-10 transition-all duration-300 ${isInputVisible ? 'w-40 opacity-100' : 'w-0 opacity-0'
              }`}
            style={{ pointerEvents: isInputVisible ? 'auto' : 'none' }}
          >
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              size="small"
              className="h-8"
            />
          </div>
          <CiSearch
            className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200"
            onClick={toggleInputVisibility}
          />
        </div>

        <div>
          <Button
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
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
              'aria-labelledby': 'basic-button',
            }}
          >
            {session && (
              <>
                <MenuItem onClick={handleMyAccount}>My Account</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </>
            )}
          </Menu>
        </div>

        <div>
          <Button onClick={openCart} className="text-black">
            <Badge badgeContent={totalItems} color="primary">
              <IoCartOutline className="cursor-pointer text-2xl hover:text-gray-800 transition-colors duration-200" />
            </Badge>
          </Button>
          <Drawer anchor="right" open={isOpen} onClose={closeCart}>
            <CartDrawer />
          </Drawer>
        </div>
      </div>
    </header>
  );
};

export default Header;