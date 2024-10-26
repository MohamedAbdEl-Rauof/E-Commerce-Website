'use client';
import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io"; // Import the close icon
import { useRouter } from 'next/navigation';
import { CiMenuBurger } from "react-icons/ci";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button'

const Header = () => {
    const router = useRouter();
    const [activeItem, setActiveItem] = useState<string>('Home');
    const [isSidebarOpen, setSidebarOpen] = useState(false); // State for sidebar visibility

    const handleItemClick = (item: string) => {
        setActiveItem(item);

        const routes: { [key: string]: string } = {
            Home: '/',
            Shop: '/shop',
            Product: '/product',
            'Contact Us': '/contact',
        };

        router.push(routes[item]);
        setSidebarOpen(false); // Close sidebar after selection
    };

    const toggleSidebar = (open: boolean) => () => {
        setSidebarOpen(open);
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
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 230 }}
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
                {['Home', 'Shop', 'Product', 'Contact Us'].map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton onClick={() => handleItemClick(item)}>
                            <ListItemText primary={item} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Sign In Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 30 }}>
                <Button
                    sx={{ width: '90%' }}
                    variant="contained"
                    className='bg-black'

                    onClick={() => router.push('/Signin')}
                >
                    Sign in
                </Button>
            </Box>
        </Box>


    );

    return (
        <div>
            <header className='flex flex-col md:flex-row justify-between items-center w-[90%] mx-auto mt-11 text-3xl'>
                <h1 className='cursor-pointer'>3𝓵𝓮𝓰𝓪𝓷𝓽</h1>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex">
                    <ul className="flex space-x-9 text-gray-600">
                        {['Home', 'Shop', 'Product', 'Contact Us'].map((item) => (
                            <li
                                key={item}
                                onClick={() => handleItemClick(item)}
                                className={`cursor-pointer ${activeItem === item ? 'text-black font-medium' : ''}`}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Mobile Sidebar */}
                <div className="relative md:hidden">
                    <button
                        className="text-gray-600 focus:outline-none"
                        onClick={toggleSidebar(true)}
                    >
                        <CiMenuBurger />
                    </button>

                    {/* Drawer Component */}
                    <Drawer
                        anchor="left"
                        open={isSidebarOpen}
                        onClose={toggleSidebar(false)}
                    >
                        {DrawerList}
                    </Drawer>
                </div>

                {/* Icons Section */}
                <div className='flex space-x-7 mt-4 md:mt-0 '>
                    <CiSearch className='cursor-pointer text-2xl' />
                    <FaRegCircleUser className='cursor-pointer text-2xl' />
                    <IoCartOutline className='cursor-pointer text-2xl' />
                </div>
            </header>
        </div>
    );
};

export default Header;
