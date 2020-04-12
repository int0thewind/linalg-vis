import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

const github = document.querySelector('p.description#github');

// Fetch GitHub info
fetch('https://api.github.com/repos/int0thewind/linalg-vis/commits')
  .then(d => d.json())
  .then((req) => {
    const commit = req[0].sha;
    const link = req[0].html_url;
    const date = req[0].commit.committer.date.substring(0, 10);
    github.innerHTML = `Latest Commit: <a href=${link} target="_blank">${commit.substring(0, 6)}</a> on ${date}`;
  })
  .catch((e) => { console.error(e); github.innerHTML = 'Failed to fetch latest commit history'; });
