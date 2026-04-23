import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');


document.querySelector('h1').textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');