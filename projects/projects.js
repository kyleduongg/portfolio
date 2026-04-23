import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');

const projectsContainer = document.querySelector('.projects');
const title = document.querySelector('.projects-title');

const count = projects.length;
title.textContent = `${count} Projects`;

renderProjects(projects, projectsContainer, 'h2');