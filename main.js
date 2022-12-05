
    // import myJson from "./mood_data.json" assert {type: 'json'};
    
var nnData= JSON.parse(data);
var testingData = JSON.parse(testing_data)

        

    function normalizeMoods(mood){
        if(mood == "Calm"){
            return 0.25;
        } else if(mood == "Sad"){
            return 0.5;
        } else if(mood == "Happy"){
            return 0.75;
        } else if(mood == "Energetic"){
            return 1.0;
        }
    }

    function denoramlizeMoods(mood){
        var value = Math.round(mood*10)/10;
        console.log("Value" + value.toString());
        if(value <= 0.25){
            return "Calm";
        } else if(value > 0.25 && value <= 0.5){
            return "Sad";
        } else if(value > 0.5 && value <= 0.75){
            return "Happy";
        } else if(value > 0.75 && value <= 1.0){
            return "Energetic";
        }
    }
    var test = normalizeMoods(nnData[1]["mood"])

    var input = [];
    var output = [];
    const trainingData = [];
  
    for(let i = 0; i<nnData.length; i++){
             input.push({"danceability" : nnData[i]["danceability"], "acousticness" : nnData[i]["acousticness"], "energy" : nnData[i]["energy"], "instrumentalness" : nnData[i]["instrumentalness"], "liveness" : nnData[i]["liveness"], "valence" : nnData[i]["valence"], "speechiness" : nnData[i]["speechiness"]});
             output.push({"mood": normalizeMoods(nnData[i]["mood"])});

    }

    for(let i = 0; i<input.length; i++){
    trainingData.push({
        input:input[i], 
        output:output[i],
        });
    }
    const net = new brain.NeuralNetwork({hiddenLayers:[3]});

    const stats = net.train(trainingData, {
        log:true,
        logPeriod:100,
        iterations: 15000,
        learningRate: 0.3,
        errorThresh: 0.005,
    });
    console.log("TRAINING" + JSON.stringify(trainingData));
    testNeuralNetwork();
    
    function runNeuralNetwork(danceability, acousticness, energy, instrumentalness, liveness, valence, speechiness, net) {
           
            var raw_result = net.run({
                danceability: danceability,
                acousticness: acousticness,
                energy: energy,
                instrumentalness:instrumentalness,
                liveness:liveness,
                valence: valence,
                speechiness:speechiness
            })

            console.log("Initial" + JSON.stringify(raw_result));
            var final_result = denoramlizeMoods(raw_result["mood"])

            console.log(stats);
            console.log("TEST" + final_result);

            return final_result;


            
}

 function testNeuralNetwork(){
        let model_accuracy = 0.0;
        let correct_predictions = 0;
        let totatl_testing_entries = testingData.length;
        for(let i = 0; i < totatl_testing_entries; i++){
           var result = net.run({
            danceability: testingData[i]["danceability"],
            acousticness: testingData[i]["acoustincess"],
            energy: testingData[i]["energy"],
            instrumentalness: testingData[i]["instrumentalness"],
            liveness: testingData[i]["liveness"],
            valence:testingData[i]["valence"],
            speechiness:testingData[i]["speechiness"],
        })
        var predictedMood = denoramlizeMoods(result["mood"])

        if(predictedMood == testingData[i]["mood"]){
            correct_predictions++;
        } 

        model_accuracy = correct_predictions / totat_testing_entries;
        return model_accuracy;

        }
     

 }



    
 
 
    function onPageLoad(){
        if(window.location.search.length > 0){
            handleRedirect();   
        }
    }
    
    function getCode(){
        let code = null;
        const queryString = window.location.search;
        if(queryString.length>0){
            const urlParams = new URLSearchParams(queryString);
            code = urlParams.get('code')
        }
        return code;
    }

    function handleRedirect() {
       
        let code = getCode();
        sessionStorage.setItem("auth_code", code);
    
        console.log("CODE" + code);
        //APICtrl.getToken();
       window.location.href = "https://cailean17.github.io/spotify-unwrapped/";
    }


    function determineTrackDescriptions(trackanalysis) {
        var final_description_array = [];
        console.log("DANCEABILITY" + trackanalysis.danceability);
        console.log("ENERGY" + trackanalysis.energy);
        if(trackanalysis.danceability > 0.6 && trackanalysis.danceability < 1.0 ){
            var danceability_desc = "The danceability of this song is on the higher side making it suitable for humans to move their hips and body in conjunction with the rhythm. Therefore, dancing to this song is acceptable. TLDR: don't be afraid to bust a move."
            final_description_array.push(danceability_desc);
            console.log("adding to description");
        }
        else if(trackanalysis.danceability > 0.45 && trackanalysis.danceability < 0.6){
            var danceability_desc = "This song ranks with an average danceability. Not perfect for dancing, but not too bad either. However, be vary that some might not see eye to eye."
            final_description_array.push(danceability_desc);
            console.log("adding to description");
        }
        else if(trackanalysis.danceability > 0.0 && trackanalysis.danceability < 0.45){
            var danceability_desc = "This song ranks with a low danceability. Try not to dance to this song unless you want to catch some weird looks. Stay put for this one."
            final_description_array.push(danceability_desc);
            console.log("adding to description");
        }

        if(trackanalysis.energy > 0.6 && trackanalysis.energy < 1.0){
            var energy_desc = "This song can pack a punch. With its fast paced tempo and energtic aura, the song ranks with a high energy rating. Suitable to start your day with."
            final_description_array.push(energy_desc);
            console.log("adding to description");
            console.log("FINAL description" + final_description_array.toString());
    
            return final_description_array;
            
        }
        else if(trackanalysis.energy > 0.45 && trackanalysis.energy < 0.6){
            var energy_desc = "With an average energy rating, this song can still uplift making it suitable for any setting."
            final_description_array.push(energy_desc);
            console.log("adding to description");
            console.log("FINAL description" + final_description_array.toString());
    
            return final_description_array;
        }
        else if(trackanalysis.energy > 0.0 && trackanalysis.energy < 0.45){
            var energy_desc = "This song ranks with a low energy. Due to its slow tempo, and airy production, it's more than perfect for catching some Zs to."
            final_description_array.push(energy_desc);
            console.log("adding to description");
            console.log("FINAL description" + final_description_array.toString());
    
           return final_description_array;
        }
       
    }
    




