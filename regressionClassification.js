// Init regression and classification Gradio clients
import { Client } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

let regressionClient = null;
let classificationClient = null;

// Initialize clients
async function initializeClients() {
    try {
        regressionClient = await Client.connect("hh871/moviescoreregression");
        classificationClient = await Client.connect("hh871/moviegenreclassifier");
        console.log("Gradio clients initialized successfully");
    } catch (error) {
        console.error("Failed to initialize Gradio clients:", error);
    }
}

// Initialize clients when the page loads
initializeClients();

// Init actual ratings genres of image example posters.
const imageExampleIdActRatingsGenres = {
    "imageExampleId0": [8.0, "Documentary"],
    "imageExampleId1": [8.5, "Drama"],
    "imageExampleId2": [6.5, "Comedy"],
    "imageExampleId3": [4.9, "Horror"],
    "imageExampleId4": [5.6, "Animation"],
};

// Convert data URL to Blob
function dataUrlToBlob(dataUrl) {
    return new Promise((resolve) => {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        resolve(new Blob([u8arr], { type: mime }));
    });
}

// Takes the file and reads data as a URL.
function dataUrlFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            resolve(event.target.result);
        };
        reader.readAsDataURL(file);
    });
}

// This functions resets the border colors and adds a yellow border to the selected poster.
function updatePosterBorder(posterId) {
    // Reset the border colors.
    const posterImages = document.getElementsByClassName("img-thumbnail poster");
    for (let i = 0; i < posterImages.length; i++) {
        posterImages[i].classList.add("border-white");
        posterImages[i].classList.remove("border-warning");
        posterImages[i].classList.remove("border-5");
    }

    // Update selected border yellow.
    const posterImage = document.getElementById(posterId);
    posterImage.classList.remove("border-white");
    posterImage.classList.add("border-warning");
    posterImage.classList.add("border-5");
}

// Predicts movie poster rating using Gradio client
async function predictRating(dataUrl) {
    try {
        if (!regressionClient) {
            throw new Error("Regression client not initialized");
        }
        
        const blob = await dataUrlToBlob(dataUrl);
        const result = await regressionClient.predict("/predict", {
            img: blob,
        });
        
        console.log('Rating API Response:', result);
        return result;
    } catch (error) {
        console.error('Rating API Error:', error);
        throw error;
    }
}

// Predicts movie poster classification using Gradio client
async function predictClassification(dataUrl) {
    try {
        if (!classificationClient) {
            throw new Error("Classification client not initialized");
        }
        
        const blob = await dataUrlToBlob(dataUrl);
        const result = await classificationClient.predict("/predict", {
            img: blob,
        });
        
        console.log('Classification API Response:', result);
        return result;
    } catch (error) {
        console.error('Classification API Error:', error);
        throw error;
    }
}

// Populates the IMDb rating div.
function populateIMDbRating(prediction, actualId = 0) {
    console.log('Rating prediction:', prediction);

    // Handle Gradio response format
    let predictRating;
    if (prediction.data && prediction.data[0]) {
        predictRating = prediction.data[0];
    } else if (Array.isArray(prediction) && prediction[0]) {
        predictRating = prediction[0];
    } else if (typeof prediction === 'number') {
        predictRating = prediction;
    } else {
        console.error('Unexpected prediction format:', prediction);
        return;
    }

    const predictString = "⭐ " + predictRating + "<small class='text-secondary'>/10</small>"
    document.getElementById("predictRating").innerHTML = predictString;
   
    // Remove old user data if applicable.
    if (histogramDataset.length == 2) {
        histogramDataset.pop();
    } else if (histogramDataset.length == 3) {
        histogramDataset.pop();
        histogramDataset.pop();
    }

    // Update histogram graph with user selected prediction.
    let userRatingData = {
        label: "Predicted IMDb Rating",
        data: [{ x: parseFloat(predictRating), y: parseFloat(predictRating) }],
        backgroundColor: "#F5C518",
        type: "line",
        pointRadius: 10,
        pointHoverRadius: 10
    };
    histogramDataset.push(userRatingData);

    // Update histogram with actual selected rating.
    if (actualId != 0) {
        const actualRating = imageExampleIdActRatingsGenres[actualId][0]
        let actualRatingData = {
            label: "Actual IMDb Rating",
            data: [{ x: parseFloat(actualRating), y: parseFloat(actualRating) }],
            backgroundColor: "#C518F5",
            type: "line",
            pointRadius: 12,
            pointHoverRadius: 12
        }
        histogramDataset.push(actualRatingData);
    }

    // Refresh the new histogram.
    histogramRatingChart.update();
}

