# spotify-unwrapped

A web app using Spotify APIs and Machine Learning to offer personalized recommendations and musical analysis on your unique taste.
Click each album cover to easily play and preview a track recommendation on your active spotify device. Currently waiting on Quota Extension from Spotify to move out of Development Restricted mode. Users that aren't added to the development list can't use the app yet. Sorry!

website hosted on github pages: https://cailean17.github.io/spotify-unwrapped/
![Screenshot 2022-10-11 212731](https://user-images.githubusercontent.com/55571023/195250808-b52da65e-c7af-44b3-8b67-84dddb9b828e.png)
![github 1png](https://user-images.githubusercontent.com/55571023/205805583-83b92428-54c3-4766-88a7-e34bf55b7dde.png)
![github 2](https://user-images.githubusercontent.com/55571023/205805600-399fec65-bba7-471d-a922-aa5e89ef2e3f.png)

![Screenshot 2022-10-11 212706](https://user-images.githubusercontent.com/55571023/195250806-039935b9-dbf2-4abf-bac3-a33ced6d3bd8.png)


## How the ML Model works
![Screenshot 2023-10-24 223302](https://github.com/cailean17/spotify-unwrapped/assets/55571023/5c838d54-0af6-4426-bb6d-27d73efe6328)


  Spotify API offers raw data on a track's features. I focused on using three main features which include danceability, energy, and valence to accurately determine a mood of a song. By compiling 100s of songs from premade spotify playlists for specific moods, I created learning and testing data. The ML Model is built using brain.js and runs realtime on the browser. Currently, it can accurately classify tracks under 4 moods: Happy, Sad, Energetic, or Calm. Furthermore, the second ML Model also uses Spotify Data and finds songs that share similar track features.