const APIController = (function() {

    const clientId = 'b6b43c44b19b4c6280dd7504715a9b55';
    const clientSecret = '0ec7cbdbe05a4e3cb6f1cb9da6854b9b';
    const redirect_uri = 'https%3A%2F%2Fcailean17.github.io%2Fspotify-unwrapped%2F';
    const scope =  'user-top-read app-remote-control streaming user-modify-playback-state';




    
    const _verifyUser  = async() => {
        
      

        window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`;
        
        // while(true){
               
        //     if(window.location.href.includes(homeURL) && window.location.href.length > homeURL.length ){
        //         onPageLoad();
        //         break;
        //     }
           

        // }
        // const  result = await fetch(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirect_uri}&scope=${scope}`, {
        //     mode: "no-cors",
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //   },


            
        // });
       
     

    }

    const _getToken = async() =>  {
        var auth_code = sessionStorage.getItem('auth_code');
        console.log("AUTH CODE " + auth_code);

        // const body = `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${auth_code}&redirect_uri=${redirect_uri}`
        // console.log("BODY"+ body);
        const result = await fetch( 'https://accounts.spotify.com/api/token', {
           mode:'cors',
            method:'POST',
            headers: {
            
                'Content-Type' : 'application/x-www-form-urlencoded',
                'Authorization' : 'Basic ' + btoa(clientId + ":" + clientSecret)
            },
            body: new URLSearchParams({
         
                'grant_type': 'authorization_code',
                'code' : auth_code,
                'redirect_uri': 'https://cailean17.github.io/spotify-unwrapped/',
              
            })
        })
     
        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", "https://accounts.spotify.com/api/token", true );
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
        // xhr.send(body);



        console.log("RESULT" + result.status.toString());
            if(result.status == 200){
                //var readableData = await result.text();
                data = await result.json();
                // var data = JSON.parse(result.text())
                //console.log("TOKEN DATA" + readableData);

                if(data.access_token != undefined){
                    access_token = data.access_token;
                    sessionStorage.setItem("access_token", access_token);
                }
                if(data.refresh_token != undefined){
                    refresh_token = data.refresh_token;
                    sessionStorage.setItem("refresh_token", refresh_token);

                }
            } else{
                console.log("GET TOKEN API ERROR " + result.status.toString());
            }
     
        // console.log("TOKEN" + data.access_token);
         return data.access_token;
    }

    const _getTopArtists = async(token) => {
     
            if(token == null){
                token = await _getToken();
            }
        const result = await fetch('https://api.spotify.com/v1/me/top/artists?limit=7&time_range=short_term', {
            method:'GET',
            headers: {
               
                'Authorization' : 'Bearer ' + token
            }
           
        });
        console.log("TOKEN for top artists" + token);
        console.log(result.status.toString());
        console.log(result.body.toString());
        var data = await result.json();
        console.log("Top Artists" + data.items[0].name);
        return data;
    }

    const _getMusicalDiversity = async(token) => {
        var artist_popularities = [];
        var user_genre_list= [];
        if(token == null){
            token = await _getToken();
        }
   
        const result = await fetch('https://api.spotify.com/v1/me/top/artists?limit=30', {
            method:'GET',
            headers: {
               
                'Authorization' : 'Bearer ' + token
            }
           
        });
        var data = await result.json();
        data.items.forEach(function(element){
            console.log("ELEMENTS" + element.genres[0])
            user_genre_list.push(element.genres[0]);
            artist_popularities.push(element.popularity);
        })
        console.log("POPULARITY LIST" + artist_popularities.toString());
        console.log("USER GENRE LIST" + user_genre_list.toString());
        const average = (array) => array.reduce((a, b) => a + b) / array.length;
    
        sessionStorage.setItem("user_popularity_rating", Math.trunc(average(artist_popularities)));
        var map = user_genre_list.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
        console.log(map );
       
        return map;
    }
    const _getTopTracks = async(token) => {
     
        if(token == null){
            token = await _getToken();
        }
        const result = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=3&time_range=short_term', {
            method:'GET',
            headers: {
               
                'Authorization' : 'Bearer ' + token
            }
           
        });
        console.log(result.status.toString());
        var data = await result.json();
        console.log("Top Tracks" + data.items[0].name);
        return data;
    }

    const _getTrackFeatures = async(token, trackId) => {
        if(token == null){
            token = await _getToken();
        }
        const result  = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
           method:'GET',
           headers:{

                'Authorization' : 'Bearer ' + token
           }

        });
        var data = await result.json();
        console.log("TRACK FEATURES" + data["energy"]);
        return data;
    }

    const _startPlayback = async(token, track_uri) => {
        if(token == null){
            token = await _getToken();
        }
        const result = await fetch(`https://api.spotify.com/v1/me/player/play`, {
            method:'PUT',
            headers:{
                'Authorization' : 'Bearer ' + token
            },
            
            body : JSON.stringify({
                "uris": [track_uri]

            })
        });
        var data = await result.json();
        console.log("PLAYING SONG" + data);
        //return data;
    }

    const _getRecommendations= async(token, trackFeatures) => {
        if(token == null){
            token = await _getToken();
        }
        const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackFeatures.id}&target_energy=${trackFeatures.energy}&target_acousticness=${trackFeatures.acousticness}&limit=5&target_valence=${trackFeatures.valence}&target_loudness=${trackFeatures.loudness}`,{
            method:'GET',
            headers:{
                'Authorization' : 'Bearer ' + token
            }
        });
        console.log("GOT RECOMMENDATIONS" + result.status.toString());
        var data = await result.json();
       
        return data;
    }

    const _getSearchedTrackRecommendations = async(token, trackName, artist) => {
        if(token == null){
            token = await _getToken();
        }
        const result = await fetch(`https://api.spotify.com/v1/search?q=track:${trackName}+artist:${artist}&type=track`, {
            method: 'GET',
            headers:{
                'Authorization' : 'Bearer ' + token
            }
        });
        console.log("SEARCH TRACK RECOMMENDATION" + result.status.toString());
        var data  = await result.json();
        return data;
    }

    const _getTracksForSpecializedPlaylist = async(token, topTrack1, topTrack2, topTrack3, topTrack1Artist, topTrack2Artist, topTrack3Artist) => {
        if(token == null){
            token = await _getToken();
        }
        const result = await fetch(`https://api.spotify.com/v1/recommendations?seed_artists=${topTrack1Artist},${topTrack2Artist}&seed_tracks=${topTrack1},${topTrack2},${topTrack3}&limit=10`,{
            method: "GET",
            headers:{
                'Authorization' : 'Bearer ' + token
            }
        });
        console.log("Getting Specialized Playlist Tracks" + result.status.toString());
        var data  = await result.json();
        return data;
    }

    return {

        verifyUser() {
            return _verifyUser();
        },

        getToken(){
            return _getToken();
        },
        getMusicalDiversity(token){
            return _getMusicalDiversity(token);
        },

        getTopArtists(token){
            return _getTopArtists(token);
        },
        getTopTracks(token){
            return _getTopTracks(token);
        },
        getTrackFeatures(token, trackId){
            return _getTrackFeatures(token, trackId);
        },

        startPlayback(token, track_uri){
            return _startPlayback(token, track_uri);
        },
        getRecommendations(token, trackFeatures){
            return _getRecommendations(token, trackFeatures);
        },
        getSearchedTrackRecommendations(token, trackName, artist){
            return _getSearchedTrackRecommendations(token, trackName, artist);
        },
    
        getTracksForSpecializedPlaylist(token, topTrack1, topTrack2, topTrack3, topTrack1Artist, topTrack2Artist, topTrack3Artist){
            return _getTracksForSpecializedPlaylist(token, topTrack1, topTrack2, topTrack3, topTrack1Artist, topTrack2Artist, topTrack3Artist);
        }
    }
    }
     
      
    
)();

