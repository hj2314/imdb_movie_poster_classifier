<!doctype html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
	<link
		href="data:image/x-icon;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAP0cAAAAAACPQ6AAAhqEAAoeZADvo/wAAeZkAAGFuAAC2zwAio8UAENHrAAAAAAAAAAAAAAAAAAAAAAAAAAAAERERERERERERERERERERERFmZmZmZmYRFoiIiIiIiGFlqqqqqqqohmUUGBQRNBdGZRQYFBMUEEZlFBEUGBQRRmUUFxQYFBeGZRQXFBMUGYZlFBkUETQahmVaqqoqqqqGFlVVVVVVVWERZmZmZmZmERERERERERERERERERERERH//wAA//8AAMADAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAQAAwAMAAP//AAD//wAA"
		rel="icon" type="image/x-icon" />
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
	<style>
		.image-upload>input {
			display: none;
		}

		img.poster {
			cursor: pointer;
		}

		nav.bg-black {
			background-color: black;
		}

		h4.leftYellowBorder {
			border-left: 5px solid #F5C518;
			padding-left: 12px;
		}

		img.maxHeightGif {
			max-height: 400px;
		}

		img.maxHeightSpectrum {
			max-height: 300px;
		}
	</style>
	<title>Deep Learning with IMDb Movie Ratings and Genres</title>
	<meta name="description" content="Deep Learning with IMDb Movie Ratings and Genres">
</head>

