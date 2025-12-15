// "use client";

// import { useAuth } from "@/components/auth-context";
// import { Button } from "@/components/ui/button";
// import { BookOpen, Mail, FileText, BarChart3, Users, Database } from "lucide-react";
// import Link from "next/link";

// export default function HomePage() {
//   const { session } = useAuth();

//   const features = [
//     {
//       icon: BookOpen,
//       title: "Book Management",
//       description: "Comprehensive book inventory with ISBN validation, pricing, and detailed information tracking.",
//       href: "/books",
//       color: "from-blue-500 to-blue-600"
//     },
//     {
//       icon: Mail,
//       title: "Email System",
//       description: "Manage communications and notifications with integrated email functionality.",
//       href: "/emails",
//       color: "from-green-500 to-green-600"
//     },
//     {
//       icon: FileText,
//       title: "Quotations",
//       description: "Generate and manage quotations for book sales and services.",
//       href: "/quotation",
//       color: "from-purple-500 to-purple-600"
//     }
//   ];

//   const stats = [
//     { label: "Total Books", value: "1,234", icon: BookOpen },
//     { label: "Active Users", value: "45", icon: Users },
//     { label: "Data Records", value: "5,678", icon: Database },
//     { label: "Reports", value: "12", icon: BarChart3 }
//   ];

//   return (
//     <div className="min-h-screen bg-[var(--background)]">
//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center">
//           <div className="w-20 h-20 bg-[var(--primary)] rounded-3xl flex items-center justify-center mx-auto mb-6">
//             <BookOpen className="w-10 h-10 text-white" />
//           </div>

//           <h1 className="text-4xl md:text-6xl font-bold text-[var(--foreground)] mb-6">
//             Welcome to{" "}
//             <span className="text-[var(--primary)]">
//               BookManager
//             </span>
//           </h1>

//           <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-3xl mx-auto">
//             A comprehensive book management system designed to streamline your inventory,
//             track pricing, and manage your book collection with ease.
//           </p>

//           {session ? (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/books">
//                 <Button size="lg" className="bg-[var(--primary)] hover:opacity-90 text-white px-8 py-3 text-lg">
//                   <BookOpen className="w-5 h-5 mr-2" />
//                   Manage Books
//                 </Button>
//               </Link>
//               <Link href="/books/insert">
//                 <Button size="lg" variant="outline" className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)] px-8 py-3 text-lg">
//                   Add New Book
//                 </Button>
//               </Link>
//             </div>
//           ) : (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/login">
//                 <Button size="lg" className="bg-[var(--primary)] hover:opacity-90 text-white px-8 py-3 text-lg">
//                   Get Started
//                 </Button>
//               </Link>
//               <Link href="/signup">
//                 <Button size="lg" variant="outline" className="border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--muted)] px-8 py-3 text-lg">
//                   Sign Up
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Stats Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
//           {stats.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div key={index} className="bg-[var(--input)] rounded-2xl p-6 shadow-sm border border-[var(--border)] text-center">
//                 <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center mx-auto mb-4">
//                   <Icon className="w-6 h-6 text-white" />
//                 </div>
//                 <div className="text-2xl font-bold text-[var(--foreground)] mb-1">{stat.value}</div>
//                 <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-12">
//           <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Key Features</h2>
//           <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
//             Discover the powerful tools and features that make BookManager the perfect solution for your book management needs.
//           </p>
//         </div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {features.map((feature, index) => {
//             const Icon = feature.icon;
//             return (
//               <Link key={index} href={feature.href}>
//                 <div className="bg-[var(--input)] rounded-2xl p-8 shadow-sm border border-[var(--border)] hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
//                   <div className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
//                     <Icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="text-xl font-semibold text-[var(--foreground)] mb-3">{feature.title}</h3>
//                   <p className="text-[var(--muted-foreground)] leading-relaxed">{feature.description}</p>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="bg-[var(--primary)] rounded-3xl p-8 md:p-12 text-center text-white">
//           <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
//           <p className="text-xl mb-8 opacity-90">
//             Join thousands of users who trust BookManager for their book inventory needs.
//           </p>
//           {!session && (
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Link href="/signup">
//                 <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-gray-50 px-8 py-3 text-lg font-semibold">
//                   Start Free Trial
//                 </Button>
//               </Link>
//               <Link href="/login">
//                 <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--primary)] px-8 py-3 text-lg">
//                   Sign In
//                 </Button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context"; // Your existing context
import { Loader2 } from "lucide-react";

// Import the 3 distinct dashboard views
import { SystemAdminView } from "@/components/dashboard/system-admin-view";
import { AgentAdminView } from "@/components/dashboard/agent-admin-view";
import { UserDashboardView } from "@/components/dashboard/user-dashboard-view";
import { UnassignedUserView } from "@/components/dashboard/unassigned-view";

export default function HomePage() {
  // Using your existing context properties: 'pending' and 'session'
  const { session, pending } = useAuth();
  const router = useRouter();

  // 1. Redirect logic
  useEffect(() => {
    // If we are done checking (pending is false) and there is no session, redirect.
    if (!pending && !session) {
      router.push("/login");
    }
  }, [pending, session, router]);

  // 2. Loading State
  // We show this while 'pending' is true.
  if (pending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Loading workspace...</p>
        </div>
      </div>
    );
  }

  // 3. Safety Check
  // If not pending, but session is null, the useEffect is redirecting.
  // Return null to avoid flashing content.
  if (!session) {
    return null;
  }

  // 4. Role Dispatcher
  // Assuming your session object has user.role based on your better-auth config
  const role = session.user.role;

  switch (role) {
    case "system_admin":
      return <SystemAdminView />;
      
    case "agent_admin":
      return <AgentAdminView />;
      
    case "sales_executive":
    case "inventory_manager":
      // Both share the same operational view
      return <UserDashboardView />;
    case "user":
      return <UnassignedUserView user={session.user}  />;
    default:
      // Fallback for unknown roles (Safe default)
      router.push("/login");
      return null;
  }
}