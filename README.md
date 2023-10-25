# spotify-unwrapped

A web app using Spotify APIs and Machine Learning to offer personalized recommendations and musical analysis on your unique taste.
Click each album cover to easily play and preview a track recommendation on your active spotify device. Currently waiting on Quota Extension from Spotify to move out of Development Restricted mode. Users that aren't added to the development list can't use the app yet. Sorry!

website hosted on github pages: https://cailean17.github.io/spotify-unwrapped/
![Screenshot 2023-10-24 223542](https://github.com/cailean17/spotify-unwrapped/assets/55571023/86218d9f-8b95-4a48-9ad4-380565f96721)
![Screenshot 2023-10-24 223817](https://github.com/cailean17/spotify-unwrapped/assets/55571023/c3bdb232-2c87-4df5-a2e9-1e6c23d0b3a9)
![Screenshot 2023-10-24 223834](https://github.com/cailean17/spotify-unwrapped/assets/55571023/56709b19-0fd4-4631-bace-85aa2c803c89)



## How the ML Model works
![Screenshot 2023-10-24 223302](https://github.com/cailean17/spotify-unwrapped/assets/55571023/5c838d54-0af6-4426-bb6d-27d73efe6328)


  Spotify API offers raw data on a track's features. I focused on using three main features which include danceability, energy, and valence to accurately determine a mood of a song. By compiling 100s of songs from premade spotify playlists for specific moods, I created learning and testing data. The ML Model is built using brain.js and runs realtime on the browser. Currently, it can accurately classify tracks under 4 moods: Happy, Sad, Energetic, or Calm. Furthermore, the second ML Model also uses Spotify Data and finds songs that share similar track features.