<body>
	<div class="jumbotron jumbotron-fluid bg-dark text-white py-2">
		<div class="container">
			<!-- Fixed navbar -->
			<nav class="navbar-fluid navbar-dark bg-dark">
				<a class="navbar-brand" href="#">
					<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/IMDB_Logo_2016.svg/320px-IMDB_Logo_2016.svg.png"
						width="64" height="32" alt="">
				</a>
			</nav>
			<h1 class="display-5">Deep Learning with IMDb Movie Ratings and Genres</h1>
			<!-- Question 1 -->
			<h4 class="mt-5">Q1: Can you judge a movie by it's poster?</h4>


			<div class="row">
				<p>Upload an image of a movie poster or click on one of the examples to see if a deep learning algorithm
					can predict it's IMDb Rating and Genre.<br>Where does your selected movie stand against the 39.2K
					sampled IMDb movies?</p>
				<!-- Image upload div. -->
				<div class="col-md-2">
					<span class="image-upload">
						<label for="chooseFileImageId">
							<img id="imagePreviewId" class="img-thumbnail poster" alt="Upload Poster Image"
								src="https://i.imgur.com/5NTpZ4Z.jpg">
						</label>
						<input id="chooseFileImageId" class="form-control" type="file" name="chooseFileImageId"
							capture="environment" accept="image/*">
					</span>
				</div>
				<!-- Image examples. -->
				<div class="col-md-2">
					<img class="img-thumbnail poster" id="imageExampleId0" src="https://i.imgur.com/jhjYIll.jpg">
				</div>
				<div class="col-md-2">
					<img class="img-thumbnail poster" id="imageExampleId1" src="https://i.imgur.com/a4lXAkm.jpg">
				</div>
				<div class="col-md-2">
					<img class="img-thumbnail poster" id="imageExampleId2" src="https://i.imgur.com/kaDFQxn.jpg">
				</div>
				<div class="col-md-2">
					<img class="img-thumbnail poster" id="imageExampleId3" src="https://i.imgur.com/C61EAVb.jpg">
				</div>
				<div class="col-md-2">
					<img class="img-thumbnail poster" id="imageExampleId4" src="https://i.imgur.com/wKlhbg4.jpg">
				</div>
				<div class="col-md-12">
					<p id="statusDisplay">No movie poster selected.</p>
				</div>
			</div>
		</div>
	</div>
	<!-- Below the jumbotron. -->
	<div class="container">
		<div class="row">

			<!-- Predicted IMDb rating and genre bar. -->
			<div id="outputRow" class="row mt-4">
				<div class="col-md-6">
					<h4 class="leftYellowBorder">Predicted IMDb Rating</h4>
					<h5 id="predictRating">⭐ </h5>
				</div>
				<div class="col-md-6">
					<h4 class="leftYellowBorder">Genres <small class="text-secondary">(Confidence)</small>
					</h4>

					<h5 id="genreConfidenceId"></h5>

				</div>
			</div>

			<!-- Histogram and horizontal genre bar charts. -->
			<div class="col-md-6">
				<canvas id="histogramRatingChart" />
			</div>
			<div class="col-md-6">
				<canvas id="horizontalGenreChart" />
			</div>

			<!-- Q2: How do I know these predictions are accurate? -->
			<h4 class="leftYellowBorder mt-5">Q2: How do I know these predictions are accurate?</h4>
			<p>
				<span class="fst-italic">Data summary and motivations:</span> The movie rating and genre prediction
				algorithms were trained on a <a
					href="https:www.kaggle.com/datasets/neha1703/movie-genre-from-its-poster">
					dataset of 39.2K movie posters</a> found on <a href="https:www.kaggle.com/">Kaggle</a>.
				The movies date back from 1874 to 2022, IMDb ratings are on a scale of one to ten, and span
				across 26 different genres. The main motivations of this project was to explore
				<a href="https:en.wikipedia.org/wiki/Transfer_learning">transfer learning</a> in computer vision
				applications while exploring new machine learning tools, data visualization, and web frameworks. In
				particular, <a href="https:github.com/fastai/fastbook">the fast.ai python library</a> for transfer
				learning, <a href="https:huggingface.co/spaces">Huggingface spaces</a> to host machine learning
				applications, <a href="https:github.com/gradio-app/gradio">the Gradio API</a> to create
				flexible data flows, <a href="https:pytorch.org/hub/pytorch_vision_resnet/">RESNET18</a>
				a pre-trained model which already learned rich feature representations for a wide range of
				different object categories, <a href="https:getbootstrap.com/docs/5.0/getting-started/introduction/">
					the Bootstrap web framework</a> for a highly iterable responsive web user-experience, and <a
					href="https:www.chartjs.org/">Chart.js</a> for responsive charts built on top of JavaScript. Using
				these tools we can build a shareable, self-contained dashboard which incorporates an end-to-end deep
				learning model.
			</p>
			<p>
				<span class="fst-italic">IMDb Rating regression model evaluation:</span> With the IMDb rating
				regression algorithm, the model was able to achieve a (Mean Absolute Error) MAE of 0.79. This
				outperforms naive models such as median, mean, and mode, which achieve an MAE of 0.88, 0.89, and 1.02
				respectively. When we sample some predicted scores in our test set, we can see that the algorithm has
				some predictive qualities in assessing movie quality (or IMDb rating).
				Figure 1 shows a sample of six movie poster with a predicted score of two or below. Who can forget
				timeless classics like "3 Little Ninjas", "Bigfoot Terror", and "Age of Ice"! Figure 2 shows a sample
				of six movie posters with a predicted rating greater than 7.9. Although there seems to be some signal
				which indicates what constitutes a "bad" poster vs a "good" poster from this small twelve movie sample
				size, let's see if we can explore the movie image data at a macroscopic scale in our next chapter.
			</p>
			<div class="col-md-6">
				<figure class="figure">
					<a href="https://imgur.com/5QJBj8E">
						<img class="img-thumbnail maxHeightGif" src="https://i.imgur.com/5QJBj8E.gif"></a>
					<figcaption class="figure-caption text-center">Figure 1: Six movie posters with a low predicted
						IMDb rating (less than two). The three numbers below the posters represent predicted score /
						actual score / and absolute error.</figcaption>
				</figure>
			</div>
			<div class="col-md-6">
				<figure class="figure">
					<a href="https://imgur.com/ntXCwU0">
						<img class="img-thumbnail maxHeightGif" src="https://i.imgur.com/ntXCwU0.jpg"></a>
					<figcaption class="figure-caption text-center">Figure 2: Six movie posters with a high predicted
						IMDb rating (greater than 7.9). The three numbers below the posters represent predicted score
						/ actual score / and absolute error.</figcaption>
				</figure>
			</div>

			<p>
				<span class="fst-italic">IMDb Genre model evaluation:</span> With the Genre classifier, the model was
			</p>

			<!-- Q3: How can we aggregate and compare our images across ratings, genres, and other dimensions? -->
			<h4 class="leftYellowBorder mt-5">Q3: How can we aggregate and compare images across other dimensions?</h4>
			<div class="col-md-12">
				<p>
					One method to view movie posters at a macroscopic scale would be to obtain the pixel colors (a red,
					green, blue number ranging from 0-255) for each poster and show the distribution of
					colors (% of red pixels, % of black pixels, etc.). This results in a
					combination of 16.7 million or 256x10<sup>3</sup> number of colour combinations.
					In order to efficiently represent 16.7M colors on a 2D plane we can reduce the
					number of color combinations by taking each pixel's
					<a href="https://en.wikipedia.org/wiki/CIELAB_color_space">CIELAB color space</a> and find the
					closest primary parent color, reducing the number of colors to 700. I used the CIELAB
					color space to group colors is that unlike the RGB color model, the CIELAB coordinate
					is designed to approximate human vision. Colors which have CIELAB coordinates that
					are similar to each-other are similar in color. In contrast, RGB values which are close together,
					may not. For example, a pixel <span style="color:#5680e0">&#9632;</span>
					with a blue CIELAB color space cof 4.1x10<sup>-6</sup>, 2.81x10<sup>-7</sup>, -4.77x10<sup>-6</sup>
					would aggregate to a blue parent color #006de0 <span style="color:#006de0">&#9632;</span>
					since their CIELAB numerical coordinates are close to each other
					(small Euclidean distance between the three values) and as a result are visually similar in color.
					In contrast, the RGB values are (81, 127, 222) and (0, 109, 224) respsectively, so grouping RGB
					values which have a small Euclidean distance between them would not yield a
					smooth color gradient. Figure 3 below represents all colors used across 39.K movie
					posters spanning nearly 150 years. We can see that 75.5% of the colors used will span
					the black and white spectrum. On the other hand, certain shades of red (#ff0300)
					only appear %0.00004262 of the time. We can now take this data and analyze our color
					spectrum across several dimensions: time, genre, and ratings.
				</p>
			</div>
			<div class="col-md-12">
				<p class="fw-light">Color Spectrum of All Movies from 1874-2022</p>
				<figure class="figure">

					<img class="img-thumbnail maxHeightSpectrum" src="https://i.imgur.com/MRP0HOx.jpg">
					<figcaption class="figure-caption text-center">Figure 3: This is a reduced (16.7M to 700) color
						spectrum of all the pixels found in the 39.2K movie posters spanning nearly the
						last 150 years.
						<br>75.5% of the colors used span the black and white spectrum.
					</figcaption>
				</figure>
			</div>
			<div class="col-md-12 mt-5">
				<p>
					Next let's look at the color spectrum across each decade. I excluded movies from 1870 and 2020
					since they had less than three movies per decade. We can see four general trends when we look
					at the color spectrum across time.
				</p>
			</div>
			<div class="col-md-12">
				<p class="fw-light">Color Spectrum of Movies by Decade</p>
				<figure class="figure">
					<img class="img-thumbnail maxHeightSpectrum" src="https://i.imgur.com/UN0BEak.jpg">
					<figcaption class="figure-caption text-center">Figure 4: This is a color spectrum of all the pixels
						across 39.2K movie poster by decade. We can see four distinct eras:
						<br> 1880-1900 Monochrome black and white, 1910-1950 The dawn of color,
						1970-2010 Trending to darkness, 1990-2010 Orange and bluecontrasts.
					</figcaption>
				</figure>
			</div>

			<div class="col-md-3">
				<figure class="figure">
					<a href="https://imgur.com/xUMZqBV"><img class="img-thumbnail maxHeightSpectrum"
							src="https://i.imgur.com/xUMZqBV.png"></a>
					<figcaption class="figure-caption text-center">Figure 5: 1880-1900 Black and white.
					</figcaption>
				</figure>
			</div>
			<div class="col-md-8">
				<figure class="figure">
					<p><span class="fst-italic">1880-1900, Monochrome Black and White:</span> This was the
						emergence
						of the movie industry where directors were experimenting with early motion picture technologies.
						The technology was limited to black and white <a href="https://imgur.com/8xSEmph">(or was it?
							🤣)</a> and the movie posters were often screen stills.
						The blue colors we see were from the colorized black and white screen stills from
						series of short films called <a href="https://www.imdb.com/title/tt0361921/">Monkeyshines</a>.
						This film is possibly the
						<a href="https://www.imdb.com/title/tt0361921/trivia?item=tr0594011">"first film to have been
							produced in the USA, and the first film series."</a>
					</p>
			</div>
			<div class="col-md-1">
				<figure class="figure">
					<a href="https://imgur.com/8xSEmph"><img class="img-thumbnail maxHeightSpectrum"
							src="https://i.imgur.com/8xSEmph.png"></a>
				</figure>
			</div>
			<div class="col-md-3">
				<figure class="figure">
					<a href="https://imgur.com/VB5qsdq"><img class="img-thumbnail maxHeightSpectrum"
							src="https://i.imgur.com/VB5qsdq.png"></a>
					<figcaption class="figure-caption text-center">Figure 6: 1910-1950 The Dawn of Color.
					</figcaption>
				</figure>
			</div>
			<div class="col-md-9">
				<p><span class="fst-italic">1910-1950, The Dawn of Color:</span> The invention of the four
					color wet process, known as CMYK (Cyan, Magenta, Yellow, and Key (black)) printing gave way for
					producers to create posters with a nearly unlimited color palette at low costs. We can see
					this in our color spectrum starting from 1910.
				</p>
			</div>
			<div class="col-md-3">
				<figure class="figure">
					<a href="https://imgur.com/RbJEbgr"><img class="img-thumbnail maxHeightSpectrum"
							src="https://i.imgur.com/RbJEbgr.png"></a>
					<figcaption class="figure-caption text-center">Figure 7: 1970-2010 Trending towards Darkness.
					</figcaption>
				</figure>
			</div>
			<div class="col-md-9">
				<p><span class="fst-italic">1970-20210, Trending Towards Darkness:</span> We can see a trend towards
					darker movie posters some movie theorists believe this is related to the popularity of
					action, thrillers, and sci-fi of the past decade may have led to a darker and more "masculine"
					palette. Some film theorists speculate that 9/11 and the economic downturn have led the public to
					crave grittier stories, since a sugarcoated world no longer feels real to them. Compare the '90s-era
					Batman and Bond movies — full of camp and comedy — to their gritty modern counterparts and you'll
					see a distinct difference in style.
				</p>
			</div>
			<div class="col-md-3">
				<figure class="figure">
					<a href="https://imgur.com/KQBEYr5"><img class="img-thumbnail maxHeightSpectrum"
							src="https://i.imgur.com/KQBEYr5.png"></a>
					<figcaption class="figure-caption text-center">Figure 8: 1990-2010 Orange and Blue.
					</figcaption>
				</figure>
			</div>
			<div class="col-md-9">
				<p><span class="fst-italic">1990-20210, Orange and Blue:</span> Blue and orange are a powerful
					combination because unlike other color pairings — red and green, pink and blue — they don't conjure
					cultural associations that are already set in stone. They sit on opposite sides of the color wheel,
					evoking the two poles of hot and cold and explosive action. And Hollywood ad makers know it.
				</p>
			</div>
		</div>


		<div class="col-md-12 mt-5">
			<p class="fw-light">Color Spectrum of Movies by Genre</p>
			<figure class="figure">
				<img class="img-thumbnail maxHeightSpectrum" src="https://i.imgur.com/VBWQH2j.png">
				<figcaption class="figure-caption text-center">Figure 9: Color Spectrum of Movies by Genre.</figcaption>
			</figure>
			<p>
				We can see
			</p>
		</div>

	</div>
	</div>
	<script src="regressionClassification.js" />
	</script>
</body>

</html>
