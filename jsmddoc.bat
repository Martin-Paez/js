set file=%1 


jsdoc2md %file% > output.md 


pandoc -s output.md -o output.html 


start output.html 
