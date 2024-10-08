import Link from 'next/link'
import React from 'react'
import Menu from './Menu'

const Header = () => {
  return (
    <header className='fixed top-0 w-full z-50'>
      <nav>
        <div className="navbar justify-between bg-base-300">
          <div>
            <Link href="/" className="btn btn-ghost text-lg">
              Deby Hotel
            </Link>
          </div>

          <Menu />
        </div>
      </nav>
    </header>
  )
}

export default Header
