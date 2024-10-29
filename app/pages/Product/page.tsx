import React from 'react'

const Product = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-roboto">
            <h1 className="text-5xl font-bold mb-4">Product Page will be up soon...</h1>
            <p className="text-xl text-gray-400">approximately</p>
            <div className="flex flex-col items-center mt-6">
                <div className="text-lg text-gray-500">
                    Expected Date: <span className="font-semibold text-white">Mon Nov 12 2024</span>
                    <p>انت صدقت يا اسطا ولا ايه 😂 </p>
                    <p>قول يا مسهل</p>
                </div>
                <div className="mt-10 bg-white p-4 rounded-full">
                    <img src="https://react-coming-soon.maksv.me/web-development.svg" alt="Web Development" className="w-48 h-48 object-contain" />
                </div>
            </div>
        </div>
    );
}

export default Product