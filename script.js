const countries = ["United States of America", "Switzerland", "Japan", "Germany", "South Korea", "China", "Czechia","Philippines","France","Greece","India","Indonesia","Italy","Malaysia","Poland","Portugal","Russia","Ukraine","Spain","Thailand","Vietnam","Turkey","United Kingdom"];
        let selectedCountries = [];
        let foundCountries = new Set();
        let activatedNFTs = new Set();


        const nftCards = [
            {
                imageUrl: "quackers_nft_card.png", 
                description: "Quackers Legendary NFT card!"
            },
            {
                imageUrl: "globkins_nft_card.png",
                description: "Globkins Legendary NFT card!"
            },
            {
                imageUrl: "pipi_nft_card.png",
                description: "PiPi Legendary NFT card!"
            },
            {
                imageUrl: "mimboku_nft_card.png",
                description: "Mimboku Legendary NFT card!"
            },
        ];


        function stopTimer() {
            clearInterval(timerId);
        }

        function getRandomCountries(difficulty) {
            selectedCountries = []; 
            let availableCountries = [...countries];
        
            while (selectedCountries.length < difficulty) {
                let country = availableCountries.splice(Math.floor(Math.random() * availableCountries.length), 1)[0];
                selectedCountries.push(country);
            }
        
            let nftAvailableCountries = availableCountries.filter(c => !selectedCountries.includes(c));
        
            nftAvailableCountries.sort(() => Math.random() - 0.5);
        
            nftCards.forEach((nftCard, index) => {
                nftCard.country = nftAvailableCountries[index];
            });
        
        }
        

        

        
        window.onload = async function () {
            const globeContainer = document.getElementById('globe-container');
            const tooltip = document.getElementById('tooltip');
            const winWindow = document.getElementById('win_window')
            const startWindow = document.getElementById('start_window')
            const rightAnswer = document.getElementById('right_answer')
            const wrongAnswer = document.getElementById('wrong_answer')
            const countriesToGuess = document.getElementById('countries_to_guess');
            const timerDisplay = document.getElementById('timer_display')
            const scoreDisplay = document.getElementById('score_display')
            const toggleModeCont = document.getElementById('toggle_buttons_cont')
            const toggleModeWhitepaper = document.getElementById('toggle_mode_whitepaper')
            const toggleModeDark = document.getElementById('toggle_mode_dark')
            const difficultySelection = document.getElementById('difficulty_selection')
            const seekerBtn  = document.getElementById('difficulty_selection_seeker_btn')
            const adeptBtn  = document.getElementById('difficulty_selection_adept_btn')
            const ascendantBtn  = document.getElementById('difficulty_selection_ascendant_btn')
            const difficultyText = document.getElementById('difficulty_text')


            let selectedCountry = null;
            let hoveredCountry = null;

            let isDarkMode = true;

            let score = 0;
            let difficulty = null;

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

            
            
            function updateScore(points) {
                score += points;
                scoreDisplay.textContent = `Score: ${score}`;
            }


            function showScoreChange(text, isPositive) {
                const display = isPositive ? document.getElementById('score_change_display') : document.getElementById('score_change_display_negative');
                
                display.textContent = text;
                display.style.left = `${Math.random() * window.innerWidth}px`; 
                display.style.top = `${Math.random() * window.innerHeight / 2 + 50}px`; 
                
                display.style.opacity = 1;
            
                setTimeout(() => {
                    display.style.opacity = 0;
                }, 2000);
            }

            function showNFTCard(nftCard) {
                const nftPopup = document.getElementById("nft_popup");
                document.getElementById("nft_image").src = nftCard.imageUrl;
                document.getElementById("nft_description").textContent = nftCard.description;
                nftPopup.style.display = "block";
            
                setTimeout(() => {
                    nftPopup.style.display = "none";
                }, 5000);
            }


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

                    
                    const nftCard = nftCards.find(card => card.country === countryName);

                    if (nftCard) {
                        if (activatedNFTs.has(countryName)) {
                            return; 
                        }
                
                        activatedNFTs.add(countryName);
                        updateScore(500);
                        showScoreChange('+500', true);
                
                        showNFTCard(nftCard);
                
                        return; 
                    }

                    if (selectedCountries.includes(countryName)) {
                        if (!foundCountries.has(countryName)) {
                            foundCountries.add(countryName);
                            rightAnswer.style.display = 'block';

                            setTimeout(() => {
                                rightAnswer.style.display = 'none';
                            }, 1000);
                            


                            world.polygonsData(countries)
                            .polygonCapColor(p => (p === d ? 'green' : (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)'));

                            setTimeout(() => {
                                world.polygonsData(countries)
                                    .polygonCapColor(p => (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)');
                            }, 2000);

                            updateScore(100);
                            showScoreChange('+100', true);
                        }
                        if (foundCountries.size === difficulty) {
                            winWindow.style.display = 'block'
                            stopTimer();
                        }
                    } else {
                        wrongAnswer.style.display = 'block'

                        setTimeout(() => {
                            wrongAnswer.style.display = 'none';
                        }, 1000);


                        world.polygonsData(countries)
                        .polygonCapColor(p => (p === d ? 'red' : (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)'));

                        setTimeout(() => {
                            world.polygonsData(countries)
                                .polygonCapColor(p => (selectedCountry === p || hoveredCountry === p) ? 'white' : 'rgba(255, 255, 255, 0.1)');
                        }, 2000);
                        
                        updateScore(-25);
                        showScoreChange('-25', false);
                    }
                    
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
                        
                        world.globeImageUrl('wallpaper.png'); 

                        // toggleMode.textContent = "꧁Deffault Mode꧂";
                    }
                
                }

                seekerBtn.onclick = function () {
                    difficulty = 3;
                    toggleModeCont.style.display = 'flex';
                    difficultySelection.style.display = 'none';
                    difficultyText.style.display = 'none'
                }
                adeptBtn.onclick = function () {
                    difficulty = 4;
                    toggleModeCont.style.display = 'flex';
                    difficultySelection.style.display = 'none';
                    difficultyText.style.display = 'none'

                }
                ascendantBtn.onclick = function () {
                    difficulty = 5;
                    toggleModeCont.style.display = 'flex';
                    difficultySelection.style.display = 'none';
                    difficultyText.style.display = 'none'

                }


                toggleModeWhitepaper.onclick = function () {
                    isDarkMode = false;
                    getRandomCountries(difficulty);
                    startWindow.style.display = 'none';
                    countriesToGuess.innerHTML = selectedCountries.join(', ');
                    countriesToGuess.style.display = 'block';
                    timerDisplay.style.display = 'block'
                    scoreDisplay.style.display = 'block';
                    startTimer();
                    toggleGameMode();
                }
                toggleModeDark.onclick = function () {
                    getRandomCountries(difficulty);
                    startWindow.style.display = 'none';
                    countriesToGuess.innerHTML = selectedCountries.join(', ');
                    countriesToGuess.style.display = 'block';
                    timerDisplay.style.display = 'block'
                    scoreDisplay.style.display = 'block';
                    startTimer();
                    toggleGameMode();
                }

            document.addEventListener('mousemove', (event) => {
                tooltip.style.left = `${event.pageX + 10}px`;
                tooltip.style.top = `${event.pageY + 10}px`;
            });
        };