const UIController = (function() {

    const DOMElements = {
        topArtist1 : '#top_artist_1',
        topArtist2 : '#top_artist_2',
        topArtist3 : "#top_artist_3",
        topTrack1  : "#top_track_1",
        topTrack2  : "#top_track_2",
        topTrack3  : "#top_track_3",
        submit : "#get_started",
        populate_top_artist: "#populate_top_artist",
        populate_top_tracks: "#populate_top_tracks",
        populate_genre_chart: "#populate_genre_chart",
        canvas : "#canvas",
        underground_mainstream_container : "#underground_mainstream",
        popularity_rating : "#music_popularity_rating",
        search_bar_track_recommendation_name: "#search_bar_track_recommendation_name",
        search_bar_track_recommendation_artist: "#search_bar_track_recommendation_artist",
        searched_track_recommendation: "#searched_track_recommendation",
        search_bar_enter: "#search_bar_enter",
    }

     return {
        inputField(){
            return{
                get_started:document.querySelector(DOMElements.submit),
                populate_top_artist:document.querySelector(DOMElements.populate_top_artist),
                populate_top_tracks:document.querySelector(DOMElements.populate_top_tracks),
                populate_genre_chart:document.querySelector(DOMElements.populate_genre_chart),
                search_bar_enter:document.querySelector(DOMElements.search_bar_enter),
            }
        },


        populateTopArtistsList(artist1, artist2, artist3){
            document.querySelector(DOMElements.topArtist1).innerHTML = artist1;
            document.querySelector(DOMElements.topArtist2).innerHTML = artist2;
            document.querySelector(DOMElements.topArtist3).innerHTML = artist3;


            

        },
       async populateTopTracksList(track1, track2, track3, track1analysis, track2analysis, track3analysis, track_playback_function, recommendation_function, token){
            var track1_descriptions =    determineTrackDescriptions(track1analysis);
            var track2_descriptions =   determineTrackDescriptions(track2analysis);
            var recommendations = await recommendation_function(token, track1analysis);
            var recommendations_track2 = await recommendation_function(token, track2analysis);
            var recommendations_track3 = await recommendation_function(token, track3analysis);

            var track3_descriptions =   determineTrackDescriptions(track3analysis);
            var track1Mood = runNeuralNetwork(track1analysis.danceability, track1analysis.acousticness, track1analysis.energy, track1analysis.instrumentalness, track1analysis.liveness, track1analysis.valence, track1analysis.speechiness, net);
            var track2Mood = runNeuralNetwork(track2analysis.danceability, track2analysis.acousticness, track2analysis.energy, track2analysis.instrumentalness, track2analysis.liveness, track2analysis.valence, track2analysis.speechiness, net);
            var track3Mood = runNeuralNetwork(track3analysis.danceability, track3analysis.acousticness, track3analysis.energy, track3analysis.instrumentalness, track3analysis.liveness, track3analysis.valence, track3analysis.speechiness, net);
            document.querySelector(DOMElements.topTrack1).innerHTML = track1.name;
            document.querySelector(DOMElements.topTrack2).innerHTML = track2.name;
            document.querySelector(DOMElements.topTrack3).innerHTML = track3.name;
            // console.log("INSIDE DESCRIPTION" + track1_descriptions.toString());
            document.querySelector(DOMElements.topTrack1).innerHTML += 
            
            ` 
            <div class = "container my-2">
            <div class = "row">
            
            <div class = "row>
              <div class="col-xs pe-5">
                <div class = "xop-box" id = "track1albumcover" style = "background:url(${track1.album.images[0].url}) center/200px 200px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                
                    <p class="lead my-2">${track1.album.name}</p>
                    <p class="lead" style="font-size:15px">${track1.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track1Mood} </h1>

                 </div>
                 <div class = "col-xs px-5 ">
                 
                     <p style="padding: 0px 0px 0px 70px" class = "lead"> Recommendations </p>
                 
                 <div class = "row justify-content-around">
                 <div class = "col-xs pe-4" style="max-width: 172px">
                 <div class = "xop-box-small" id = "track1_recommendation1album" style = "background:url(${recommendations.tracks[1].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead trimText" style = "font-size:10px; padding-top:10px"> ${recommendations.tracks[1].name}</p>
                <p class = "lead trimText" style = "font-size:10px"> ${recommendations.tracks[1].album.name}</p>
                </div>
                <div class = "col-xs px-4" style="max-width: 172px">
                <div class = "xop-box-small" id = "track1_recommendation2album"  style = "background:url(${recommendations.tracks[2].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead" style = "font-size:10px;  padding-top:10px"> ${recommendations.tracks[2].name}</p>
                <p class = "lead" style = "font-size:10px"> ${recommendations.tracks[2].album.name}</p>
                </div>
                <div class = "col-xs ps-4"  style="max-width: 172px">
                <div class = "xop-box-small" id = "track1_recommendation3album"  style = "background:url(${recommendations.tracks[3].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations.tracks[3].name}</p>
                <p class = "lead" style = "font-size:10px"> ${recommendations.tracks[3].album.name}</p>
                </div>
                </div>
                </div>
                  
                      <p class="lead" style="font-size:15px">
                            ${track1_descriptions[0]}
                      </p>
                      <p class="lead" style="font-size:15px">
                            ${track1_descriptions[1]}
                      </p>
             </div>
           
                
           
            <div class = "col-md">
                <div class = "row justify-content-around">
                <div class = "col-xs ">
                <p class="lead my-2">Danceability</p>
                <h1 class = "rating-t" > ${track1analysis.danceability} </h1>
           
              
            </div>
            <div class = "col-xs ">
              <p class="lead my-2">Energy</p>
              <h1 class = "rating-t" >${track1analysis.energy} </h1>
                
            </div>
            <div class = "col-xs mx-2">
              <p class="lead my-2">Valence</p>
              <h1 class = "rating-t" > ${track1analysis.valence} </h1>
                
            </div>
              </div>
          </div>
            </div>
        </div>`

            document.querySelector(DOMElements.topTrack2).innerHTML += 
            ` <div class = "container my-2">
            <div class = "row">
            <div class = "row>
              <div class="col -xs">
                <div class = "xop-box" id = "track2albumcover" style = "background:url(${track2.album.images[0].url}) center/200px 200px no-repeat">
                        
                    <div class = "overlay">
                    <i class="fa fa-play-circle-o icon" aria-hidden="true"></i>

                    </div>
                </div>
                    <p class="lead my-2">${track2.album.name}</p>
                    <p class="lead" style="font-size:15px">${track2.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track2Mood} </h1>

                 </div>
                        <div class = "col-xs px-5 ">
                        
                        <p style="padding: 0px 0px 0px 70px" class = "lead"> Recommendations </p>
                    
                    <div class = "row justify-content-around">
                    <div class = "col-xs pe-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track2_recommendation1album" style = "background:url(${recommendations_track2.tracks[1].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations_track2.tracks[1].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track2.tracks[1].album.name}</p>
                    </div>
                    <div class = "col-xs px-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track2_recommendation2album"  style = "background:url(${recommendations_track2.tracks[2].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px;  padding-top:10px"> ${recommendations_track2.tracks[2].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track2.tracks[2].album.name}</p>
                    </div>
                    <div class = "col-xs ps-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track2_recommendation3album"  style = "background:url(${recommendations_track2.tracks[3].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations_track2.tracks[3].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track2.tracks[3].album.name}</p>
                    </div>
                    </div>
                    </div>
                  
                      <p class="lead" style="font-size:15px">
                            ${track2_descriptions[0]}
                      </p>
                      <p class="lead" style="font-size:15px">
                            ${track2_descriptions[1]}
                      </p>
             </div>
           
                
           
            <div class = "col-md">
                <div class = "row justify-content-around">
                <div class = "col-xs ">
                <p class="lead my-2">Danceability</p>
                <h1 class = "rating-t" > ${track2analysis.danceability} </h1>
           
              
            </div>
            <div class = "col-xs ">
              <p class="lead my-2">Energy</p>
              <h1 class = "rating-t" >${track2analysis.energy} </h1>
                
            </div>
            <div class = "col-xs mx-2">
              <p class="lead my-2">Valence</p>
              <h1 class = "rating-t" > ${track2analysis.valence} </h1>
                
            </div>
              </div>
          </div>
            </div>
        </div>`
            document.querySelector(DOMElements.topTrack3).innerHTML +=
            ` <div class = "container my-2">
            <div class = "row">
            <div class = "row>
              <div class="col -xs">
             
              <div class = "xop-box" id = "track3albumcover" style = "background:url(${track3.album.images[0].url}) center/200px 200px no-repeat">
                      
                  <div class = "overlay">
                  <i class="fa fa-play-circle-o icon" aria-hidden="true"></i>

                  </div>
              </div>
                    <p class="lead my-2">${track3.album.name}</p>
                    <p class="lead" style="font-size:15px">${track3.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track3Mood} </h1>

                 </div>
                        <div class = "col-xs px-5 ">
                        
                        <p style="padding: 0px 0px 0px 70px" class = "lead"> Recommendations </p>
                    
                    <div class = "row justify-content-around">
                    <div class = "col-xs pe-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track3_recommendation1album" style = "background:url(${recommendations_track3.tracks[1].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations_track3.tracks[1].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track3.tracks[1].album.name}</p>
                    </div>
                    <div class = "col-xs px-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track3_recommendation2album"  style = "background:url(${recommendations_track3.tracks[2].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px;  padding-top:10px"> ${recommendations_track3.tracks[2].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track3.tracks[2].album.name}</p>
                    </div>
                    <div class = "col-xs ps-4"  style="max-width: 172px">
                    <div class = "xop-box-small" id = "track3_recommendation3album"  style = "background:url(${recommendations_track3.tracks[3].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                    
                        <div class = "overlay" >
                        <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                        </div>
                    </div>
                    <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations_track3.tracks[3].name}</p>
                    <p class = "lead" style = "font-size:10px"> ${recommendations_track3.tracks[3].album.name}</p>
                    </div>
                    </div>
                    </div>
                  
                      <p class="lead" style="font-size:15px">
                      ${track3_descriptions[0]}
                      </p>
                      <p class="lead" style="font-size:15px">
                      ${track3_descriptions[1]}
                      </p>
             </div>
           
                
           
            <div class = "col-md">
                <div class = "row justify-content-around">
                <div class = "col-xs ">
                <p class="lead my-2">Danceability</p>
                <h1 class = "rating-t" > ${track3analysis.danceability} </h1>
           
              
            </div>
            <div class = "col-xs ">
              <p class="lead my-2">Energy</p>
              <h1 class = "rating-t" >${track3analysis.energy} </h1>
                
            </div>
            <div class = "col-xs mx-2">
              <p class="lead my-2">Valence</p>
              <h1 class = "rating-t" > ${track3analysis.valence} </h1>
                
            </div>
              </div>
          </div>
            </div>
        </div>`
        document.querySelector("#track1albumcover").addEventListener('click', 
            function() {
                track_playback_function(token, track1analysis.uri, false)
            });
        document.querySelector("#track2albumcover").addEventListener('click', 
        function() {
            track_playback_function(token, track2analysis.uri, false)
        });
        document.querySelector("#track3albumcover").addEventListener('click', 
        function() {
            track_playback_function(token, track3analysis.uri, false)
        });
        document.querySelector("#track1_recommendation1album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations.tracks[1].uri, false)
        });
        document.querySelector("#track1_recommendation2album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations.tracks[2].uri, false)
        });

        document.querySelector("#track1_recommendation3album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations.tracks[3].uri, false)
        });
        document.querySelector("#track2_recommendation1album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track2.tracks[1].uri, false)
        });
        document.querySelector("#track2_recommendation2album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track2.tracks[2].uri, false)
        });

        document.querySelector("#track2_recommendation3album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track2.tracks[3].uri, false)
        });
        document.querySelector("#track3_recommendation1album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track3.tracks[1].uri, false)
        });
        document.querySelector("#track3_recommendation2album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track3.tracks[2].uri, false)
        });

        document.querySelector("#track3_recommendation3album").addEventListener('click', 
        function() {
            track_playback_function(token, recommendations_track3.tracks[3].uri, false)
        });








            

        },
        populateChart(map){
            let labels = [];
            let final_data = [];

        
            labels = Object.keys(map);
            final_data = Object.values(map);
            console.log("Labels" + labels);
            Chart.defaults.font.size = 20;
            Chart.defaults.font.family  = "Circular Std";
            Chart.defaults.color = "#FFFFFF";

            // const labels = [
            //     'January',
            //     'February',
            //     'March',
            //     'April',
            //     'May',;
            //     'June',
            // ];

            const data = {
                labels: labels,
                datasets: [{
                label: '# of Artists',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                color : "#FFF",
                data: final_data,
                }]
            };

            const canvas = document.querySelector(DOMElements.canvas).getContext('2d');
            let chart = new Chart(canvas, {
                type:"bar",
                data:data,
                options:{
                    scales:{
                        y:{
                            display:true,
                            text:"# of Artists"
                        }
                    }
                }

            });

        },
        populatePopularityRating() {
         document.querySelector(DOMElements.underground_mainstream_container).style.visibility = "visible";
         document.querySelector(DOMElements.popularity_rating).innerHTML = sessionStorage.getItem("user_popularity_rating");
        },

       async  populateSearchedTrackRecommendation(token, search_track_recommendation, track_playback_function, get_recommendations, get_track_features){
           trackName =  document.querySelector(DOMElements.search_bar_track_recommendation_name).value;
           artist =  document.querySelector(DOMElements.search_bar_track_recommendation_artist).value;
            var search_query = await search_track_recommendation(token, trackName, artist);
            var track_analysis = await get_track_features(token, search_query.tracks.items[0].id);
            var recommendations = await get_recommendations(token, track_analysis);
            document.querySelector(DOMElements.searched_track_recommendation).insertAdjacentHTML("beforeend", 
            `
            <div class = "container my-2"> 
           
            <div class = "row">
            
            <div class = "row>
              <div class="col-xs pe-5">
              <p class = "lead"> ${search_query.tracks.items[0].name}</p>
             
                <div class = "xop-box" id = "searched_track_${search_query.tracks.items[0].id}_albumcover" style = "background:url(${search_query.tracks.items[0].album.images[0].url}) center/200px 200px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                
                    <p class="lead my-2">${search_query.tracks.items[0].album.name}</p>
                    <p class="lead" style="font-size:15px">${search_query.tracks.items[0].album.artists[0].name}</p>
                    

                 </div>
                 <div class = "col-xs px-5 ">
                 
                     <p style="padding: 0px 0px 0px 70px" class = "lead"> Recommendations </p>
                 
                 <div class = "row justify-content-around">
                 <div class = "col-xs pe-4"  style="max-width: 172px">
                 <div class = "xop-box-small" id = "searched_track_${recommendations.tracks[1].id}_albumcover" style = "background:url(${recommendations.tracks[1].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead" style = "font-size:10px; padding-top:10px"> ${recommendations.tracks[1].name}</p>
                <p class = "lead" style = "font-size:10px">${recommendations.tracks[1].artists[0].name}</p>
                </div>
                <div class = "col-xs px-4"  style="max-width: 172px">
                <div class = "xop-box-small" id = "searched_track_${recommendations.tracks[2].id}_albumcover"  style = "background:url(${recommendations.tracks[2].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead" style = "font-size:10px;  padding-top:10px">${recommendations.tracks[2].name}</p>
                <p class = "lead" style = "font-size:10px">${recommendations.tracks[2].artists[0].name}</p>
                </div>
                <div class = "col-xs ps-4"  style="max-width: 172px">
                <div class = "xop-box-small" id = "searched_track_${recommendations.tracks[3].id}_albumcover"  style = "background:url(${recommendations.tracks[3].album.images[0].url}) center/100px 100px no-repeat; cursor:pointer">
                 
                    <div class = "overlay" >
                    <button class="btn" > <i class="fa fa-play-circle-o icon" aria-hidden="true"></i> </button>

                    </div>
                </div>
                <p class = "lead" style = "font-size:10px; padding-top:10px">${recommendations.tracks[3].name} </p>
                <p class = "lead" style = "font-size:10px">${recommendations.tracks[3].artists[0].name}</p>
                </div>
                </div>
                </div>
                  
                    
             </div>
             </div>`)
             document.querySelector(`#searched_track_${search_query.tracks.items[0].id}_albumcover`).addEventListener('click', 
             function() {
                 track_playback_function(token, search_query.tracks.items[0].uri, false)
             });
             document.querySelector(`#searched_track_${recommendations.tracks[0].id}_albumcover`).addEventListener('click', 
             function() {
                 track_playback_function(token, recommendations.tracks[0].uri, false)
             });
             document.querySelector(`#searched_track_${recommendations.tracks[1].id}_albumcover`).addEventListener('click', 
             function() {
                 track_playback_function(token, recommendations.tracks[1].uri, false)
             });
             document.querySelector(`#searched_track_${recommendations.tracks[2].id}_albumcover`).addEventListener('click', 
             function() {
                 track_playback_function(token, recommendations.tracks[2].uri, false)
             });
        }
       
     }


})();

