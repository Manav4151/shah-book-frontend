// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useTheme } from "next-themes";
// import { Button } from "./ui/button";
// import { BookOpen, Home, Mail, FileText, Menu, X, LogOut, Building, Sun, Moon } from "lucide-react";
// import { useAuth } from "./auth-context";
// import { admin } from "better-auth/plugins/admin";
// import { ROLES } from "@/lib/role";


// export default function Navbar() {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const pathname = usePathname();
//   const { session, logout } = useAuth();
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);


//   useEffect(() => {
//     setMounted(true);
//   }, []);


//   const isAuthPage = pathname.startsWith('/login') ||
//     pathname.startsWith('/signup') ||
//     pathname.startsWith('/forget-password') ||
//     pathname.startsWith('/reset-password') ||
//     pathname.startsWith('/admin');

//   if (isAuthPage) {
//     return null;
//   }
//   // Check if the user has the 'ADMIN' role
//   const isAdmin = ROLES.ADMIN;
//   console.log("isadmin", isAdmin);

//   const navigation = [
//     { name: "Home", href: "/", icon: Home, adminOnly: false },
//     { name: "Books", href: "/books", icon: BookOpen, adminOnly: false },
//     { name: "Emails", href: "/emails", icon: Mail, adminOnly: false },
//     { name: "Quotation", href: "/quotation", icon: FileText, adminOnly: false },
//     { name: "Management", href: "/management", icon: Building, adminOnly: false },
//   ];
//   // Filter the navigation items based on the user's role
//   const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);
//   const isActive = (href: string) => {
//     if (href === "/") {
//       return pathname === "/";
//     }
//     return pathname.startsWith(href);
//   };

//   const handleSignOut = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   return (
//     <nav className="bg-[var(--background)] shadow-lg border-b border-[var(--border)]">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link href="/" className="flex items-center space-x-2">
//               <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center">
//                 <BookOpen className="w-5 h-5 text-white" />
//               </div>
//               <span className="text-xl font-bold text-[var(--foreground)]">BookManager</span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             {filteredNavigation.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(item.href)
//                     ? "text-[var(--primary)] bg-[var(--muted)]"
//                     : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)]"
//                     }`}
//                 >
//                   <Icon className="w-4 h-4" />
//                   <span>{item.name}</span>
//                 </Link>
//               );
//             })}
//           </div>


//           <div className="hidden md:flex items-center space-x-4">
      
//             {mounted && (
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//                 className="flex items-center space-x-2"
//               >
//                 {theme === "dark" ? (
//                   <Sun className="w-4 h-4" />
//                 ) : (
//                   <Moon className="w-4 h-4" />
//                 )}
//               </Button>
//             )}
//             {session ? (
//               <div className="flex items-center space-x-3">
//                 <span className="text-sm text-[var(--muted-foreground)]">
//                   Welcome, {session.user.name || session.user.email}
//                 </span>
//                 <Button
//                   onClick={handleSignOut}
//                   variant="outline"
//                   size="sm"
//                   className="flex items-center space-x-2"
//                 >
//                   <LogOut className="w-4 h-4" />
//                   <span>Sign Out</span>
//                 </Button>
//               </div>
//             ) : (
//               <div className="flex items-center space-x-2">
//                 <Link href="/login">
//                   <Button variant="outline" size="sm">
//                     Sign In
//                   </Button>
//                 </Link>
//                 <Link href="/signup">
//                   <Button size="sm" className="bg-[var(--primary)] hover:opacity-90">
//                     Sign Up
//                   </Button>
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//               className="p-2"
//             >
//               {isMobileMenuOpen ? (
//                 <X className="w-6 h-6" />
//               ) : (
//                 <Menu className="w-6 h-6" />
//               )}
//             </Button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden border-t border-[var(--border)] py-4">
//             <div className="space-y-2">
//               {navigation.map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <Link
//                     key={item.name}
//                     href={item.href}
//                     onClick={() => setIsMobileMenuOpen(false)}
//                     className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActive(item.href)
//                       ? "text-[var(--primary)] bg-[var(--muted)]"
//                       : "text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--muted)]"
//                       }`}
//                   >
//                     <Icon className="w-5 h-5" />
//                     <span>{item.name}</span>
//                   </Link>
//                 );
//               })}
//             </div>

