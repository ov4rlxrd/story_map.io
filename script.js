const countries = ["United States of America", "Switzerland", "Japan", "Germany", "South Korea", "China", "Czechia","Philippines","France","Greece","India","Indonesia","Italy","Malaysia","Poland","Portugal","Russia","Ukraine","Spain","Thailand","Vietnam","Turkey","United Kingdom", ""];
        let selectedCountries = [];
        let foundCountries = new Set();



        function stopTimer() {
            clearInterval(timerId);
        }

        function getRandomCountries() {
        while (selectedCountries.length < 3) {
            let country = countries[Math.floor(Math.random() * countries.length)];
            if (!selectedCountries.includes(country)) {
            selectedCountries.push(country);
            }
            
        }
            console.log("Найди эти страны:", selectedCountries);
        }
        

        
        window.onload = async function () {
            const globeContainer = document.getElementById('globe-container');
            const tooltip = document.getElementById('tooltip');
            const winWindow = document.getElementById('win_window')
            const startWindow = document.getElementById('start_window')
            const rightAnswer = document.getElementById('right_answer')
            const rightAnswerBtn = document.getElementById('right_answer_btn')
            const wrongAnswer = document.getElementById('wrong_answer')
            const wrongAnswerBtn = document.getElementById('wrong_answer_btn')
            const countriesToGuess = document.getElementById('countries_to_guess');
            const timerDisplay = document.getElementById('timer_display')
            const toggleModeWhitepaper = document.getElementById('toggle_mode_whitepaper')
            const toggleModeDark = document.getElementById('toggle_mode_dark')


            let selectedCountry = null;
            let hoveredCountry = null;

            let isDarkMode = true;


            function startTimer() {
                startTime = Date.now();
                timerId = setInterval(() => {
                    elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                    timerDisplay.textContent = `${elapsedTime} sec`;
                }, 1000);
            }


            function getCountryData() {
                return JSON.parse(localStorage.getItem("countryBadges")) || {};
            }

            let countryData = getCountryData();

            
            

            const world = Globe()(globeContainer)
                .width(window.innerWidth)
                .height(window.innerHeight)
                .backgroundColor('#000')
                .showAtmosphere(true)
                .atmosphereColor('white')
                .atmosphereAltitude(0.2)
                .globeImageUrl(null)
                .bumpImageUrl('story_logo.png')
                .showGlobe(true);

            const geoJsonUrl = 'https://unpkg.com/world-atlas@2/countries-110m.json';
            const worldData = await fetch(geoJsonUrl).then(res => res.json());
            const countries = topojson.feature(worldData, worldData.objects.countries).features;


            world.polygonsData(countries)
                .polygonCapColor(d => 
                    selectedCountry === d ? 'white' : 
                    hoveredCountry === d ? 'white' : 
                    'rgba(255, 255, 255, 0.1)')
                .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)')
                .polygonSideColor(() => 'rgba(0, 0, 0, 0.5)')
                .polygonAltitude(d => selectedCountry === d ? 0.02 : 0.005)
                .onPolygonClick(d => {
                    selectedCountry = d;
                    const countryName = d.properties.name;
                    console.log(countryName);
                    if (selectedCountries.includes(countryName)) {
                        if (!foundCountries.has(countryName)) {
                            foundCountries.add(countryName);
                            rightAnswer.style.display = 'block';
                        }
                        if (foundCountries.size === 3) {
                            winWindow.style.display = 'block'
                            stopTimer();
                        }
                    } else {
                        //showPopup("Не та страна! Попробуй снова.");
                        wrongAnswer.style.display = 'block'
                    }
                    
                    rightAnswerBtn.onclick = function () {
                        rightAnswer.style.display = 'none';
                    }
                    
                    wrongAnswerBtn.onclick = function () {
                        wrongAnswer.style.display = 'none';

                    }
                    // savedWindowText.innerHTML = `Thx! Story on ${countryName} .`
                    // savedWindow.style.display = 'block'
                   
                    

            
                })
                .onPolygonHover((hovered, prevHovered) => {
                    hoveredCountry = hovered;
                    world.polygonsData(countries);

                    if (hovered) {
                        const countryName = hovered.properties.name;
                        tooltip.innerHTML = `${countryName}`;
                    } else {
                        tooltip.style.display = 'none';
                    }
                });

                function toggleGameMode() {
                    if (isDarkMode) {
                    world.backgroundColor('#000000');  
                        world.atmosphereColor('white');
                        world.globeImageUrl(null);
                        world.polygonsData(countries)
                        .polygonCapColor(d => 
                            selectedCountry === d ? 'white' : 
                            hoveredCountry === d ? 'white' : 
                            'rgba(255, 255, 255, 0.1)')
                        .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.5)')
                        // toggleMode.textContent = "꧁Whitepaper Mode꧂"
                    }
                    else {
                        world.backgroundColor('#000000');  
                        world.atmosphereColor('white');
                        world.polygonsData(countries)
                        .polygonCapColor(d => 
                            selectedCountry === d ? 'black' : 
                            hoveredCountry === d ? 'black' : 
                            'rgba(255, 255, 255, 0.1)')
                        .polygonStrokeColor(() => 'rgba(0, 0, 0, 0.5)')
                        
                        world.globeImageUrl('wallpaper1.png'); // Повторно загружаем изображение после небольшой задержки

                        // toggleMode.textContent = "꧁Deffault Mode꧂";
                    }
                
                }

                toggleModeWhitepaper.onclick = function () {
                    isDarkMode = false;
                    getRandomCountries();
                    startWindow.style.display = 'none';
                    countriesToGuess.innerHTML = selectedCountries.join(', ');
                    startTimer();
                    toggleGameMode();
                }
                toggleModeDark.onclick = function () {
                    getRandomCountries();
                    startWindow.style.display = 'none';
                    countriesToGuess.innerHTML = selectedCountries.join(', ');
                    startTimer();
                    toggleGameMode();
                }

            document.addEventListener('mousemove', (event) => {
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            });
        };