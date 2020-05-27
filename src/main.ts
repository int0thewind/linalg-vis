import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { version as d3version } from 'd3';
import { VERSION as angularVersion } from '@angular/core';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

// Fetch install info
const version = document.querySelector('p.desc#version');
version.innerHTML = `Built with <a href='https://d3js.org'>D3.js ${d3version}</a> and <a href='https://angular.io'>Angular ${angularVersion.full}</a>`;

// Fetch GitHub info
const github = document.querySelector('p.desc#github');

fetch('https://api.github.com/repos/int0thewind/linalg-vis/commits')
  .then(d => d.json())
  .then((req) => {
    const commit = req[0].sha;
    const link = req[0].html_url;
    const date = req[0].commit.committer.date.substring(0, 10);
    github.innerHTML = `Latest Commit: <a href=${link} target="_blank">${commit.substring(0, 6)}</a> on ${date}`;
  })
  .catch((e) => { console.error(e); github.innerHTML = 'Failed to fetch latest commit history'; });
