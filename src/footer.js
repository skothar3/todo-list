import "./footer.css";
import githubIconSrc from "./images/github-mark.svg";
const copyright = document.createElement('p');
const githubLink = document.createElement('a');
const githubIcon = new Image();
const currentYear = new Date().getFullYear();

copyright.textContent = `Copyright © ${currentYear} skothar3`;
githubLink.href = 'https://github.com/skothar3';
githubIcon.src = githubIconSrc;
githubIcon.alt = 'Github logo';

githubLink.appendChild(githubIcon);

function insertFooter(footerElement) {
  footerElement.append(copyright, githubLink);
}

export default insertFooter;