// Populates the predicted movie poster genres.
function populateGenres(prediction, actualId = 0) {
    console.log('Genre prediction:', prediction);
   
    // Handle Gradio response format
    let pd;
    if (prediction.data && prediction.data[0]) {
        pd = prediction.data[0];
    } else if (Array.isArray(prediction) && prediction[0]) {
        pd = prediction[0];
    } else {
        pd = prediction;
    }
   
    // Check if confidences exist
    if (!pd || !pd.confidences) {
        console.error('No confidences in prediction:', pd);
        return;
    }
   
    let concatGenreLabelConfidence = "";
    for (let i = 0; i <= 2; i++) {
        const genreLabel = pd.confidences[i].label;
        const confidencePercent = "<small class='text-secondary'> ("
            + Math.floor(pd.confidences[i]['confidence'] * 100) + "%)</small>"
        if (i == 2) {
            concatGenreLabelConfidence = concatGenreLabelConfidence
                + genreLabel + confidencePercent
        } else {
            concatGenreLabelConfidence = concatGenreLabelConfidence
                + genreLabel + confidencePercent + " • "
        }
    }
    document.getElementById("genreConfidenceId").innerHTML = concatGenreLabelConfidence;

    // Remove old user data if applicable.
    if (horizontalBarGenreDataset.length == 2) {
        horizontalBarGenreDataset.pop();
    } else if (horizontalBarGenreDataset.length == 3) {
        horizontalBarGenreDataset.pop();
        horizontalBarGenreDataset.pop();
    }

    // Update horizontal bar graph with user selected genre prediction.
    const firstGenreLabel = pd.confidences[0].label;
    let userGenreArray = Array(genreLabels.length).fill(null);
    let genreLabelIndex = genreLabels.indexOf(firstGenreLabel);
    if (genreLabelIndex == -1) {
        userGenreArray[8] = 1;
    } else {
        userGenreArray[genreLabelIndex] = 1;
    }
    let userGenreData = {
        label: "Your Movie Genre",
        data: userGenreArray,
        backgroundColor: "#F5C518",
        type: "line",
        pointRadius: 10,
        pointHoverRadius: 10
    };
    horizontalBarGenreDataset.push(userGenreData);

    // Update horizontal bar graph with actual genre.
    if (actualId != 0) {
        const actualGenre = imageExampleIdActRatingsGenres[actualId][1]
        let actualGenreArray = Array(genreLabels.length).fill(null);
        let actualGenreLabelIndex = genreLabels.indexOf(actualGenre);
        if (actualGenreLabelIndex == -1) {
            actualGenreArray[8] = 1;
        } else {
            actualGenreArray[actualGenreLabelIndex] = 1;
        }
        let actualGenreData = {
            label: "Actual Movie Genre",
            data: actualGenreArray,
            backgroundColor: "#C518F5",
            type: "line",
            pointRadius: 12,
            pointHoverRadius: 12
        }
        horizontalBarGenreDataset.push(actualGenreData);
    }

    // Refresh the new histogram.
    horizontalBarGenreChart.update();

    // Display output IMDb rating and genres prediction row..
    const statusDisplayText = "↑ Click here to upload a movie poster."
    document.getElementById("statusDisplay").innerText = statusDisplayText;
}

// Upload movie poster main.
const selectElement = document.getElementById("chooseFileImageId");
selectElement.addEventListener("change", (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];

        // Update imagePreviewId with uploaded image and status text.
        dataUrlFromFile(file).then(async (dataUrl) => {
            document.getElementById("imagePreviewId").src = dataUrl;
            updatePosterBorder("imagePreviewId");
            document.getElementById("statusDisplay").innerText = "Processing image..."
            
            try {
                const ratingPrediction = await predictRating(dataUrl);
                populateIMDbRating(ratingPrediction);
                
                const genrePrediction = await predictClassification(dataUrl);
                populateGenres(genrePrediction);
            } catch (error) {
                console.error("Prediction error:", error);
                document.getElementById("statusDisplay").innerText = "Error processing image. Please try again.";
            }
        });
    }
});

// Example movie poster main.
const selectElements = document.getElementsByClassName("img-thumbnail poster");
for (let i = 1; i < selectElements.length; i++) {
    const selectElement = selectElements[i];
    selectElement.addEventListener("click", async (event) => {
        const posterId = event.target.id;
        updatePosterBorder(posterId);
        document.getElementById("statusDisplay").innerText = "Processing image..."
        const dataUrl = imageExampleIdImgs[posterId];
        
        try {
            const ratingPrediction = await predictRating(dataUrl);
            populateIMDbRating(ratingPrediction, posterId);
            
            const genrePrediction = await predictClassification(dataUrl);
            populateGenres(genrePrediction, posterId);
        } catch (error) {
            console.error("Prediction error:", error);
            document.getElementById("statusDisplay").innerText = "Error processing image. Please try again.";
        }
    });
}

// [Rest of your Chart.js code remains the same]

