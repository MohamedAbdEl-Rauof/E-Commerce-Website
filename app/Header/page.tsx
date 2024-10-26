'use client';
import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoCartOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation';



const Header = () => {

    const router = useRouter();
    const [activeItem, setActiveItem] = useState<string>('Home');

    const handleItemClick = (item: string) => {
        setActiveItem(item);

        const routes: { [key: string]: string } = {
            Home: '/',
            Shop: '/shop',
            Product: '/product',
            'Contact Us': '/contact',
        };

        router.push(routes[item]);
    };

    return (
        <div>
            <header className='flex justify-between w-[90%] mx-auto mt-11 text-3xl'>
                <h1 className='cursor-pointer'>3𝓵𝓮𝓰𝓪𝓷𝓽</h1>
                <nav className="flex">
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
                <div className='flex space-x-7'>
                    <CiSearch className='cursor-pointer' />
                    <FaRegCircleUser className='cursor-pointer' />
                    <IoCartOutline className='cursor-pointer' />
                </div>
            </header>
        </div>
    );
};

export default Header;
