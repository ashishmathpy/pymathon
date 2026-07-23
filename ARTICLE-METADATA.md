# PyMathon Article Metadata Convention

Use these YAML fields for new blog posts. Keep title, description, author, date, and categories specific to the article.

    ---
    title: "Clear article title"
    description: "A concise search-friendly summary of the article."
    author: "Ashish K. Srivastava"
    date: "YYYY-MM-DD"
    categories:
      - Topic
    difficulty: "Beginner | Intermediate | Advanced"
    prerequisites: "Knowledge expected before reading"
    estimated-reading-time: "N minutes"
    image: "../../image-file.png"
    image-alt: "Descriptive alternative text for the featured image"
    draft: false
    ---

Use draft: true while an article is unfinished. Add an article-information box near the beginning when those details are useful to readers.

## Editorial rule

PyMathon is a mathematics publication. Categories and prerequisites should
describe the mathematics itself. Do not use `Python for Mathematics` as a
category, and do not list Python as a prerequisite for a mathematical article.
Python may appear later as an optional tool for exploration, visualisation, or
verification, but it must not be presented as part of the mathematical proof.