const APPController = (function(UICtrl, APICtrl){

        const DOMInputs = UICtrl.inputField();

        const loadArtistList = async() => {
            // const token = await APICtrl.getToken();
            var token  = sessionStorage.getItem("access_token");
            console.log("LOADING ARTISTS");
            const topArtists = await APICtrl.getTopArtists(token);
         
            UICtrl.populateTopArtistsList(topArtists.items[0].name, topArtists.items[1].name, topArtists.items[2].name);
        }

        
        const loadTrackList = async() => {
            // const token = await APICtrl.getToken();
            var token  = sessionStorage.getItem("access_token");
            console.log("LOADING TRACKS");
            const topTracks = await APICtrl.getTopTracks(token);
            const track1Feature = await APICtrl.getTrackFeatures(token, topTracks.items[0].id);
            const track2Feature = await APICtrl.getTrackFeatures(token, topTracks.items[1].id);
            const track3Feature = await APICtrl.getTrackFeatures(token, topTracks.items[2].id);
            const specializedPlaylist = await APICtrl.getTracksForSpecializedPlaylist(token, topTracks.items[0].id,topTracks.items[1].id,topTracks.items[2].id,topTracks.items[0].album.artists[0].id,topTracks.items[1].album.artists[0].id,topTracks.items[2].album.artists[0].id);
        
         
            UICtrl.populateTopTracksList(topTracks.items[0], topTracks.items[1], topTracks.items[2], track1Feature, track2Feature, track3Feature, APICtrl.startPlayback, APICtrl.getRecommendations, token);
         
        }
        const loadMusicalDiversity = async() => {
            var token  = sessionStorage.getItem("access_token");
            const genreList = await APICtrl.getMusicalDiversity(token);
            UICtrl.populateChart(genreList);
            UICtrl.populatePopularityRating();
            
        }

        const loadSearchTrackRecommendation = async() => {
            var token  = sessionStorage.getItem("access_token");
            UICtrl.populateSearchedTrackRecommendation(token, APICtrl.getSearchedTrackRecommendations, APICtrl.startPlayback, APICtrl.getRecommendations, APICtrl.getTrackFeatures);
        }


        const verifySpotifyUser = async() => {
        await APICtrl.verifyUser();
            
        
       
        }


    

        DOMInputs.get_started.addEventListener('click', async() => {
            verifySpotifyUser();
           
             
            

        });

        

        DOMInputs.populate_top_artist.addEventListener('click', async() => {
           
           loadArtistList();
        })
        DOMInputs.populate_top_tracks.addEventListener('click', async() => {
            
            loadTrackList();

         })
         DOMInputs.populate_genre_chart.addEventListener('click', async() => {
           
            loadMusicalDiversity();

         })
         DOMInputs.search_bar_enter.addEventListener('click', async() => {
           
            loadSearchTrackRecommendation();

         })
        
    return {
        init() {
            console.log('App is starting');
         
          //verifySpotifyUser();
            //loadArtistList();
        }
    }
})(UIController, APIController);


APPController.init();


