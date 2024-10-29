import React from 'react'
import Link from 'next/link'

const Newsletter = () => {
    return (
        <div className="mt-24 relative">
            <img
                src="/images/Newsletter/Paste image (1).jpg"
                className="w-full"
                alt="Join Our Newsletter"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center  ">
                <h1 className="text-2xl font-bold">Join Our Newsletter</h1>
                <p className="mt-6 text-center">
                    <Link href="/Signup" className="font-bold text-yellow-400">
                        <u>Sign up</u>
                    </Link>{" "}
                    for deals, new products, and promotions
                </p>
            </div>
        </div>
    )
}

export default Newsletter 