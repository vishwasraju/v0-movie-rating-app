export interface Movie {
  id: string
  title: string
  year: number
  poster: string
  backdrop: string
  rating: number
  ratingCount: number
  runtime: number
  genres: string[]
  director: string
  cast: string[]
  plot: string
  releaseDate: string
}

export interface Review {
  id: string
  movieId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  helpful: number
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinedAt: string
  ratings: { movieId: string; rating: number }[]
  watchlist: string[]
  favorites: string[]
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "The Shawshank Redemption",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop",
    rating: 9.3,
    ratingCount: 2847291,
    runtime: 142,
    genres: ["Drama"],
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton", "William Sadler"],
    plot: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    releaseDate: "1994-09-23"
  },
  {
    id: "2",
    title: "The Godfather",
    year: 1972,
    poster: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
    rating: 9.2,
    ratingCount: 1987654,
    runtime: 175,
    genres: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan", "Diane Keaton"],
    plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son.",
    releaseDate: "1972-03-24"
  },
  {
    id: "3",
    title: "The Dark Knight",
    year: 2008,
    poster: "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1534809027769-b00d750a6bac?w=1920&h=1080&fit=crop",
    rating: 9.0,
    ratingCount: 2765432,
    runtime: 152,
    genres: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart", "Michael Caine"],
    plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    releaseDate: "2008-07-18"
  },
  {
    id: "4",
    title: "Pulp Fiction",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
    rating: 8.9,
    ratingCount: 2156789,
    runtime: 154,
    genres: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson", "Bruce Willis"],
    plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    releaseDate: "1994-10-14"
  },
  {
    id: "5",
    title: "Inception",
    year: 2010,
    poster: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1920&h=1080&fit=crop",
    rating: 8.8,
    ratingCount: 2456123,
    runtime: 148,
    genres: ["Action", "Adventure", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"],
    plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    releaseDate: "2010-07-16"
  },
  {
    id: "6",
    title: "Fight Club",
    year: 1999,
    poster: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=1920&h=1080&fit=crop",
    rating: 8.8,
    ratingCount: 2234567,
    runtime: 139,
    genres: ["Drama"],
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter", "Meat Loaf"],
    plot: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more.",
    releaseDate: "1999-10-15"
  },
  {
    id: "7",
    title: "Forrest Gump",
    year: 1994,
    poster: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop",
    rating: 8.8,
    ratingCount: 2123456,
    runtime: 142,
    genres: ["Drama", "Romance"],
    director: "Robert Zemeckis",
    cast: ["Tom Hanks", "Robin Wright", "Gary Sinise", "Sally Field"],
    plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75.",
    releaseDate: "1994-07-06"
  },
  {
    id: "8",
    title: "The Matrix",
    year: 1999,
    poster: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1920&h=1080&fit=crop",
    rating: 8.7,
    ratingCount: 1987654,
    runtime: 136,
    genres: ["Action", "Sci-Fi"],
    director: "The Wachowskis",
    cast: ["Keanu Reeves", "Laurence Fishburne", "Carrie-Anne Moss", "Hugo Weaving"],
    plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    releaseDate: "1999-03-31"
  },
  {
    id: "9",
    title: "Interstellar",
    year: 2014,
    poster: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop",
    rating: 8.7,
    ratingCount: 1876543,
    runtime: 169,
    genres: ["Adventure", "Drama", "Sci-Fi"],
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"],
    plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    releaseDate: "2014-11-07"
  },
  {
    id: "10",
    title: "Goodfellas",
    year: 1990,
    poster: "https://images.unsplash.com/photo-1585951237313-1979e4df7385?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1504297050568-910d24c426d3?w=1920&h=1080&fit=crop",
    rating: 8.7,
    ratingCount: 1234567,
    runtime: 145,
    genres: ["Biography", "Crime", "Drama"],
    director: "Martin Scorsese",
    cast: ["Robert De Niro", "Ray Liotta", "Joe Pesci", "Lorraine Bracco"],
    plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate.",
    releaseDate: "1990-09-19"
  },
  {
    id: "11",
    title: "Parasite",
    year: 2019,
    poster: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=1920&h=1080&fit=crop",
    rating: 8.5,
    ratingCount: 876543,
    runtime: 132,
    genres: ["Drama", "Thriller"],
    director: "Bong Joon Ho",
    cast: ["Song Kang-ho", "Lee Sun-kyun", "Cho Yeo-jeong", "Choi Woo-shik"],
    plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.",
    releaseDate: "2019-05-30"
  },
  {
    id: "12",
    title: "The Silence of the Lambs",
    year: 1991,
    poster: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=300&h=450&fit=crop",
    backdrop: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
    rating: 8.6,
    ratingCount: 1456789,
    runtime: 118,
    genres: ["Crime", "Drama", "Thriller"],
    director: "Jonathan Demme",
    cast: ["Jodie Foster", "Anthony Hopkins", "Scott Glenn", "Ted Levine"],
    plot: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.",
    releaseDate: "1991-02-14"
  }
]

