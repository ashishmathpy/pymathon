# Google Search Console Setup for PyMathon

1. Open [Google Search Console](https://search.google.com/search-console/).
2. Add the URL-prefix property:

   https://ashishmathpy.github.io/pymathon/

3. Choose **HTML file** verification.
4. Download the verification HTML file supplied by Google.
5. Place that file unchanged in this project root, beside the project configuration file.
6. Run the Quarto render command.
7. Confirm that the same file appears unchanged in docs.
8. Commit and push the verification file together with the regenerated docs output.
9. Return to Search Console and click **Verify**.
10. Submit this sitemap:

    https://ashishmathpy.github.io/pymathon/sitemap.xml

11. Inspect the homepage and first article in Search Console.
12. Request indexing for the homepage and the first article.

The project configuration copies files named google*.html from the project root into docs, so do not rename the file that Google provides.
