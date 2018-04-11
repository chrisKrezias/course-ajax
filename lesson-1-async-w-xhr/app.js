(function() {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    function addImage() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data && data.results && data.results[0]) {
            const firstImage = data.results[0];
            htmlContent = `<figure>
        		<img src="${firstImage.urls.regular}" alt="${searchedForText}">
        		<figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        	</figure>`;
        } else {
            htmlContent = '<div class="error-no-articles">No images available</div>';
        }
        responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
    }

    function addArticles() {
        let htmlContent = '';
        const data = JSON.parse(this.responseText);

        if (data.response && data.response.docs && data.response.docs.length > 1) {
            htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
        			<h2><a href="${article.web_url}">${article.headline.main}</a></h2>
        			<p>${article.snippet}</p>
        		</li>`).join('') + '</ul>';
        } else {
            htmlContent = '<div class="error-no-articles">No articles available</div>';
        }
        responseContainer.insertAdjacentHTML('beforeend', htmlContent);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.onload = addImage;
        // unsplashRequest.onerror = function(err) {
        //     requestError(err, 'image');
        // };
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 57b46942eeeced157423780086560c7bcc53216eb1642035cd68dd4540bf96d9');
        unsplashRequest.send();

        const articleRequest = new XMLHttpRequest();

        articleRequest.onload = addArticles;
        // articleRequest.onerror = function(err) {
        //     requestError(err, 'articles');
        // };
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=58968c67d937448db2b1b6d8ca8c11f6`);
        articleRequest.send();
    });
})();