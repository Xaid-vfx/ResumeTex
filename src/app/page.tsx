import { Metadata } from 'next';
import HomePage from '../components/HomePage';

export const metadata: Metadata = {
  title: 'ResumeTex',
  description: 'Build Latex CVs with no code',
};

export default function Home() {
  return <HomePage />;
}