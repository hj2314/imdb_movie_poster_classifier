# IMDb Movie Poster Classifier

Can a model guess a movie's rating and genre from its poster alone?

Built in 2023, pre-LLM — ResNet18 transfer learning trained with fast.ai,
back when this took more than a prompt.

**[Live demo](https://hj2314.github.io/imdb_movie_poster_classifier/)** —
upload any movie poster, or click one of the examples.

Two fast.ai models make predictions from the poster image:

- **IMDb rating** (regression, 1–10)
- **Top-3 genres** with confidence (classification)

Your poster's predictions are plotted against the distributions of the
39.2K-movie IMDb training set, so you can see exactly where it lands —
including how far the model missed on the example posters with known ratings.

## How it works

- **Frontend** — static HTML/JS (this repo), served by GitHub Pages.
  No build step, no backend of its own.
- **Models** — fast.ai, hosted as Hugging Face Spaces
  ([moviescoreregression](https://huggingface.co/spaces/hh871/moviescoreregression),
  [moviegenreclassifier](https://huggingface.co/spaces/hh871/moviegenreclassifier)),
  called from the browser via `@gradio/client`.
- **Charts** — Chart.js: rating histogram, genre distribution, average rating
  by decade and by genre, all from the training data.

## Notes

- The first prediction may take a while if the Hugging Face Spaces are
  cold-starting. Subsequent ones are fast.
- Fun finding from the training data: documentaries average 7.28 on IMDb,
  horror 4.89 — the model learns poster aesthetics correlate with both.
