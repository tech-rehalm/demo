'use client'
import { X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'

import Link from 'next/link'
import { useState } from 'react'
const Menu = () => {
  const [open, setOpen] = useState(true)

  const signoutHandler = () => {
    signOut({ callbackUrl: '/signin' })
  }

  const { data: session } = useSession()


  const handleClick = () => {
    ;(document.activeElement as HTMLElement).blur()
  }

  return (
    <>
      <div className=' p-2 fixed top-0 right-0 flex flex-col md:flex-row backdrop-blur-lg md:bg-transparent'>
        {open ? (
          <button onClick={()=> setOpen(false)} className="btn md:hidden text-lg btn-success">
             <X/>
          </button>
        ) : (
         
              <button className='md:hidden btn btn-success' onClick={()=> setOpen(true)}> 
                 <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
              </button>
             
           
        )}
        {open &&
        <ul className="flex flex-col md:flex-row   w-[160px] md:w-full h-screen md:h-[48px] items-center " >
          <Link href="/rooms" className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'>Find Rooms</Link>
          <Link href="/about" className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'>About Us</Link>
          <Link href="/contact" className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'>Contact</Link>
          {session && session.user ? (
            <>
              <li>
              <Link href={`/bookings/${session.user._id}`} className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'> My Bookings</Link>
                <div className="dropdown dropdown-bottom dropdown-end">
                  <label tabIndex={0} className="btn btn-success rounded-btn w-full m-2">
                    {session.user.name}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu text-success dropdown-content z-[1] p-2 shadow bg-base-300 rounded-box w-52 "
                  >
                    {session.user.role === "admin" && (
                      <li onClick={handleClick}>
                        <Link href="/admin/">Admin Dashboard</Link>
                      </li>
                    )}

                    <li onClick={handleClick}>
                      <Link href="/order-history">Order history </Link>
                    </li>
                    <li onClick={handleClick}>
                      <Link href="/profile">Profile</Link>
                    </li>
                    <li onClick={handleClick}>
                      <button type="button" onClick={signoutHandler}>
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
            </>
          ) : (
            <>
                  <Link href="/register" className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'>Register</Link>
                  <Link href="/signin" className='p-3 transition duration-500 hover:text-success hover:scale-125 hover:bg-gray-800 rounded-lg md:mx-3'>Sign In</Link>

            </>
          )}
        </ul>}
      </div>
    </>
  )
}

export default Menu