// Graphs - Histogram of IMDb Ratings.
const x_vals = [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5];
const y_vals = [59, 410, 1156, 2988, 7723, 14341, 11046, 1512, 24];
const data = x_vals.map((k, i) => ({ x: k, y: y_vals[i] }));
const ratingCtx = document.getElementById("histogramRatingChart").getContext("2d");
let histogramDataset = [
    {
        label: "Count of Movies",
        data: data,
        borderWidth: 1,
        barPercentage: 1,
        categoryPercentage: 1,
        borderRadius: 5,
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        borderColor: 'rgba(128, 128, 128, 1)'
    }
];
let histogramRatingChart = new Chart(ratingCtx, {
    type: "bar",
    data: {
        datasets: histogramDataset
    },
    options: {
        scales: {
            x: {
                type: 'linear',
                offset: false,
                grid: { offset: false },
                ticks: { stepSize: 1 },
                title: {
                    display: true,
                    text: "IMDb Rating"
                },
                stacked: true
            },
            y: {
                title: {
                    display: true,
                    text: "Count of Movies"
                },
                stacked: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Distribution of IMDb Ratings (n = 39.2K)"
            },
            tooltip: {
                callbacks: {
                    title: (items) => {
                        if (!items.length) {
                            return "";
                        }
                        const item = items[0];
                        const x = item.parsed.x;
                        const min = x - 0.5;
                        const max = x + 0.5;
                        const toolTipLabel = items[0].dataset.label;
                        if (toolTipLabel == "Your Movie Rating") {
                            return "IMDb Rating: " + x;
                        } else {
                            return `IMDb Rating: ${min} - ${max}`;
                        }
                    }
                }
            }
        }
    }
});

// Graphs - Horizontal bar chart of genres.
const genreLabels = ["Drama", "Comedy", "Action", "Documentary", "Crime",
    "Horror", "Adventure", "Animation", "Other*", "Biography", "Short"];
const genreCtx = document.getElementById("horizontalGenreChart").getContext("2d");
let horizontalBarGenreDataset = [
    {
        label: "Count of Movies",
        data: [9902, 9733, 4739, 3843, 2556, 1975, 1684, 1665, 1479, 1226, 457],
        fill: false,
        borderWidth: 1,
        axis: "y",
        backgroundColor: 'rgba(128, 128, 128, 0.5)',
        borderColor: 'rgba(128, 128, 128, 1)'       
    }
];
let horizontalBarGenreChart = new Chart(genreCtx, {
    type: "bar",
    data: {
        labels: genreLabels,
        datasets: horizontalBarGenreDataset
    },
    options: {
        indexAxis: 'y',
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Count of Movies"
                }
            },
            y: {
                title: {
                    display: true,
                    text: "Genres"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Distribution of Movie Genres (n = 39.2K)"
            }
        }
    }
});

// Graphs - Line Graph Average IMDb Rating per decade.
const avgLineRatingCtx = document.getElementById("lineAvgRatingChart").getContext("2d");
let avgLineRatingChart = new Chart(avgLineRatingCtx, {
    type: 'line',
    data: {
        labels: [1880, 1890, 1900, 1910, 1920, 1930,
            1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010],
        datasets: [
            {
                label: "Average IMDb Rating by Decade",
                data: [5.90, 5.72, 6.55, 6.67, 7.17, 6.87, 6.92
                    , 6.77, 6.71, 6.51, 6.33, 6.32, 6.35, 6.24],
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderColor: 'rgba(128, 128, 128, 1)',
                borderWidth: 1               
            }
        ]
    }, 
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Average IMDb Rating"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Average IMDb Rating by Decade (n = 39.2K)"
            },
        }
    }
});

// Graphs - Bar Chart Average IMDb Rating by Genre.
const avgGenreCtx = document.getElementById("barChartGenreRatingAverage").getContext("2d");
let avgGenreBarChart = new Chart(avgGenreCtx, {
    type: 'bar',
    data: {
        labels: ['Horror', 'Action', 'Other', 'Adventure', 'Comedy', 'Family',
            'Crime', 'Short', 'Drama', 'Biography', 'Animation', 'Documentary'],
        datasets: [
            {
                label: "Average IMDb Rating by Genre",
                data: [4.89, 5.72, 5.96, 6.08, 6.37, 6.39,
                       6.40, 6.79, 6.79, 6.79, 6.84, 7.28],
                backgroundColor: 'rgba(128, 128, 128, 0.5)',
                borderColor: 'rgba(128, 128, 128, 1)',
                borderWidth: 1                     
            }
        ]
    }, 
    options: {
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Average IMDb Rating"
                }
            }
        },
        plugins: {
            title: {
                display: true,
                text: "Average IMDb Rating by Genre (n = 39.2K)"
            },
        }
    }
});
