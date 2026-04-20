'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, Menu, User, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useSession, signOut } from 'next-auth/react';


export function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileEditLink, setProfileEditLink] = useState('profile/edit');
  const [userType, setUserType] = useState<'student' | 'author'>('student');
  const [wpUser, setWpUser] = useState<string | null>(null);
  const MooruLogo = () => (
    <div className="flex items-center gap-2">
      {/* ICON */}
      <svg
        width="32"
        height="32"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#01696f]"
      >
        {/* Book Shape */}
        <path
          d="M6 10C6 8.9 6.9 8 8 8H20C23 8 24 10 24 10V40C24 40 23 38 20 38H8C6.9 38 6 37.1 6 36V10Z"
          fill="currentColor"
          opacity="0.9"
        />
        <path
          d="M42 10C42 8.9 41.1 8 40 8H28C25 8 24 10 24 10V40C24 40 25 38 28 38H40C41.1 38 42 37.1 42 36V10Z"
          fill="currentColor"
          opacity="0.7"
        />
  
        {/* Center "M" Shape */}
        <path
          d="M16 28L20 20L24 26L28 20L32 28"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
  
      {/* TEXT */}
      <div className="flex flex-col leading-tight">
        <span className="text-xl font-semibold tracking-tight">
          Guroos
        </span>
        <span className="text-xs text-gray-500">
          Read. Listen. Watch. Ask
        </span>
      </div>
    </div>
  );

  const GuroosLogo = () => (
    <div className="flex items-center gap-3">
  
      {/* ICON */}
      <div className="w-[42px] h-[42px] rounded-xl bg-[#01696f] flex items-center justify-center shadow-sm">
        <span className="text-white text-[20px] font-bold leading-none">
          G
        </span>
      </div>
  
      {/* TEXT */}
      <div className="flex flex-col leading-tight">
        <span className="text-[20px] font-semibold tracking-tight text-[#1f2937]">
          Guroos
        </span>
        <span className="text-xs text-[#6e6a63]">
          Read. Listen. Watch. Asks
        </span>
      </div>
  
    </div>
  );

  useEffect(() => {
    if (session?.wpToken) {
      localStorage.setItem('wpToken', session.wpToken);
      localStorage.setItem('wpUser', session.user?.name || '');
    }

    const token = localStorage.getItem('wpToken');
    const user = localStorage.getItem('wpUser');
    const profiledata = localStorage.getItem('wpUserdata');

    setWpUser(user);

    if (profiledata) {
      try {
        const profile = JSON.parse(profiledata);
        if (profile.role === 'author') {
          setUserType('author');
          setProfileEditLink('apply');
        } else {
          setUserType('student');
          setProfileEditLink('profile/edit');
        }
      } catch (e) {
        console.error('Invalid wpUserdata JSON', e);
      }
    }

    setIsLoggedIn(!!(token || session));
  }, [session, status]);

  const handleLogout = async () => {
    localStorage.removeItem('wpToken');
    localStorage.removeItem('wpUser');
    localStorage.removeItem('wpUserdata');

    await signOut({ callbackUrl: '/auth/user/login' });

    setIsLoggedIn(false);
    toast.success('You have been logged out successfully');
    router.push('/auth/user/login');
  };

  return (
    <header className="bg-[#f8f7f4]/80 backdrop-blur border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1120px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
<GuroosLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/search"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Find Experts
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-black transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth / User menu */}
            {!isLoggedIn ? (
              // 👉 only desktop
              <div className="hidden md:flex items-center space-x-5">

  <Link href="/auth/author/register">
    <button className="text-gray-700 hover:text-black text-sm">
      Join as an expert
    </button>
  </Link>

  {/* 👇 ADD THIS */}
  <Link href="/auth/user/login">
    <button className="text-gray-600 hover:text-black text-sm">
      Log in
    </button>
  </Link>

  <Link href="/auth/user/register">
    <button className="bg-[#01696f] hover:bg-[#0c4e54] text-white rounded-full px-5 py-2 text-sm">
      Book an expert
    </button>
  </Link>

</div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  {/* Mobile e শুধু icon, md+ e icon + name */}
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-0 md:mr-2" />
                    <span className="hidden md:inline-block">
                      {session?.user?.name || wpUser || 'Account'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/dashboard/${userType}`}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${profileEditLink}`}>
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  {userType === 'author' && (
  <DropdownMenuItem asChild>
    <Link href="/books">
      <BookOpen className="h-4 w-4 mr-2" />
      Manage Books
    </Link>
  </DropdownMenuItem>
)}
                  <DropdownMenuItem asChild>
                    <Link href="/messages">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/bookings">
                      <Calendar className="h-4 w-4 mr-2" />
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-600 focus:text-red-600"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu (nav + auth) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* Auth options for mobile */}
                {!isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/user/login">Login</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/user/register">Sign Up as Student</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/author/register">Sign Up as Author</Link>
                    </DropdownMenuItem>
                    <div className="border-t my-1" />
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${userType}`}>Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/${profileEditLink}`}>Edit Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/messages">Messages</Link>
                    </DropdownMenuItem>
                    {userType === 'author' && (
  <DropdownMenuItem asChild>
    <Link href="/books">Manage Books</Link>
  </DropdownMenuItem>
)}

                    <DropdownMenuItem asChild>
                      <Link href="/bookings">Bookings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 focus:text-red-600"
                    >
                      Logout
                    </DropdownMenuItem>
                    <div className="border-t my-1" />
                  </>
                )}

                {/* Common nav links */}
                <DropdownMenuItem asChild>
                  <Link href="/search">Find Authors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about">About</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/blogs">Blogs</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/contact">Contact</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