//             {/* Mobile User Menu */}
//             <div className="mt-4 pt-4 border-t border-[var(--border)]">
//               {mounted && (
//                 <div className="mb-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setTheme(theme === "dark" ? "light" : "dark");
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="w-full flex items-center justify-center space-x-2"
//                   >
//                     {theme === "dark" ? (
//                       <>
//                         <Sun className="w-4 h-4" />
//                         <span>Light Mode</span>
//                       </>
//                     ) : (
//                       <>
//                         <Moon className="w-4 h-4" />
//                         <span>Dark Mode</span>
//                       </>
//                     )}
//                   </Button>
//                 </div>
//               )}
//               {session ? (
//                 <div className="space-y-2">
//                   <div className="px-3 py-2 text-sm text-[var(--muted-foreground)]">
//                     Welcome, {session.user.name || session.user.email}
//                   </div>
//                   <Button
//                     onClick={handleSignOut}
//                     variant="outline"
//                     size="sm"
//                     className="w-full flex items-center justify-center space-x-2"
//                   >
//                     <LogOut className="w-4 h-4" />
//                     <span>Sign Out</span>
//                   </Button>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
//                     <Button variant="outline" size="sm" className="w-full">
//                       Sign In
//                     </Button>
//                   </Link>
//                   <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
//                     <Button size="sm" className="w-full bg-[var(--primary)] hover:opacity-90">
//                       Sign Up
//                     </Button>
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { 
  BookOpen, 
  Home, 
  Mail, 
  FileText, 
  Menu, 
  X, 
  ShieldCheck, 
  Users, 
  Sun, 
  Moon,
  LayoutDashboard,
  UserCircle
} from "lucide-react";
import { useAuth } from "./auth-context";
import { ROLES } from "@/lib/role";

const NAV_ITEMS = [
  { 
    name: "Overview", 
    href: "/", 
    icon: Home, 
    roles: ["all"],
    requiresAssignment: false 
  },
  { 
    name: "Inventory", 
    href: "/books", 
    icon: BookOpen, 
    roles: ["inventory_manager", "sales_executive" , "agent_admin"],
    requiresAssignment: true 
  },
  { 
    name: "Emails", 
    href: "/emails", 
    icon: Mail, 
    roles: ["inventory_manager", "sales_executive" , "agent_admin"],
    requiresAssignment: true
  },
  { 
    name: "Quotes", 
    href: "/quotation", 
    icon: FileText, 
    roles: ["inventory_manager", "sales_executive" , "agent_admin"],
    requiresAssignment: true
  },
  {
    name: "Management",
    href: "/management",
    icon: LayoutDashboard,
    roles: ["inventory_manager", "sales_executive" , "agent_admin"],
    requiresAssignment: true
  },
  { 
    name: "Agents", 
    href: "/agents", 
    icon: ShieldCheck, 
    roles: ["system_admin"],
    requiresAssignment: true
  },
  { 
    name: "Users", 
    href: "/admin/users", 
    icon: Users, 
    roles: ["system_admin"],
    requiresAssignment: true
  },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { session, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const userRole = session?.user?.role || "guest";
  const isUnassigned = userRole === ROLES.USER; // "user" role = Unassigned

  // Filter Navigation Items
  const visibleNavItems = NAV_ITEMS.filter((item) => {
    if (!session) return false; 
    const roleAllowed = item.roles.includes("all") || item.roles.includes(userRole);
    if (item.requiresAssignment && isUnassigned) return false;
    return roleAllowed;
  });

  const isActive = (href: string) => pathname === href;

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  if (isAuthPage) return null;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* --- LEFT: Logo --- */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] shadow-sm transition-transform group-hover:scale-105">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="hidden font-bold text-lg tracking-tight sm:inline-block text-[var(--foreground)]">
                BookManager
              </span>
            </Link>
          </div>

          {/* --- CENTER: Desktop Nav Links --- */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all
                    ${active 
                      ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-sm" 
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-[var(--primary)]" : ""}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* --- RIGHT: Actions & User --- */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 text-[var(--muted-foreground)]"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            )}

            <div className="h-6 w-px bg-[var(--border)]" />

            {session ? (
              <div className="flex items-center gap-4">
                {/* User Info: Name & Email */}
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-[var(--foreground)] leading-none">
                    {session.user.name}
                  </span>
                  <span className="text-xs text-[var(--muted-foreground)] mt-1">
                    {session.user.email}
                  </span>
                </div>

                {/* Explicit Sign Out Button */}
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="border-[var(--border)] hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/10 dark:hover:border-red-900/50 transition-colors"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* --- MOBILE: Toggle --- */}
          <div className="flex items-center md:hidden gap-4">
             <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]">
          <div className="space-y-1 p-4">
            {session && (
               <div className="mb-4 flex items-center gap-3 rounded-lg border border-[var(--border)] p-3 bg-[var(--muted)]/30">
                 <div className="h-10 w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <UserCircle className="h-6 w-6" />
                 </div>
                 <div className="overflow-hidden">
                   <p className="font-medium truncate">{session.user.name}</p>
                   <p className="text-xs text-[var(--muted-foreground)] truncate">
                     {session.user.email}
                   </p>
                 </div>
               </div>
            )}

            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors
                    ${isActive(item.href)
                      ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
            
            <div className="my-4 h-px bg-[var(--border)]" />
            
            {session ? (
              <Button 
                onClick={handleSignOut} 
                variant="outline" 
                className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/10"
              >
                Sign Out
              </Button>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}