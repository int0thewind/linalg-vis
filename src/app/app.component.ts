import { Component, OnInit } from '@angular/core';
import { version as d3version } from 'd3';
import { VERSION as angularVersion } from '@angular/core';
import { version as mathjsVersion } from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'linalg-vis';

  githubInfo = {
    isValid: false,
    link: '',
    commit: '',
    date: '',
  };

  d3VersionInfo = d3version;

  mathJsVersionInfo = mathjsVersion;

  angularVersionInfo = angularVersion.full;

  readonly githubLink = 'https://api.github.com/repos/int0thewind/linalg-vis/commits';

  ngOnInit(): void {
    fetch(this.githubLink)
      .then(d => d.json())
      .then((req) => {
        this.githubInfo.commit = req[0].sha.substring(0, 6);
        this.githubInfo.link = req[0].html_url;
        this.githubInfo.date = req[0].commit.committer.date.substring(0, 10);
        this.githubInfo.isValid = true;
      })
      .catch(e => console.error(e));
  }
}
