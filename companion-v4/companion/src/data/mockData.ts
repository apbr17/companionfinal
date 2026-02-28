import duneMovie from '@/assets/events/dune-movie.jpg';
import coldplayConcert from '@/assets/events/coldplay-concert.jpg';
import iplCricket from '@/assets/events/ipl-cricket.jpg';
import standupComedy from '@/assets/events/standup-comedy.jpg';
import arijitConcert from '@/assets/events/arijit-concert.jpg';
import pushpaMovie from '@/assets/events/pushpa-movie.jpg';
import indieLive from '@/assets/events/indie-live.jpg';
import islFootball from '@/assets/events/isl-football.jpg';

export interface Event {
  id: string;
  title: string;
  category: 'movies' | 'concerts' | 'sports' | 'comedy' | 'live';
  image: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  language?: string;
  genre?: string;
  rating?: number;
  price: number;
  description: string;
  duration?: string;
}

export interface Companion {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  avatar: string;
  interests: string[];
  bio: string;
}

export const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'];

export const categories = [
  { id: 'all', label: 'All Events', icon: '🎭' },
  { id: 'movies', label: 'Movies', icon: '🎬' },
  { id: 'concerts', label: 'Concerts', icon: '🎵' },
  { id: 'sports', label: 'Sports', icon: '⚽' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
  { id: 'live', label: 'Live Events', icon: '🎤' },
];

export const events: Event[] = [
  {
    id: '1',
    title: 'Dune: Part Three',
    category: 'movies',
    image: duneMovie,
    date: '2026-01-25',
    time: '7:00 PM',
    venue: 'PVR IMAX Phoenix',
    city: 'Mumbai',
    language: 'English',
    genre: 'Sci-Fi, Adventure',
    rating: 9.2,
    price: 450,
    description: 'The epic conclusion to the Dune saga. Paul Atreides unites with the Fremen to lead a rebellion against House Harkonnen.',
    duration: '2h 45m',
  },
  {
    id: '2',
    title: 'Coldplay: Music of the Spheres',
    category: 'concerts',
    image: coldplayConcert,
    date: '2026-02-15',
    time: '6:30 PM',
    venue: 'DY Patil Stadium',
    city: 'Mumbai',
    genre: 'Rock, Pop',
    price: 2500,
    description: 'Experience the magic of Coldplay live! Join millions of fans worldwide as Chris Martin and band bring their spectacular world tour to India.',
    duration: '3h',
  },
  {
    id: '3',
    title: 'IPL 2026: Mumbai vs Chennai',
    category: 'sports',
    image: iplCricket,
    date: '2026-03-20',
    time: '7:30 PM',
    venue: 'Wankhede Stadium',
    city: 'Mumbai',
    genre: 'Cricket',
    price: 1500,
    description: 'The biggest rivalry in IPL history! Watch Mumbai Indians take on Chennai Super Kings in this electrifying clash.',
    duration: '4h',
  },
  {
    id: '4',
    title: 'Zakir Khan Live',
    category: 'comedy',
    image: standupComedy,
    date: '2026-02-01',
    time: '8:00 PM',
    venue: 'NCPA Mumbai',
    city: 'Mumbai',
    language: 'Hindi',
    genre: 'Stand-up Comedy',
    price: 800,
    description: 'Sakht launda is back! Join Zakir Khan for an evening of laughter, stories, and unforgettable comedy.',
    duration: '2h',
  },
  {
    id: '5',
    title: 'Arijit Singh Live in Concert',
    category: 'concerts',
    image: arijitConcert,
    date: '2026-02-28',
    time: '7:00 PM',
    venue: 'JLN Stadium',
    city: 'Delhi',
    genre: 'Bollywood, Playback',
    price: 3000,
    description: "The voice of a generation performs live. Experience Arijit Singh's soul-stirring melodies in an unforgettable concert.",
    duration: '3h 30m',
  },
  {
    id: '6',
    title: 'Pushpa 3: The Rule',
    category: 'movies',
    image: pushpaMovie,
    date: '2026-01-28',
    time: '9:00 PM',
    venue: 'INOX Garuda Mall',
    city: 'Bangalore',
    language: 'Telugu',
    genre: 'Action, Drama',
    rating: 8.8,
    price: 350,
    description: 'Pushpa Raj returns for the ultimate showdown. The fire is burning brighter than ever.',
    duration: '3h 15m',
  },
  {
    id: '7',
    title: 'Prateek Kuhad: Silhouettes Tour',
    category: 'live',
    image: indieLive,
    date: '2026-02-10',
    time: '8:00 PM',
    venue: 'Phoenix Marketcity',
    city: 'Bangalore',
    genre: 'Indie, Folk',
    price: 1800,
    description: 'Join indie sensation Prateek Kuhad as he performs his biggest hits and new tracks from his latest album.',
    duration: '2h 30m',
  },
  {
    id: '8',
    title: 'ISL Final 2026',
    category: 'sports',
    image: islFootball,
    date: '2026-03-15',
    time: '6:00 PM',
    venue: 'Salt Lake Stadium',
    city: 'Kolkata',
    genre: 'Football',
    price: 1200,
    description: 'Witness the thrilling conclusion of the Indian Super League. Two titans battle for glory!',
    duration: '2h 30m',
  },
];

export const companions: Companion[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    age: 26,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    interests: ['Movies', 'Music', 'Travel'],
    bio: 'Movie buff who loves discussing films over coffee. Always up for Marvel marathons!',
  },
  {
    id: '2',
    name: 'Rahul Verma',
    age: 28,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    interests: ['Sports', 'Cricket', 'Gaming'],
    bio: 'Die-hard cricket fan. Looking for fellow enthusiasts to watch matches together!',
  },
  {
    id: '3',
    name: 'Ananya Desai',
    age: 24,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    interests: ['Comedy', 'Stand-up', 'Books'],
    bio: 'Comedy show addict! Love laughing until my stomach hurts.',
  },
  {
    id: '4',
    name: 'Arjun Kapoor',
    age: 30,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    interests: ['Concerts', 'Rock Music', 'Photography'],
    bio: 'Music is life! Always chasing the next great live performance.',
  },
  {
    id: '5',
    name: 'Sneha Reddy',
    age: 27,
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    interests: ['Live Events', 'Art', 'Theatre'],
    bio: 'Art and culture enthusiast. Love exploring new experiences with like-minded people.',
  },
  {
    id: '6',
    name: 'Vikram Singh',
    age: 32,
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    interests: ['Sports', 'Football', 'Fitness'],
    bio: 'Sports fanatic! Nothing beats watching a match live at the stadium.',
  },
];

export const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;
  const seats: {
    id: string;
    row: string;
    number: number;
    status: 'available' | 'booked' | 'premium';
    price: number;
  }[] = [];

  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const isPremium = rowIndex >= 4 && rowIndex <= 6;
      const isBooked = Math.random() < 0.3;
      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status: isBooked ? 'booked' : isPremium ? 'premium' : 'available',
        price: isPremium ? 650 : rowIndex < 3 ? 250 : 450,
      });
    }
  });

  return seats;
};
