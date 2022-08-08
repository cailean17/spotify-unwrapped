
    // import myJson from "./mood_data.json" assert {type: 'json'};
    
var nnData= JSON.parse(data);

        

    function normalizeMoods(mood){
        if(mood == "Calm"){
            return 0.2;
        } else if(mood == "Sad"){
            return 0.21;
        } else if(mood == "Happy"){
            return 0.22;
        } else if(mood == "Energetic"){
            return 0.23;
        }
    }

    function denoramlizeMoods(mood){
        var value = Math.round(mood*10)/10;
        console.log("Value" + value.toString());
        if(value <= 0.2){
            return "Calm";
        } else if(value > 0.2 && value <= 0.21){
            return "Sad";
        } else if(value > 0.21 && value <= 0.22){
            return "Happy";
        } else if(value > 0.22 && value <= 0.23){
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
        iterations: 30000,
        learningRate: 0.8,
        errorThresh: 0.00005,
    });
    console.log("TRAINING" + JSON.stringify(trainingData));
    
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
        localStorage.setItem("auth_code", code);
    
        console.log("CODE" + code);
        //APICtrl.getToken();
       window.location.href = "https://cailean17.github.io/spotify-unwrapped/";
    }

    




const APIController = (function() {

    const clientId = 'b6b43c44b19b4c6280dd7504715a9b55';
    const clientSecret = '0ec7cbdbe05a4e3cb6f1cb9da6854b9b';
    const redirect_uri = 'https%3A%2F%2Fcailean17.github.io%2Fspotify-unwrapped%2F';
    const scope =  'user-top-read';




    
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
        var auth_code = localStorage.getItem('auth_code');
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
                    localStorage.setItem("access_token", access_token);
                }
                if(data.refresh_token != undefined){
                    refresh_token = data.refresh_token;
                    localStorage.setItem("refresh_token", refresh_token);

                }
            } else{
                console.log("GET TOKEN API ERROR " + result.status.toString());
            }
     
        // console.log("TOKEN" + data.access_token);
        // return data.access_token;
    }

    const _getTopArtists = async(token) => {
     
        const result = await fetch('https://api.spotify.com/v1/me/top/artists?limit=7&time_range=short_term', {
            method:'GET',
            headers: {
               
                'Authorization' : 'Bearer ' + token
            }
           
        });
        console.log(result.status.toString());
        console.log(result.body.toString());
        var data = await result.json();
        console.log("Top Artists" + data.items[0].name);
        return data;
    }

    const _getMusicalDiversity = async(token) => {
        var artist_popularities = [];
        var user_genre_list= [];
   
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
    
        localStorage.setItem("user_popularity_rating", Math.trunc(average(artist_popularities)));
        var map = user_genre_list.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
        console.log(map );
       
        return map;
    }
    const _getTopTracks = async(token) => {
     
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
        popularity_rating : "#music_popularity_rating"
    }

     return {
        inputField(){
            return{
                get_started:document.querySelector(DOMElements.submit),
                populate_top_artist:document.querySelector(DOMElements.populate_top_artist),
                populate_top_tracks:document.querySelector(DOMElements.populate_top_tracks),
                populate_genre_chart:document.querySelector(DOMElements.populate_genre_chart),
            }
        },


        populateTopArtistsList(artist1, artist2, artist3){
            document.querySelector(DOMElements.topArtist1).innerHTML = artist1;
            document.querySelector(DOMElements.topArtist2).innerHTML = artist2;
            document.querySelector(DOMElements.topArtist3).innerHTML = artist3;


            

        },
        populateTopTracksList(track1, track2, track3, track1analysis, track2analysis, track3analysis){
            var track1Mood = runNeuralNetwork(track1analysis.danceability, track1analysis.acousticness, track1analysis.energy, track1analysis.instrumentalness, track1analysis.liveness, track1analysis.valence, track1analysis.speechiness, net);
            var track2Mood = runNeuralNetwork(track2analysis.danceability, track2analysis.acousticness, track2analysis.energy, track2analysis.instrumentalness, track2analysis.liveness, track2analysis.valence, track2analysis.speechiness, net);
            var track3Mood = runNeuralNetwork(track3analysis.danceability, track3analysis.acousticness, track3analysis.energy, track3analysis.instrumentalness, track3analysis.liveness, track3analysis.valence, track3analysis.speechiness, net);
            document.querySelector(DOMElements.topTrack1).innerHTML = track1.name;
            document.querySelector(DOMElements.topTrack2).innerHTML = track2.name;
            document.querySelector(DOMElements.topTrack3).innerHTML = track3.name;
            document.querySelector(DOMElements.topTrack1).innerHTML += 
            ` <div class = "container my-2">
            <div class = "row">
            <div class = "row>
              <div class="col -xs">
                    <img src="${track1.album.images[0].url}" alt="album cover" style="width:200px;height:200px;">  
                    <p class="lead my-2">${track1.album.name}</p>
                    <p class="lead" style="font-size:15px">${track1.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track1Mood} </h1>

                 </div>
                  
                      <p class="lead" style="font-size:15px">
                        The danceability of this song is on the higher side making it suitable for humans to move their hips and body in conjunction with the rhythm. Therefore, dancing to this song is acceptable. TLDR: don't be afraid to bust a move.
                      </p>
                      <p class="lead" style="font-size:15px">
                      This song can pack a punch. With its fast paced tempo, and energtic aura, the song ranks with a high energy rating. 
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
            <div class="col -xs">
                    <img src="${track2.album.images[0].url}" alt="album cover" style="width:200px;height:200px;">  
                    <p class="lead my-2">${track2.album.name}</p>
                    <p class="lead" style="font-size:15px">${track2.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track2Mood} </h1>
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
            <div class="col -xs">
                    <img src="${track3.album.images[0].url}" alt="album cover" style="width:200px;height:200px;">  
                    <p class="lead my-2">${track3.album.name}</p>
                    <p class="lead" style="font-size:15px">${track3.album.artists[0].name}</p>
                    <p class = "lead"> Mood: </p>
                    <h1 class = "rating-t"> ${track3Mood} </h1>
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
         document.querySelector(DOMElements.popularity_rating).innerHTML = localStorage.getItem("user_popularity_rating");
        }
       
     }


})();

const APPController = (function(UICtrl, APICtrl){

        const DOMInputs = UICtrl.inputField();

        const loadArtistList = async() => {
            // const token = await APICtrl.getToken();
            var token  = localStorage.getItem("access_token");
            console.log("LOADING ARTISTS");
            const topArtists = await APICtrl.getTopArtists(token);
         
            UICtrl.populateTopArtistsList(topArtists.items[0].name, topArtists.items[1].name, topArtists.items[2].name);
        }

        
        const loadTrackList = async() => {
            // const token = await APICtrl.getToken();
            var token  = localStorage.getItem("access_token");
            console.log("LOADING TRACKS");
            const topTracks = await APICtrl.getTopTracks(token);
            const track1Feature = await APICtrl.getTrackFeatures(token, topTracks.items[0].id);
            const track2Feature = await APICtrl.getTrackFeatures(token, topTracks.items[1].id);
            const track3Feature = await APICtrl.getTrackFeatures(token, topTracks.items[2].id);
        
         
            UICtrl.populateTopTracksList(topTracks.items[0], topTracks.items[1], topTracks.items[2], track1Feature, track2Feature, track3Feature);
         
        }
        const loadMusicalDiversity = async() => {
            var token  = localStorage.getItem("access_token");
            const genreList = await APICtrl.getMusicalDiversity(token);
            UICtrl.populateChart(genreList);
            UICtrl.populatePopularityRating();
        }


        const verifySpotifyUser = async() => {
        await APICtrl.verifyUser(); 
        await APICtrl.getToken();
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
        
    return {
        init() {
            console.log('App is starting');
         
          //verifySpotifyUser();
            //loadArtistList();
        }
    }
})(UIController, APIController);


APPController.init();


