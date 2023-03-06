#!/bin/bash

# Get JavaScript and CSS file names
js_file=$(ls *.js)
css_file=$(ls *.css)

# Replace script tag src attribute
sed 's|<script src="/temperature/static/assets/index-[0-9a-f]\{8\}.js" type="module" crossorigin></script>|<script src="/temperature/static/assets/'"$js_file"'" type="module" crossorigin></script>|g; s|<link href="/temperature/static/assets/index-[0-9a-f]\{8\}.css" rel="stylesheet" >|<link href="/temperature/static/assets/'"$css_file"'" rel="stylesheet" >|g' timeChat_source.html > timeChat.html



echo "replace done!"
