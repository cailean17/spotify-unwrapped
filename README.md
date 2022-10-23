# spotify-unwrapped

A web app using Spotify APIs and Machine Learning to offer personalized recommendations and musical analysis on your unique taste.
Click each album cover to easily play and preview a track recommendation on your active spotify device. Currently waiting on Quota Extension from Spotify to move out of Development Restricted mode. Users that aren't added to the development list can't use the app yet. Sorry!

website hosted on github pages: https://cailean17.github.io/spotify-unwrapped/
![Screenshot 2022-10-11 212731](https://user-images.githubusercontent.com/55571023/195250808-b52da65e-c7af-44b3-8b67-84dddb9b828e.png)
![Screenshot 2022-10-11 212627](https://user-images.githubusercontent.com/55571023/195250800-4ebf004a-0646-487a-9bf6-f7abb64cb34f.png)
![Screenshot 2022-10-11 212706](https://user-images.githubusercontent.com/55571023/195250806-039935b9-dbf2-4abf-bac3-a33ced6d3bd8.png)


## How the ML Model works

  Spotify API offers raw data on a track's features. I focused on using three main features which include danceability, energy, and valence to accurately determine a mood of a song. By compiling 100s of songs from premade spotify playlists for specific moods, I created learning and testing data. The ML Model is built using brain.js and runs realtime on the browser. Currently, it can accurately classify tracks under 4 moods: Happy, Sad, Energetic, or Calm. Furthermore, the second ML Model also uses Spotify Data and finds songs that share similar track features.
