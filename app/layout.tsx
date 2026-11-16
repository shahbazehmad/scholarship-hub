import type {Metadata,Viewport} from 'next';
import type {ReactNode} from 'react';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata:Metadata={title:{default:'Scholarship Hub — Scholarships, Grants & Fellowships',template:'%s | Scholarship Hub'},description:'Explore scholarship, grant and fellowship listings. Compare source information and confirm eligibility, funding and dates with the provider.',applicationName:'Scholarship Hub',appleWebApp:{capable:true,title:'Scholarship Hub'}};
export const viewport:Viewport={themeColor:'#102b55',width:'device-width',initialScale:1};
export default function RootLayout({children}:{children:ReactNode}){return <html lang="en"><body className="flex min-h-screen flex-col font-sans"><a href="#page-content" className="skip-link">Skip to content</a><Navbar/><main id="page-content" tabIndex={-1} className="flex-1">{children}</main><Footer/></body></html>;}
