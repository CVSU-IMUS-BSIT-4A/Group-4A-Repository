import { DataSource } from 'typeorm';
import { Movie } from './movies/entities/movie.entity';
import { Review } from './reviews/entities/review.entity';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'movie_reviews.db',
  entities: [Movie, Review],
  synchronize: true,
});

const sampleMovies = [
  // Sci-Fi (10 movies)
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    genre: 'Sci-Fi',
    imageUrl: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    releaseYear: 1999,
  },
  {
    title: 'Inception',
    description: 'A skilled thief is given a chance at redemption if he can pull off an impossible heist: planting an idea in someone\'s mind through dream-sharing technology.',
    genre: 'Sci-Fi',
    imageUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    releaseYear: 2010,
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi',
    imageUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    releaseYear: 2014,
  },
  {
    title: 'Blade Runner 2049',
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    releaseYear: 2017,
  },
  {
    title: 'The Martian',
    description: 'An astronaut becomes stranded on Mars after his team assume him dead, and must rely on his ingenuity to find a way to signal to Earth.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/3ndAx3weG6KDkJIRMCi5vXX6Dyb.jpg',
    releaseYear: 2015,
  },
  {
    title: 'Arrival',
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg',
    releaseYear: 2016,
  },
  {
    title: 'Ex Machina',
    description: 'A young programmer is selected to participate in a ground-breaking experiment in synthetic intelligence by evaluating the human qualities of a highly advanced humanoid A.I.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/ayEsJaatZJmn8mms4SuVhFGSC9N.jpg',
    releaseYear: 2014,
  },
  {
    title: 'Dune',
    description: 'Paul Atreides leads a rebellion to restore his family\'s reign over the desert planet Arrakis while learning to control his extraordinary abilities.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/9BfGggdaTOgdKJ7MdiBVjGKy3IE.jpg',
    releaseYear: 2021,
  },
  {
    title: 'Edge of Tomorrow',
    description: 'A soldier fighting aliens gets to relive the same day over and over again, the day restarting every time he dies.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/nBM9MMa2WCwvMG4IJ3eiGUdbPe6.jpg',
    releaseYear: 2014,
  },
  {
    title: 'Gravity',
    description: 'Two astronauts work together to survive after an accident leaves them stranded in space.',
    genre: 'Sci-Fi',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/kZ2nZw8D681aphje8NJi8EfbL1U.jpg',
    releaseYear: 2013,
  },
  
  // Drama (10 movies)
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    releaseYear: 1994,
  },
  {
    title: 'Whiplash',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.',
    genre: 'Drama',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    releaseYear: 2014,
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    releaseYear: 1972,
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    releaseYear: 1994,
  },
  {
    title: 'Schindler\'s List',
    description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    releaseYear: 1993,
  },
  {
    title: 'The Green Mile',
    description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/velWPhVMQeQKcxggNEU8YmIo52R.jpg',
    releaseYear: 1999,
  },
  {
    title: '12 Years a Slave',
    description: 'In the antebellum United States, Solomon Northup, a free black man from upstate New York, is abducted and sold into slavery.',
    genre: 'Drama',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/xdANQijuNrJaw1HA61rDccME4Tm.jpg',
    releaseYear: 2013,
  },
  {
    title: 'The Pursuit of Happyness',
    description: 'A struggling salesman takes custody of his son as he\'s poised to begin a life-changing professional career.',
    genre: 'Drama',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/lBYOKAMcxIvuk9s9hMuecB9dPBV.jpg',
    releaseYear: 2006,
  },
  {
    title: 'The Revenant',
    description: 'A frontiersman on a fur trading expedition in the 1820s fights for survival after being mauled by a bear and left for dead.',
    genre: 'Drama',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/ji3ecJphATlVgWNY0B0RVXZizdf.jpg',
    releaseYear: 2015,
  },
  {
    title: 'A Beautiful Mind',
    description: 'After John Nash, a brilliant but asocial mathematician, accepts secret work in cryptography, his life takes a turn for the nightmarish.',
    genre: 'Drama',
    imageUrl: 'https://image.tmdb.org/t/p/w500/zwzWCmH72OSC9NA0ipoqw5Zjya8.jpg',
    releaseYear: 2001,
  },
  
  // Crime (10 movies)
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    genre: 'Crime',
    imageUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    releaseYear: 1994,
  },
  {
    title: 'The Godfather Part II',
    description: 'The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.',
    genre: 'Crime',
    imageUrl: 'https://image.tmdb.org/t/p/w500/hek3koDUyRQk7FIhPXsa6mT2Zc3.jpg',
    releaseYear: 1974,
  },
  {
    title: 'Goodfellas',
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners.',
    genre: 'Crime',
    imageUrl: 'https://image.tmdb.org/t/p/w500/aKuFiU82s5ISJpGZp7YkIr3kCUd.jpg',
    releaseYear: 1990,
  },
  {
    title: 'Scarface',
    description: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/iQ5ztdjvteGeboxtmRdXEChJOHh.jpg',
    releaseYear: 1983,
  },
  {
    title: 'The Departed',
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/nT97ifVT2J1yMQmeq20Qblg61T.jpg',
    releaseYear: 2006,
  },
  {
    title: 'Heat',
    description: 'A group of professional bank robbers start to feel the heat from police when they unknowingly leave a clue at their latest heist.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/umSVjVdbVwtx5ryCA2QXL44Durm.jpg',
    releaseYear: 1995,
  },
  {
    title: 'City of God',
    description: 'In the slums of Rio, two kids\' paths diverge as one struggles to become a photographer and the other a kingpin.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/k7eYdWvhYQyRQoU2TB2A2Xu2TfD.jpg',
    releaseYear: 2002,
  },
  {
    title: 'American History X',
    description: 'A former neo-nazi skinhead tries to prevent his younger brother from going down the same wrong path that he did.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/x2drgoXYZ8484lqyDj7L1CEVR4T.jpg',
    releaseYear: 1998,
  },
  {
    title: 'Training Day',
    description: 'On his first day on the job as a Los Angeles narcotics officer, a rookie cop goes beyond a full work day in training within the narcotics division.',
    genre: 'Crime',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/bUeiwBQdupBLQthMCHKV7zv56uv.jpg',
    releaseYear: 2001,
  },
  {
    title: 'Reservoir Dogs',
    description: 'When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant.',
    genre: 'Crime',
    imageUrl: 'https://image.tmdb.org/t/p/w500/xi8Iu6qyTfyZVDVy60raIOYJJmk.jpg',
    releaseYear: 1992,
  },
  
  // Action (10 movies)
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: 'Action',
    imageUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    releaseYear: 2008,
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Infinity War, the Avengers assemble once more to undo Thanos\' actions and restore order to the universe.',
    genre: 'Action',
    imageUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    releaseYear: 2019,
  },
  {
    title: 'Mad Max: Fury Road',
    description: 'In a post-apocalyptic wasteland, Max teams up with a mysterious woman, Furiosa, to try and survive.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
    releaseYear: 2015,
  },
  {
    title: 'Guardians of the Galaxy',
    description: 'A group of intergalactic criminals must pull together to stop a fanatical warrior with plans to purge the universe.',
    genre: 'Action',
    imageUrl: 'https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg',
    releaseYear: 2014,
  },
  {
    title: 'John Wick',
    description: 'An ex-hit-man comes out of retirement to track down the gangsters that took everything from him.',
    genre: 'Action',
    imageUrl: 'https://image.tmdb.org/t/p/w500/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    releaseYear: 2014,
  },
  {
    title: 'The Raid: Redemption',
    description: 'A S.W.A.T. team becomes trapped in a tenement run by a ruthless mobster and his army of killers and thugs.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/Abnm1Ws3JH0ReCfEhLMPwPcMcGO.jpg',
    releaseYear: 2011,
  },
  {
    title: 'Mission: Impossible - Fallout',
    description: 'Ethan Hunt and his IMF team, along with some familiar allies, race against time after a mission gone wrong.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/6fSdqrkkhSHi2hD6WFTi2LF43Al.jpg',
    releaseYear: 2018,
  },
  {
    title: 'Kingsman: The Secret Service',
    description: 'A spy organization recruits an unrefined but promising street kid into the agency\'s ultra-competitive training program.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/r6q9wZK5a2K51KFj4LWVID6Ja1r.jpg',
    releaseYear: 2014,
  },
  {
    title: 'Baby Driver',
    description: 'After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/tYzFuYXmT8LOYASlFCkaPiAFAl0.jpg',
    releaseYear: 2017,
  },
  {
    title: 'Atomic Blonde',
    description: 'An undercover MI6 agent is sent to Berlin during the Cold War to investigate the murder of a fellow agent and recover a missing list of double agents.',
    genre: 'Action',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/kV9R5h0Yct1kR8Hf8sJ1nX0Vz4x.jpg',
    releaseYear: 2017,
  },
  
  // Thriller (10 movies)
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: 'Thriller',
    imageUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    releaseYear: 2019,
  },
  {
    title: 'Se7en',
    description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.',
    genre: 'Thriller',
    imageUrl: 'https://image.tmdb.org/t/p/w500/69Sns8WoET6CfaYlIkHbla4l7nC.jpg',
    releaseYear: 1995,
  },
  {
    title: 'The Silence of the Lambs',
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/uS9m8OBk1A8eM9I042bx8XXpqAq.jpg',
    releaseYear: 1991,
  },
  {
    title: 'Gone Girl',
    description: 'With his wife\'s disappearance having become the focus of the media, a man sees the spotlight turned on him when it\'s suspected that he may not be innocent.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/ts996lKsxvjkO2yiYG0ht4qAicO.jpg',
    releaseYear: 2014,
  },
  {
    title: 'Shutter Island',
    description: 'In 1954, a U.S. Marshal investigates the disappearance of a murderess who escaped from a hospital for the criminally insane.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/nrmXQ0zcZUL8jFLrakWc90IR8z9.jpg',
    releaseYear: 2010,
  },
  {
    title: 'Zodiac',
    description: 'Between 1968 and 1983, a San Francisco cartoonist becomes an amateur detective obsessed with tracking down the Zodiac Killer.',
    genre: 'Thriller',
    imageUrl: 'https://image.tmdb.org/t/p/w500/6QHep2iVb8r2yF1v3j6YxwzqJ3N.jpg',
    releaseYear: 2007,
  },
  {
    title: 'Nightcrawler',
    description: 'When Louis Bloom, a driven man desperate for work, muscles into the world of L.A. crime journalism, he blurs the line between observer and participant.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/j9HrX8f7GbZQm1BrBiR40uFQZSb.jpg',
    releaseYear: 2014,
  },
  {
    title: 'No Country for Old Men',
    description: 'Violence and mayhem ensue after a hunter stumbles upon a drug deal gone wrong and more than two million dollars in cash near the Rio Grande.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/6d5XOczc226jECq0LIX0siKtgHR.jpg',
    releaseYear: 2007,
  },
  {
    title: 'Prisoners',
    description: 'When Keller Dover\'s daughter and her friend go missing, he takes matters into his own hands as the police pursue multiple leads.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/jsS3a3ep2KyBVmmiwaz3LvK49b1.jpg',
    releaseYear: 2013,
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    description: 'Journalist Mikael Blomkvist is aided in his search for a woman who has been missing for forty years by Lisbeth Salander.',
    genre: 'Thriller',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/zqDopwg7XQ4IfFX2dRlQCT1SwMG.jpg',
    releaseYear: 2011,
  },
  
  // Animation (10 movies)
  {
    title: 'Spirited Away',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    releaseYear: 2001,
  },
  {
    title: 'Coco',
    description: 'Aspiring musician Miguel confronts his family\'s ancestral ban on music and enters the Land of the Dead.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg',
    releaseYear: 2017,
  },
  {
    title: 'Toy Story',
    description: 'A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy\'s room.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg',
    releaseYear: 1995,
  },
  {
    title: 'Finding Nemo',
    description: 'After his son is captured in the Great Barrier Reef and taken to Sydney, a timid clownfish sets out on a journey to bring him home.',
    genre: 'Animation',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg',
    releaseYear: 2003,
  },
  {
    title: 'Up',
    description: '78-year-old Carl Fredricksen travels to Paradise Falls in his house equipped with balloons, inadvertently taking a young stowaway.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/vpbaStTMt8qqXaEgnOR2EE4DNJk.jpg',
    releaseYear: 2009,
  },
  {
    title: 'The Lion King',
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    genre: 'Animation',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    releaseYear: 1994,
  },
  {
    title: 'Wall-E',
    description: 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/hbhFnRzzg6ZDmm8YAmxBnQpQIPh.jpg',
    releaseYear: 2008,
  },
  {
    title: 'Inside Out',
    description: 'After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions - Joy, Fear, Anger, Disgust and Sadness - conflict on how best to navigate a new city.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/2H1TmgdfNtsKlU9jKdeNyYL5y8T.jpg',
    releaseYear: 2015,
  },
  {
    title: 'How to Train Your Dragon',
    description: 'A hapless young Viking who aspires to hunt dragons becomes the unlikely friend of a young dragon himself, and learns there may be more to the creatures than he assumed.',
    genre: 'Animation',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/ygGmAO60t8GyqUo9xYeYxSZAR3b.jpg',
    releaseYear: 2010,
  },
  {
    title: 'Ratatouille',
    description: 'A rat who can cook makes an unusual alliance with a young kitchen worker at a famous restaurant.',
    genre: 'Animation',
    imageUrl: 'https://image.tmdb.org/t/p/w500/t3vaWRPSf6WjDSamIkKDs1iQWna.jpg',
    releaseYear: 2007,
  },
  
  // Romance (10 movies)
  {
    title: 'La La Land',
    description: 'While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations for the future.',
    genre: 'Romance',
    imageUrl: 'https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    releaseYear: 2016,
  },
  {
    title: 'Titanic',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    genre: 'Romance',
    imageUrl: 'https://image.tmdb.org/t/p/w500/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    releaseYear: 1997,
  },
  {
    title: 'The Notebook',
    description: 'A poor yet passionate young man falls in love with a rich young woman, giving her a sense of freedom, but they are soon separated because of their social differences.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
    releaseYear: 2004,
  },
  {
    title: 'Pride & Prejudice',
    description: 'Sparks fly when spirited Elizabeth Bennet meets single, rich, and proud Mr. Darcy. But Mr. Darcy reluctantly finds himself falling in love with a woman beneath his class.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/v5gShop7147X33ytbcC2u05KDuc.jpg',
    releaseYear: 2005,
  },
  {
    title: 'Before Sunrise',
    description: 'A young man and woman meet on a train in Europe, and wind up spending one evening together in Vienna, and unfortunately, both know that this will probably be their only night together.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/hgkPGgQuPyydjimza3j1dsvaeHb.jpg',
    releaseYear: 1995,
  },
  {
    title: 'Eternal Sunshine of the Spotless Mind',
    description: 'When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg',
    releaseYear: 2004,
  },
  {
    title: '500 Days of Summer',
    description: 'An offbeat romantic comedy about a woman who doesn\'t believe true love exists, and the young man who falls for her.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/qXAuQ9hF30sQRsXf40OfRVl0MJZ.jpg',
    releaseYear: 2009,
  },
  {
    title: 'Her',
    description: 'In a near future, a lonely writer develops an unlikely relationship with an operating system designed to meet his every need.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg',
    releaseYear: 2013,
  },
  {
    title: 'Casablanca',
    description: 'A cynical expatriate American cafe owner struggles to decide whether or not to help his former lover and her fugitive husband escape the Nazis in French Morocco.',
    genre: 'Romance',
    imageUrl: 'https://www.themoviedb.org/t/p/w600_and_h900_face/lGCEKlJo2CnWydQj7aamY7s1S7Q.jpg',
    releaseYear: 1942,
  },
  {
    title: 'The Shape of Water',
    description: 'At a top secret research facility in the 1960s, a lonely janitor forms a unique relationship with an amphibious creature that is being held in captivity.',
    genre: 'Romance',
    imageUrl: 'https://image.tmdb.org/t/p/w500/k4FwHlMhuRR5BISY2Gm2QZHlH5Q.jpg',
    releaseYear: 2017,
  },
];

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const movieRepository = AppDataSource.getRepository(Movie);
    const reviewRepository = AppDataSource.getRepository(Review);

    // Clear existing data
    const existingReviews = await reviewRepository.find();
    const existingMovies = await movieRepository.find();
    
    if (existingReviews.length > 0) {
      await reviewRepository.remove(existingReviews);
    }
    if (existingMovies.length > 0) {
      await movieRepository.remove(existingMovies);
    }
    console.log('Cleared existing data');

    // Insert sample movies
    const savedMovies = [];
    for (const movieData of sampleMovies) {
      const movie = movieRepository.create(movieData);
      const saved = await movieRepository.save(movie);
      savedMovies.push(saved);
      console.log(`Created movie: ${saved.title}`);
    }

    // Add sample reviews for each movie
    const reviewNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Isabel', 'Jack', 'Karen', 'Leo', 'Mia', 'Nina', 'Oscar', 'Paul', 'Quinn', 'Rachel', 'Sam', 'Tina'];
    const reviewComments = [
      'Amazing movie! One of the best I\'ve ever seen.',
      'Great story and excellent acting.',
      'Brilliant cinematography and direction.',
      'Emotional and powerful. A masterpiece.',
      'Entertaining from start to finish.',
      'Thought-provoking and well-executed.',
      'Stunning visuals and great performances.',
      'A classic that stands the test of time.',
      'Unique and memorable experience.',
      'Highly recommended!',
    ];
    
    for (let i = 0; i < savedMovies.length; i++) {
      const movie = savedMovies[i];
      // Add 1-3 reviews per movie
      const numReviews = Math.floor(Math.random() * 3) + 1;
      for (let j = 0; j < numReviews; j++) {
        const reviewerName = reviewNames[Math.floor(Math.random() * reviewNames.length)];
        const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
        
        const review = reviewRepository.create({
          reviewerName,
          comment,
          rating,
          movieId: movie.id,
          movie: movie,
        });
        await reviewRepository.save(review);
        console.log(`Created review by ${reviewerName} for ${movie.title}`);

        // Update average rating
        const reviews = await reviewRepository.find({ where: { movieId: movie.id } });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        movie.averageRating = avgRating;
        await movieRepository.save(movie);
      }
    }

    console.log('Seed completed successfully!');
    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error seeding database:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seed();