export const reviews: Review[] = [
  {
    id: "r1",
    movieId: "1",
    userId: "u1",
    userName: "MovieBuff42",
    rating: 10,
    title: "A masterpiece of cinema",
    content: "This film is nothing short of perfection. The story of hope and friendship in the darkest of places resonates deeply. Morgan Freeman's narration is iconic, and Tim Robbins delivers a career-defining performance. The ending is one of the most satisfying in film history.",
    helpful: 2341,
    createdAt: "2024-01-15"
  },
  {
    id: "r2",
    movieId: "1",
    userId: "u2",
    userName: "CinemaLover",
    rating: 9,
    title: "Timeless storytelling",
    content: "Watched this for the tenth time and it still hits different. The pacing is perfect, the characters are memorable, and the themes of hope and redemption are universal. A must-watch for anyone who appreciates quality filmmaking.",
    helpful: 1876,
    createdAt: "2024-02-20"
  },
  {
    id: "r3",
    movieId: "2",
    userId: "u3",
    userName: "ClassicFilmFan",
    rating: 10,
    title: "The definitive crime drama",
    content: "Coppola's masterwork set the standard for all crime films that followed. Brando's performance is legendary, and the transformation of Michael Corleone is one of the greatest character arcs ever written. Essential viewing.",
    helpful: 3456,
    createdAt: "2023-11-08"
  },
  {
    id: "r4",
    movieId: "3",
    userId: "u4",
    userName: "ActionHero",
    rating: 10,
    title: "Heath Ledger is unforgettable",
    content: "This isn't just a superhero movie - it's a crime thriller that happens to feature Batman. Heath Ledger's Joker is the greatest villain performance ever captured on film. The practical effects and IMAX sequences are breathtaking.",
    helpful: 4521,
    createdAt: "2024-03-12"
  },
  {
    id: "r5",
    movieId: "5",
    userId: "u5",
    userName: "SciFiGeek",
    rating: 9,
    title: "Mind-bending brilliance",
    content: "Nolan crafts a puzzle box of a film that rewards multiple viewings. The dream-within-a-dream concept is executed flawlessly, and the ensemble cast is stellar. The hallway fight scene is one of the most creative action sequences ever filmed.",
    helpful: 2987,
    createdAt: "2024-01-28"
  }
]

export const genres = [
  "Action",
  "Adventure", 
  "Animation",
  "Biography",
  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "History",
  "Horror",
  "Music",
  "Mystery",
  "Romance",
  "Sci-Fi",
  "Sport",
  "Thriller",
  "War",
  "Western"
]

export function getMovieById(id: string): Movie | undefined {
  return movies.find(m => m.id === id)
}

export function getReviewsByMovieId(movieId: string): Review[] {
  return reviews.filter(r => r.movieId === movieId)
}

export function getTopRatedMovies(limit: number = 10): Movie[] {
  return [...movies].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export function getMoviesByGenre(genre: string): Movie[] {
  return movies.filter(m => m.genres.includes(genre))
}

export function searchMovies(query: string): Movie[] {
  const lowerQuery = query.toLowerCase()
  return movies.filter(m => 
    m.title.toLowerCase().includes(lowerQuery) ||
    m.director.toLowerCase().includes(lowerQuery) ||
    m.cast.some(c => c.toLowerCase().includes(lowerQuery))
  )
}

export function formatRatingCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M'
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(0) + 'K'
  }
  return count.toString()
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}
